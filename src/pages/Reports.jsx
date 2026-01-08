import { useEffect, useRef } from "react";
import { useLeadContext } from "../contexts/leadContext";
import Chart from "chart.js/auto";
import { Link } from "react-router-dom";

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

/* ================= CHARTS SECTION ================= */

function ChartsSection({ statusCount, agentCount, leadData }) {
  const pieRef = useRef(null);
  const barRef = useRef(null);

  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    if (!leadData || leadData.length === 0) return;

    // destroy previous charts
    pieChartRef.current?.destroy();
    barChartRef.current?.destroy();

    pieChartRef.current = new Chart(pieRef.current, {
      type: "pie",
      data: {
        labels: Object.keys(statusCount),
        datasets: [
          {
            data: Object.values(statusCount),
            backgroundColor: Object.keys(statusCount).map(
              () => `hsl(${Math.random() * 360}, 70%, 60%)`
            ),
          },
        ],
      },
    });

    barChartRef.current = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: Object.keys(agentCount),
        datasets: [
          {
            data: Object.values(agentCount),
            backgroundColor: Object.keys(agentCount).map(
              () => `hsl(${Math.random() * 360}, 70%, 60%)`
            ),
          },
        ],
      },
    });

    return () => {
      pieChartRef.current?.destroy();
      barChartRef.current?.destroy();
    };
  }, [statusCount, agentCount, leadData]);

  return (
    <section>
      <h4>Total Leads closed and in Pipeline:</h4>
      <canvas ref={pieRef}></canvas>

      <h4>Leads Closed by Sales Agent:</h4>
      <canvas ref={barRef}></canvas>
    </section>
  );
}

/* ================= STATUS BREAKDOWN ================= */

function StatusBreakdown({ statusCount, totalLeads }) {
  return (
    <section>
      <h3>Lead Status Breakdown</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {Object.entries(statusCount).map(([status, count]) => {
          const percentage = ((count / totalLeads) * 100).toFixed(1);

          return (
            <li key={status} style={{ marginBottom: "10px" }}>
              <strong>{status}:</strong> {count} leads{" "}
              <span style={{ color: "#666", marginLeft: "10px" }}>
                ({percentage}%)
              </span>

              {/* Progress bar */}
              <div
                style={{
                  background: "#eee",
                  borderRadius: "4px",
                  height: "8px",
                  width: "200px",
                }}
              >
                <div
                  style={{
                    background: "#1267ad",
                    height: "100%",
                    borderRadius: "4px",
                    width: `${percentage}%`,
                  }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ================= MAIN ================= */

export default function Reports() {
  const { leadData } = useLeadContext();

  const statusCount = (leadData ?? []).reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const agentCount = (leadData ?? []).reduce((acc, curr) => {
    const agentName = curr.salesAgent?.name || "Unknown";
    acc[agentName] = (acc[agentName] || 0) + 1;
    return acc;
  }, {});

  if (!leadData || leadData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Anvaya CRM Reports</h1>

      <Sidebar />

      <section>
        <h2>Report Overview</h2>

        <ChartsSection
          statusCount={statusCount}
          agentCount={agentCount}
          leadData={leadData}
        />

        <StatusBreakdown
          statusCount={statusCount}
          totalLeads={leadData.length}
        />
      </section>
    </div>
  );
}
