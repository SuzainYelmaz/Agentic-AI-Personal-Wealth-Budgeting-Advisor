"""Node D — AdvisorAgent: Generates a tailored, step-by-step financial advisory plan."""

import json
from app.agents.state import WealthAdvisorState
from app.services.openrouter import get_llm
from app.tools.supabase_tools import save_advisory_report

ADVISOR_PROMPT = """You are an expert personal financial advisor. Generate a comprehensive advisory plan.

User Profile: {profile}
Month: {month}/{year}
Total Transactions: {tx_count}

Spending Summary:
{spending_summary}

Budget Goals:
{budget_goals}

Generate a JSON response with this exact structure:
{{
  "summary": "Executive summary of the user's financial health (2-3 sentences)",
  "total_income": <number>,
  "total_spent": <number>,
  "savings_rate": <percentage as decimal>,
  "spending_breakdown": [same as spending summary provided],
  "action_steps": [
    {{"step_number": 1, "title": "...", "description": "...", "impact": "Save $X/month", "difficulty": "easy|medium|hard"}}
  ],
  "risk_alerts": ["alert1", "alert2"],
  "month": "{year}-{month:02d}"
}}

Provide 5-7 actionable steps. Be specific with dollar amounts. Return ONLY valid JSON."""


def _format_spending(summary: list[dict]) -> str:
    """Format spending summary for the LLM prompt."""
    return "\n".join(f"- {s['category']}: ${s['total_spent']:.2f} / ${s['budget_limit']:.2f} ({s['status']})"
                     for s in summary)


def _format_goals(goals: list[dict]) -> str:
    """Format budget goals for the LLM prompt."""
    return "\n".join(f"- {g['category']}: ${g['monthly_limit']:.2f} (priority: {g['priority']})"
                     for g in goals)


def _parse_plan(response_text: str) -> dict:
    """Parse the LLM advisory plan response."""
    text = response_text.strip().strip("```json").strip("```").strip()
    return json.loads(text)


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
        response = get_llm(temperature=0.3).invoke(prompt)
        plan = _parse_plan(response.content)
        month_key = f"{state['year']}-{state['month']:02d}"
        save_advisory_report.invoke({"user_id": state["user_id"], "month": month_key, "report": plan})
        return {"advisory_plan": plan, "messages": [f"AdvisorAgent: Plan generated for {month_key}"]}
    except Exception as e:
        return {"errors": [f"Advisor error: {e}"]}
