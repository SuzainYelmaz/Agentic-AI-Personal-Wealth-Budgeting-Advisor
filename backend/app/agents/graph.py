"""LangGraph workflow builder — assembles the 4-node wealth advisor pipeline."""

from langgraph.graph import StateGraph, END
from app.agents.state import WealthAdvisorState
from app.agents.data_fetch import data_fetch_node
from app.agents.categorizer import categorizer_node
from app.agents.budget_analyst import budget_analyst_node
from app.agents.advisor import advisor_node


def _should_continue(state: WealthAdvisorState) -> str:
    """Route to END if critical errors occurred, otherwise continue."""
    if state.get("errors") and len(state["errors"]) > 2:
        return "end"
    return "continue"


def build_wealth_advisor_graph():
    """Build and compile the LangGraph wealth advisor workflow."""
    graph = StateGraph(WealthAdvisorState)

    graph.add_node("DataFetchAgent", data_fetch_node)
    graph.add_node("CategorizerAgent", categorizer_node)
    graph.add_node("BudgetAnalystAgent", budget_analyst_node)
    graph.add_node("AdvisorAgent", advisor_node)

    graph.set_entry_point("DataFetchAgent")

    graph.add_conditional_edges("DataFetchAgent",
        _should_continue, {"continue": "CategorizerAgent", "end": END})
    graph.add_conditional_edges("CategorizerAgent",
        _should_continue, {"continue": "BudgetAnalystAgent", "end": END})
    graph.add_edge("BudgetAnalystAgent", "AdvisorAgent")
    graph.add_edge("AdvisorAgent", END)

    return graph.compile()


# Pre-compiled graph singleton
wealth_advisor_graph = build_wealth_advisor_graph()
