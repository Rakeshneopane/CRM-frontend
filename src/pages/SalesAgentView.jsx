import { useState, useMemo } from "react";
import { useLeadContext } from "../contexts/leadContext";
import { useFetch } from "../useFetch";
import { Link } from "react-router-dom";

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
      <Link to="/">Back to Dashboard</Link>

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
    // <div
    //   style={{
    //     border: "1px solid #444",
    //     margin: "1rem 0",
    //     padding: "1rem",
    //   }}
    // >
    <div>
      <h2>{agentName}</h2>

      {/* Filters */}
      <div>
        {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map(
          (s) => (
            <button key={s} onClick={() => setStatus(s)}>
              {s}
            </button>
          )
        )}
        <button onClick={() => setStatus("")}>All</button>
      </div>

      {/* Sorting */}
      <div>
        <button onClick={() => setSortType("priority")}>Priority</button>
        <button onClick={() => setSortType("timeToClose")}>
          Time to Close
        </button>
        <button onClick={() => setSortType("")}>Clear</button>
      </div>

      {/* Lead List */}
      {agentLeads.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No leads assigned</p>
      ) : (
        <ul>
          {agentLeads.map((lead) => (
            <li key={lead._id}>
              {lead.name} — {lead.status} — {lead.priority}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
