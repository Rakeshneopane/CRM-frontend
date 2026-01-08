import { Link } from "react-router-dom";
import { useFetch } from "../useFetch";

/* ================= SIDEBAR ================= */

function Sidebar() {
  return (
    <aside>
      <h2>Sidebar</h2>
      <ul>
        <li>
          <Link to="/">Back to Dashboard</Link>
        </li>
      </ul>
    </aside>
  );
}

/* ================= SALES AGENT LIST ================= */

function SalesAgentList({ agents }) {
  if (!agents || agents.length === 0) {
    return <p>No sales agents found.</p>;
  }

  return (
    <ul>
      {agents.map((agent) => (
        <li key={agent._id}>
          Agent: {agent.name}, Email: {agent.email}
        </li>
      ))}
    </ul>
  );
}

/* ================= MAIN ================= */

export default function SalesManagement() {
  const url = "http://localhost:3000/api/agents";
  const { data: salesAgents } = useFetch(url, { allAgents: [] });

  return (
    <div>
      <h1>Sales Agent Management</h1>

      <Sidebar />

      <section>
        <h2>Sales Agent List</h2>

        <SalesAgentList agents={salesAgents.allAgents} />

        <Link to="/addNewSalesAgent">
          <button>Add New Agent</button>
        </Link>
      </section>
    </div>
  );
}
