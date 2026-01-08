import { useState } from "react";
import { Link } from "react-router-dom";
import { useLeadContext } from "../contexts/leadContext";

/* ================= SIDEBAR ================= */

function Sidebar() {
  return (
    <aside>
      <h2>Sidebar</h2>
      <ul>
        <Link to="/">
          <li>Back to Dashboard</li>
        </Link>
      </ul>
    </aside>
  );
}

/* ================= LEAD OVERVIEW ================= */

function LeadOverview({ leads }) {
  if (leads.length === 0) return <p>No leads found.</p>;

  return (
    <ul>
      {leads.map((lead, index) => (
        <li key={lead._id}>
          Lead {index + 1}
          <ul>
            <li>Status – {lead.status}</li>
            <li>Sales agent – {lead.salesAgent?.name}</li>
            <li>Priority – {lead.priority}</li>
            <li>Time to close – {lead.timeToClose}</li>
          </ul>
        </li>
      ))}
    </ul>
  );
}

/* ================= FILTERS ================= */

function Filters({ quickFilter, setQuickFilter, agents }) {
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  return (
    <div>
      <h4>Filters</h4>

      {/* Status Filter */}
      <div>
        <strong>Status:</strong>{" "}
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() =>
              setQuickFilter({ ...quickFilter, status })
            }
          >
            {status}
          </button>
        ))}
        <button
          onClick={() =>
            setQuickFilter({ ...quickFilter, status: "" })
          }
        >
          All
        </button>
      </div>

      {/* Sales Agent Filter */}
      <div>
        <strong>Sales Agent:</strong>{" "}
        <button
          onClick={() =>
            setQuickFilter({ ...quickFilter, salesAgent: "" })
          }
        >
          All Agents
        </button>

        {agents.map((agent) => (
          <button
            key={agent}
            value={agent}
            onClick={(e) =>
              setQuickFilter({
                ...quickFilter,
                salesAgent: e.target.value,
              })
            }
          >
            {agent}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================= SORT CONTROLS ================= */

function SortControls({ setSortType }) {
  return (
    <div>
      <h4>Sort By</h4>
      <button onClick={() => setSortType("priority")}>
        Priority
      </button>
      <button onClick={() => setSortType("timeToClose")}>
        Time to close
      </button>
      <button onClick={() => setSortType("")}>
        Clear Sort
      </button>
    </div>
  );
}

/* ================= MAIN PAGE ================= */

export default function LeadListPage() {
  const { leadData, uniqueSalesAgentName } = useLeadContext();

  const [quickFilter, setQuickFilter] = useState({
    status: "",
    salesAgent: "",
  });

  const [sortType, setSortType] = useState("");

  const priorityObject = {
    High: 1,
    Medium: 2,
    Low: 3,
  };

  const processedLead = leadData
    .filter((lead) => {
      const matchStatus =
        !quickFilter.status || lead.status === quickFilter.status;
      const matchAgent =
        !quickFilter.salesAgent ||
        lead.salesAgent?.name === quickFilter.salesAgent;
      return matchStatus && matchAgent;
    })
    .sort((a, b) => {
      switch (sortType) {
        case "priority":
          return (
            priorityObject[a.priority] -
            priorityObject[b.priority]
          );
        case "timeToClose":
          return a.timeToClose - b.timeToClose;
        default:
          return 0;
      }
    });

  return (
    <div>
      <h1>Lead List</h1>

      <Sidebar />

      <section>
        <h2>Lead Overview</h2>
        <LeadOverview leads={processedLead} />
      </section>

      <section>
        <Filters
          quickFilter={quickFilter}
          setQuickFilter={setQuickFilter}
          agents={uniqueSalesAgentName}
        />
      </section>

      <section>
        <SortControls setSortType={setSortType} />
      </section>

      <Link to="/newLead">
        <button>Add New Lead</button>
      </Link>
    </div>
  );
}
