import { useEffect, useState } from "react";
import { useFetch } from "../useFetch";
import { Link, useParams } from "react-router-dom";

/* ================= SALES AGENT SELECT ================= */

function SalesAgentSelect({ agents, value, onChange }) {
  if (agents.length === 0) {
    return (
      <Link to="/">
        <button>Add a new Sales Agent</button>
      </Link>
    );
  }

  return (
    <select value={value} onChange={onChange} required>
      <option value="">Select Agent</option>
      {agents.map((a) => (
        <option key={a._id} value={a._id}>
          {a.name}
        </option>
      ))}
    </select>
  );
}

/* ================= TAGS SELECT ================= */

function TagsSelect({ tags, value, onChange }) {
  if (tags.length === 0) return null;

  return (
    <select value={value} onChange={onChange} required>
      <option value="">Select Tags</option>
      {tags.map((t) => (
        <option key={t._id} value={t._id}>
          {t.name}
        </option>
      ))}
    </select>
  );
}

/* ================= FORM FIELDS ================= */

function LeadFormFields({
  formData,
  setFormData,
  agents,
  tags,
}) {
  return (
    <>
      <label>Lead Name:</label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
        required
      />

      <label>Lead Source:</label>
      <select
        value={formData.source}
        onChange={(e) =>
          setFormData({ ...formData, source: e.target.value })
        }
        required
      >
        <option value="">Select Source</option>
        <option value="Website">Website</option>
        <option value="Referral">Referral</option>
        <option value="Cold Call">Cold Call</option>
        <option value="Advertisement">Advertisement</option>
        <option value="Email">Email</option>
        <option value="Other">Other</option>
      </select>

      <label>Sales Agent:</label>
      <SalesAgentSelect
        agents={agents}
        value={formData.salesAgent}
        onChange={(e) =>
          setFormData({ ...formData, salesAgent: e.target.value })
        }
      />

      <label>Lead Status:</label>
      <select
        value={formData.status}
        onChange={(e) =>
          setFormData({ ...formData, status: e.target.value })
        }
        required
      >
        <option value="">Select Status</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Proposal Sent">Proposal Sent</option>
        <option value="Closed">Closed</option>
      </select>

      <label>Priority:</label>
      <select
        value={formData.priority}
        onChange={(e) =>
          setFormData({ ...formData, priority: e.target.value })
        }
        required
      >
        <option value="">Select Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <label>Time to Close:</label>
      <input
        type="number"
        value={formData.timeToClose}
        onChange={(e) =>
          setFormData({
            ...formData,
            timeToClose: e.target.value,
          })
        }
        required
      />

      <label>Tags:</label>
      <TagsSelect
        tags={tags}
        value={formData.tags}
        onChange={(e) =>
          setFormData({ ...formData, tags: e.target.value })
        }
      />
    </>
  );
}

/* ================= FORM STATUS ================= */

function FormStatus({ success, error, isEditMode }) {
  if (success) {
    return (
      <p style={{ color: "green" }}>
        {isEditMode
          ? "Lead updated successfully!"
          : "Lead created successfully!"}
      </p>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red" }}>
        Error saving lead. Please try again.
      </div>
    );
  }

  return null;
}

/* ================= MAIN ================= */

export default function NewLead() {
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "",
    priority: "",
    timeToClose: 0,
    tags: "",
  });

  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);

  const { leadId } = useParams();
  const isEditMode = !!leadId;

  const { data: salesAgentFetch } = useFetch(
    "http://localhost:3000/api/agents",
    { allAgents: [] }
  );
  const agents = salesAgentFetch?.allAgents || [];

  const { data: tagsFetch } = useFetch(
    "http://localhost:3000/api/tags",
    { allTags: [] }
  );
  const tags = tagsFetch?.allTags || [];

  const leadUrl = isEditMode
    ? `http://localhost:3000/api/lead/${leadId}`
    : null;

  const { data: leadFetch } = useFetch(leadUrl, {});
  const leadToEdit = leadFetch?.lead;

  useEffect(() => {
    if (!isEditMode || !leadToEdit) return;

    setFormData({
      name: leadToEdit.name,
      source: leadToEdit.source,
      salesAgent: leadToEdit.salesAgent?._id ?? "",
      status: leadToEdit.status,
      priority: leadToEdit.priority,
      timeToClose: leadToEdit.timeToClose,
      tags: Array.isArray(leadToEdit.tags)
        ? leadToEdit.tags[0]?._id ?? ""
        : leadToEdit.tags?._id ?? "",
    });
  }, [leadToEdit, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setFetching(true);

    try {
      const url = isEditMode
        ? `http://localhost:3000/api/lead/${leadId}`
        : `http://localhost:3000/api/lead`;

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Request failed");

      await response.json();

      if (!isEditMode) {
        setFormData({
          name: "",
          source: "",
          salesAgent: "",
          status: "",
          priority: "",
          timeToClose: 0,
          tags: "",
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError(true);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div>
      <h1>{isEditMode ? "Edit Lead" : "Add New Lead"}</h1>

      <form onSubmit={handleSubmit}>
        <LeadFormFields
          formData={formData}
          setFormData={setFormData}
          agents={agents}
          tags={tags}
        />

        <button disabled={fetching}>
          {fetching
            ? "Saving..."
            : isEditMode
            ? "Update Lead"
            : "Create Lead"}
        </button>
      </form>

      <FormStatus
        success={success}
        error={error}
        isEditMode={isEditMode}
      />
    </div>
  );
}
