import { useLeadContext } from "../contexts/leadContext";
import { useParams, Link } from "react-router-dom";
import { useFetch } from "../useFetch";
import { useEffect, useState } from "react";

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

/* ================= LEAD DETAILS ================= */

function LeadDetails({ lead }) {
  return (
    <section>
      <h2>Lead Details</h2>
      <ul>
        <li>Lead Name: {lead.name}</li>
        <li>Sales Agent: {lead.salesAgent?.name}</li>
        <li>Lead Source: {lead.source}</li>
        <li>Lead Status: {lead.status}</li>
        <li>Priority: {lead.priority}</li>
        <li>Time to Close: {lead.timeToClose}</li>
      </ul>

      <Link to={`/editLead/${lead._id}`}>
        <button>Edit Lead Details</button>
      </Link>
    </section>
  );
}

/* ================= COMMENTS LIST ================= */

function CommentsList({ comments }) {
  if (!comments || comments.length === 0) {
    return <li>No comments added yet</li>;
  }

  return (
    <>
      {comments.map((c) => (
        <li key={c._id}>
          {c.author?.name}: {c.commentText}
        </li>
      ))}
    </>
  );
}

/* ================= ADD COMMENT FORM ================= */

function AddCommentForm({
  commentInput,
  setCommentInput,
  onSubmit,
  fetching,
  success,
  error,
}) {
  return (
    <div>
      <h4>Add New Comment</h4>

      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button disabled={fetching}>
          {fetching ? "Saving comment..." : "Submit comment"}
        </button>
      </form>

      {success && <div>{success}</div>}
      {error && <div>An error occurred.</div>}
    </div>
  );
}

/* ================= MAIN ================= */

export default function LeadManagement() {
  const { leadData } = useLeadContext();
  const { leadId } = useParams();

  const leadUrl = `http://localhost:3000/api/lead/${leadId}`;
  const { data: leadFetch } = useFetch(leadUrl, {});
  const fetchedLead = leadFetch?.lead;

  const commentUrl = `http://localhost:3000/api/lead/${leadId}/comments`;
  const { data: commentFetch } = useFetch(commentUrl, {});

  const leadFromContext = leadData.find((l) => l._id === leadId);
  const lead = leadFromContext || fetchedLead;

  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [success, setSuccess] = useState("");
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);

  /* Load comments */
  useEffect(() => {
    if (!commentFetch?.comment) return;
    setComments(commentFetch.comment);
    window.localStorage.setItem(
      "Comment",
      JSON.stringify(commentFetch.comment)
    );
  }, [commentFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lead) return;

    setFetching(true);
    setError(false);

    try {
      const payload = {
        lead: lead._id,
        author: lead.salesAgent?._id ?? lead.salesAgent,
        commentText: commentInput,
      };

      const url = `http://localhost:3000/api/lead/${lead._id}/comments`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to comment");

      const result = await response.json();

      setComments((prev) => [...prev, result.comment]);
      setCommentInput("");
      setSuccess("Commented successfully");
    } catch (err) {
      setError(true);
      setSuccess("");
    } finally {
      setFetching(false);
    }
  };

  if (!lead) return <div>Loading...</div>;

  return (
    <div>
      <h1>Lead Management: {lead.name}</h1>

      <Sidebar />

      <LeadDetails lead={lead} />

      <section>
        <h3>Comments Section</h3>
        <ul>
          <li>
            {lead.salesAgent?.name} :{" "}
            {new Date(lead.createdAt).toLocaleString()}
          </li>

          <CommentsList comments={comments} />
        </ul>

        <AddCommentForm
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          onSubmit={handleSubmit}
          fetching={fetching}
          success={success}
          error={error}
        />
      </section>
    </div>
  );
}
