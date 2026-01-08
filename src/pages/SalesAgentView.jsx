import { useState, useMemo } from "react";
import { useLeadContext } from "../contexts/leadContext";
import { useFetch } from "../useFetch";
import { Link } from "react-router-dom";

/* ================= SIDEBAR ================= */

function Sidebar() {
  return (
    <aside>
      <Link to="/">Back to Dashboard</Link>
    </aside>
  );
}

/* ================= AGENT FILTERS ================= */

function AgentFilters({ status, setStatus }) {
  const statuses = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];

  return (
    <div>
      <strong>Filter by Status:</strong>{" "}
      {statuses.map((s) => (
        <button key={s} onClick={() => setStatus(s)}>
          {s}
        </button>
      ))}
      <button onClick={() => setStatus("")}>All</button>
    </div>
  );
}

/* ================= SORT CONTROLS ================= */

function AgentSortControls({ setSortType }) {
  return (
    <div>
      <strong>Sort by:</strong>{" "}
      <button onClick={() => setSortType("priority")}>
        Priority
      </button>
      <button onClick={() => setSortType("timeToClose")}>
        Time to Close
      </button>
      <button onClick={() => setSortType("")}>Clear</button>
    </div>
  );
}

/* ================= LEAD LIST ================= */

function AgentLeadList({ leads }) {
  if (leads.length === 0) {
    return <p>No leads assigned</p>;
  }

  return (
    <ul>
      {leads.map((lead) => (
        <li key={lead._id}>
          {lead.name} — {lead.status} — {lead.priority}
        </li>
      ))}
    </ul>
  );
}

/* ================= AGENT SECTION ================= */

function AgentSection({ agentName, leadData }) {
  const [status, setStatus] = useState("");
  const [sortType, setSortType] = useState("");

  const priorityRank = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const agentLeads = useMemo(() => {
    return leadData
      .filter(
        (lead) =>
          lead.salesAgent?.name === agentName &&
          (!status || lead.status === status)
      )
      .sort((a, b) => {
        if (sortType === "priority") {
          return priorityRank[a.priority] - priorityRank[b.priority];
        }
        if (sortType === "timeToClose") {
          return a.timeToClose - b.timeToClose;
        }
        return 0;
      });
  }, [leadData, agentName, status, sortType]);

  return (
    <section>
      <h2>{agentName}</h2>

      <AgentFilters status={status} setStatus={setStatus} />

      <AgentSortControls setSortType={setSortType} />

      <AgentLeadList leads={agentLeads} />
    </section>
  );
}

/* ================= MAIN ================= */

export default function SalesAgentView() {
  const { leadData } = useLeadContext();

  const urlAgents = "http://localhost:3000/api/agents";
  const { data: agentsRes, loading } = useFetch(urlAgents, {
    allAgents: [],
  });

  if (loading) return <p>Loading agents...</p>;

  return (
    <div>
      <h1>Leads by Sales Agent</h1>

      <Sidebar />

      {agentsRes.allAgents.map((agent) => (
        <AgentSection
          key={agent._id}
          agentName={agent.name}
          leadData={leadData}
        />
      ))}
    </div>
  );
}
