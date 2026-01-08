import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLeadContext } from "../contexts/leadContext";

/* ================= NAVBAR ================= */

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <NavLink className="navbar-brand fw-bold" to="/">
        Anvaya CRM
      </NavLink>

      <ul className="navbar-nav ms-auto gap-3">
        <li className="nav-item">
          <NavLink className="nav-link" to="/leadList">Leads</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/leadsByStatus">Status</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/SalesAgentView">Agents</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/reports">Reports</NavLink>
        </li>
      </ul>
    </nav>
  );
}

/* ================= SIDEBAR ================= */

function Sidebar() {
  return (
    <ul className="list-group">
      <Link to="/leadsByStatus" className="list-group-item list-group-item-action">
        Leads by Status
      </Link>
      <Link to="/leadList" className="list-group-item list-group-item-action">
        Sales Lead List
      </Link>
      <Link to="/SalesAgentView" className="list-group-item list-group-item-action">
        Sales Agent View
      </Link>
      <Link to="/reports" className="list-group-item list-group-item-action">
        Reports
      </Link>
      <Link to="/SalesManagement" className="list-group-item list-group-item-action">
        Sales Management
      </Link>
    </ul>
  );
}

/* ================= LEAD LIST ================= */

function LeadList({ leads }) {
  return (
    <ul className="list-group">
      {leads.map((lead, index) => (
        <Link
          key={lead._id}
          to={`/leadManagement/${lead._id}`}
          className="list-group-item list-group-item-action"
        >
          {index + 1}. {lead.name}
        </Link>
      ))}
    </ul>
  );
}

/* ================= STATUS SUMMARY ================= */

function LeadStatusSummary({ filterFunction }) {
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  return (
    <ul className="list-group">
      {statuses.map((status) => (
        <li key={status} className="list-group-item">
          {status}: {filterFunction(status)} Leads
        </li>
      ))}
    </ul>
  );
}

/* ================= QUICK FILTERS ================= */

function QuickFilters({ quickFilter, setQuickFilter }) {
  const statuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  return (
    <div className="d-flex gap-2 flex-wrap">
      {statuses.map((status) => (
        <button
          key={status}
          className="btn btn-warning"
          onClick={() => setQuickFilter({ ...quickFilter, status })}
        >
          {status}
        </button>
      ))}

      <button
        className="btn btn-secondary"
        onClick={() => setQuickFilter({ ...quickFilter, status: "" })}
      >
        All
      </button>
    </div>
  );
}

/* ================= HOME ================= */

export default function Home() {
  const { leadData } = useLeadContext();

  const [quickFilter, setQuickFilter] = useState({
    status: "",
    salesAgent: "",
  });

  if (!leadData) return <div>Loading...</div>;

  const processedLead = leadData.filter((lead) => {
    const matchStatus =
      !quickFilter.status || lead.status === quickFilter.status;
    const matchAgent =
      !quickFilter.salesAgent ||
      lead.salesAgent?.name === quickFilter.salesAgent;
    return matchStatus && matchAgent;
  });

  const filterFunction = (status) =>
    processedLead.filter((lead) => lead.status === status).length;

  return (
    <div className="container-fluid">

      <Navbar />

      <div className="row mt-3">
        {/* Sidebar */}
        <aside className="col-md-3">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="col-md-9">
          <h2>Lead Management</h2>

          <LeadList leads={processedLead} />

          <h3 className="mt-4">Lead Status</h3>
          <LeadStatusSummary filterFunction={filterFunction} />

          <h3 className="mt-4">Quick Filters</h3>
          <QuickFilters
            quickFilter={quickFilter}
            setQuickFilter={setQuickFilter}
          />

          <Link to="/newLead" className="btn btn-info mt-3">
            Add New Lead
          </Link>
        </main>
      </div>
    </div>
  );
}
