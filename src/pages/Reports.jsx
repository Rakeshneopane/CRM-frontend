import { useEffect,useRef } from "react";
import { useLeadContext } from "../contexts/leadContext";
import Chart from "chart.js/auto";
import { Link } from "react-router-dom";

export default function Reports(){

    const { leadData } = useLeadContext();
   
    console.log(leadData);
    const pieRef = useRef(null);
    const barRef = useRef(null);

    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);

    const statusCount = (leadData ?? []).reduce((acc,curr)=>{
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
    },{});

    const agentCount = (leadData ?? []).reduce((acc,curr)=>{
            acc[curr.salesAgent.name] = (acc[curr.salesAgent.name] || 0) + 1;
            return acc;
    },{});

    useEffect(()=>{
        if(!leadData || leadData.length === 0 ) return;

        // ---- Destroy previous charts ----
        pieChartRef.current?.destroy();
        barChartRef.current?.destroy();


        pieChartRef.current = new Chart(pieRef.current,{
            type: "pie",
            data: {
                labels: Object.keys(statusCount),
                datasets: [
                    {
                        data: Object.values(statusCount),
                        backgroundColor: Object.keys(statusCount).map(
                        () => `hsl(${Math.random() * 360}, 70%, 60%)`
                        )
                    },
                ],
            },
        });

        barChartRef.current = new Chart(barRef.current,{
            type: "bar",
            data: {
                    labels: Object.keys(agentCount),
                    datasets: [
                    {
                        data: Object.values(agentCount),
                        backgroundColor: Object.keys(agentCount).map(
                        () => `hsl(${Math.random() * 360}, 70%, 60%)`
                        )
                    },
                ],
            },  
        });

        return ()=> { 
            pieChartRef.current?.destroy();
            barChartRef.current?.destroy();
        };
    },[leadData]);

    
        return (
        <div>
            <h1>Anvaya CRM Reports</h1>
            <div>
                <h2>Sidebar</h2>
                <ul>
                    <li> <Link to={"/"}> Back to Dashboard </Link> </li>
                </ul>
            </div>
            <div>
                <h2>Report Overview</h2>
                <h4>Total Leads closed and in Pipeline:  </h4> <div> <canvas ref={pieRef}></canvas> </div> 
                <h4>Leads Closed by Sales Agent:  </h4> <div> <canvas ref={barRef}></canvas> </div>
                <div>
                    <h3>Lead Status Breakdown</h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {Object.entries(statusCount).map(([status, count]) => (
                            <li key={status} style={{ marginBottom: "10px" }}>
                                <strong>{status}:</strong> {count} leads 
                                <span style={{ color: "#666", marginLeft: "10px" }}>
                                    ({((count / leadData.length) * 100).toFixed(1)}%)
                                </span>
                                {/* Visual progress bar */}
                                <div style={{
                                    background: "#eee",
                                    borderRadius: "4px",
                                    height: "8px",
                                    width: "200px"
                                }}>
                                    <div style={{
                                        background: "#1267ad",
                                        height: "100%",
                                        borderRadius: "4px",
                                        width: `${(count / leadData.length) * 100}%`
                                    }}></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}


