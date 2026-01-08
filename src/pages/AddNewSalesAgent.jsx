import { useEffect, useState } from "react";

/* ================= FORM STATUS ================= */

function FormStatus({ error, success }) {
  if (error) return <div>An error occurred.</div>;
  if (success) return <div>Agent created successfully.</div>;
  return null;
}

/* ================= AGENT FORM ================= */

function AgentForm({ formData, setFormData, onSubmit, fetching }) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Agent Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
      </div>

      <div>
        <label>Email Address:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />
      </div>

      <button disabled={fetching}>
        {fetching ? "Creating Agent..." : "Create Agent"}
      </button>
    </form>
  );
}

/* ================= MAIN ================= */

export default function NewSalesAgent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [error, setError] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);

  const urlAgent = "http://localhost:3000/api/agents";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFetching(true);
      setError(false);

      const response = await fetch(urlAgent, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setError(true);
        setFetching(false);
        return;
      }

      await response.json();

      setFormData({ name: "", email: "" });
      setSuccess(true);
      setFetching(false);
    } catch (err) {
      setError(true);
      setFetching(false);
    }
  };

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => setSuccess(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  return (
    <div>
      <h1>Add New Sales Agent</h1>

      <AgentForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        fetching={fetching}
      />

      <FormStatus error={error} success={success} />
    </div>
  );
}
