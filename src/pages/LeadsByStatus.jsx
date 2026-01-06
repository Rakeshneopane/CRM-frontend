import { useLeadContext } from "../contexts/leadContext";
import { Link } from "react-router-dom";

export default function LeadByStatus(){

    const { quickFilter,
            setQuickFilter,
            setSortType, 
            processedLead,
            uniqueSalesAgentName,
        } = useLeadContext();

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
                <h2>Lead List by Status</h2>
                <h2>Status: New</h2>
                <ul>
                    { processedLead ? processedLead.length > 0 ? processedLead.map((l,index)=>(
                        <li key = {index}> {l.name} - Sales Agent: {l.salesAgent.name}</li>
                    )) : "Loading..." : "leadData before mounting" }
                </ul>
                <ul>
                    <li>Filters 
                        <br />
                        Status: {" "}
                        {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'].map((status, index)=>(
                            <button key={index} value={status} onClick={(e)=>setQuickFilter({...quickFilter,status})}>  {status} </button>
                        ))}
                            <button value= {""} onClick={(e)=>setQuickFilter({...quickFilter, status: e.target.value})}>  All </button>
                        <br />
                        Sales Agent: {' '}
                        <button value= {""} onClick={(e)=>setQuickFilter({...quickFilter, salesAgent: e.target.value})}>  All Agents  </button>                        
                        {
                            uniqueSalesAgentName.length > 0 && uniqueSalesAgentName.map((agent)=>(
                                <button 
                                    key={agent} 
                                    onClick={(e)=>setQuickFilter({...quickFilter,salesAgent: e.target.value})}
                                    value={agent}
                                    >
                                    {agent} </button>
                            ))   
                        }
                    </li>
                    <li>Sort By : 
                        <button  onClick={()=>setSortType("priority")}> Priority </button> 
                        <button  onClick={()=>setSortType("timeToClose")}> Time to close </button>
                        <button  onClick={()=>setSortType("")}> Clear Sort </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}