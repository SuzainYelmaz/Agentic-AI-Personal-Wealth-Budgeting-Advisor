"""Node D — AdvisorAgent: Generates a tailored, step-by-step financial advisory plan."""

import json
import re
from app.agents.state import WealthAdvisorState
from app.services.openrouter import get_llm
from app.tools.supabase_tools import save_advisory_report

# Tighter prompt: fewer words → fewer tokens → less truncation risk
ADVISOR_PROMPT = """You are a concise personal financial advisor. Return ONLY a valid JSON object.

Profile: {profile}
Month: {month}/{year} | Transactions: {tx_count}

Spending (category: spent / limit / status):
{spending_summary}

Budget Goals:
{budget_goals}

Return this JSON (no extra text, no markdown, no trailing commas):
{{
  "summary": "<2 sentence financial health summary>",
  "total_income": <number>,
  "total_spent": <number>,
  "savings_rate": <decimal 0-1>,
  "spending_breakdown": [],
  "action_steps": [
    {{"step_number": 1, "title": "<short title>", "description": "<one sentence>", "impact": "Save $X/month", "difficulty": "easy"}},
    {{"step_number": 2, "title": "<short title>", "description": "<one sentence>", "impact": "Save $X/month", "difficulty": "medium"}},
    {{"step_number": 3, "title": "<short title>", "description": "<one sentence>", "impact": "Save $X/month", "difficulty": "medium"}},
    {{"step_number": 4, "title": "<short title>", "description": "<one sentence>", "impact": "Save $X/month", "difficulty": "hard"}},
    {{"step_number": 5, "title": "<short title>", "description": "<one sentence>", "impact": "Save $X/month", "difficulty": "easy"}}
  ],
  "risk_alerts": ["<alert 1 max 15 words>", "<alert 2 max 15 words>"],
  "month": "{year}-{month:02d}"
}}"""


def _format_spending(summary: list[dict]) -> str:
    """Format spending summary for the LLM prompt."""
    return "\n".join(
        f"- {s['category']}: ${s['total_spent']:.2f} / ${s['budget_limit']:.2f} ({s['status']})"
        for s in summary
    )


def _format_goals(goals: list[dict]) -> str:
    """Format budget goals for the LLM prompt."""
    return "\n".join(
        f"- {g['category']}: ${g['monthly_limit']:.2f} ({g['priority']})"
        for g in goals
    )


def _recover_truncated_json(text: str) -> str:
    """
    Attempt to repair a JSON string that was truncated mid-way.
    Strategy: strip to the last complete top-level key, then close all open
    brackets/braces so json.loads can succeed.
    """
    # Count open vs closed braces/brackets to determine what needs closing
    depth_brace   = 0
    depth_bracket = 0
    in_string     = False
    escape_next   = False

    last_safe_pos = 0  # position just after the last complete key-value pair

    for i, ch in enumerate(text):
        if escape_next:
            escape_next = False
            continue
        if ch == "\\" and in_string:
            escape_next = True
            continue
        if ch == '"' and not escape_next:
            in_string = not in_string
            continue
        if in_string:
            continue

        if ch == "{":
            depth_brace += 1
        elif ch == "}":
            depth_brace -= 1
            if depth_brace == 1:
                last_safe_pos = i + 1  # safe after closing an inner object
        elif ch == "[":
            depth_bracket += 1
        elif ch == "]":
            depth_bracket -= 1
            if depth_bracket == 0 and depth_brace == 1:
                last_safe_pos = i + 1  # safe after closing a top-level array

    # Truncate to last safe point and close the outer object
    truncated = text[:last_safe_pos].rstrip().rstrip(",")
    # Close any still-open arrays/objects
    truncated += "]" * max(0, depth_bracket) + "}" * max(0, depth_brace)
    return truncated


def _parse_plan(response_text: str) -> dict:
    """Parse the LLM advisory plan response with robust extraction + truncation recovery."""
    text = response_text.strip()

    # Strip markdown code fences
    text = re.sub(r"^```[a-z]*\n?", "", text).rstrip("`").strip()

    # Find JSON object boundaries
    start = text.find("{")
    if start >= 0:
        text = text[start:]

    # First attempt: parse as-is
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Second attempt: recover truncated JSON
    try:
        recovered = _recover_truncated_json(text)
        print(f"[AdvisorAgent] Recovered truncated JSON ({len(recovered)} chars)")
        return json.loads(recovered)
    except json.JSONDecodeError as e2:
        raise ValueError(f"Could not parse or recover JSON: {e2}") from e2


def advisor_node(state: WealthAdvisorState) -> dict:
    """Generate and save the complete financial advisory plan."""
    try:
        prompt = ADVISOR_PROMPT.format(
            profile=json.dumps(state.get("user_profile", {})),
            month=state["month"], year=state["year"],
            tx_count=len(state.get("transactions", [])),
            spending_summary=_format_spending(state.get("spending_summary", [])),
            budget_goals=_format_goals(state.get("budget_goals", [])),
        )
        # Raise max_tokens to 8000 to avoid mid-JSON truncation
        response = get_llm(temperature=0.2, max_tokens=8000).invoke(prompt)
        print(f"[AdvisorAgent] Raw response length: {len(response.content)} chars")
        print(f"[AdvisorAgent] Response preview: {response.content[:300]}...")

        plan = _parse_plan(response.content)

        # Always override spending_breakdown with structured data from BudgetAnalystAgent
        # (LLM may return strings; we want dicts)
        plan["spending_breakdown"] = state.get("spending_summary", [])

        month_key = f"{state['year']}-{state['month']:02d}"
        save_advisory_report.invoke({"user_id": state["user_id"], "month": month_key, "report": plan})
        print(f"[AdvisorAgent] Plan saved for {month_key}")
        return {"advisory_plan": plan, "messages": [f"AdvisorAgent: Plan generated for {month_key}"]}

    except Exception as e:
        raw = response.content if "response" in dir() else "no response"  # noqa
        print(f"[AdvisorAgent] ERROR: {e}")
        print(f"[AdvisorAgent] Raw content:\n{raw}")
        return {"errors": [f"Advisor error: {e}"]}
