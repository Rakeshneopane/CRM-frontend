import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLeadContext } from "../contexts/leadContext";

export default function Home(){
    
    //consume context
    const { leadData, quickFilter, setQuickFilter, processedLead } = useLeadContext();

    //lead status function
    const filterFunction = (status) =>{
        const lengthOfStatus = (processedLead.filter(lead=>lead.status === status).length);
        return lengthOfStatus;
    }
    
    //quick filter
    // const [quickfilter, setQuickFilter] = useState({
    //     // 'New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'
    //     status: "",
    // });

    // // filter function
    // const filteredLead = leadData.filter((lead)=>{
    //     if(quickfilter.status === "") return true;
    //     return lead.status === quickfilter.status;
    // });

    return ( processedLead ? (
            <div>
                <h1>Anvaya CRM Dashboard</h1>
                <div>
                    <h2>Sidebar</h2>
                    <ul>
                        <li> <Link to={"/leadsByStatus"}>Leads "by status"</Link> </li>
                        <li> <Link to={"/leadList"}>Sales "Lead list"</Link> </li>
                        <li> <Link to={"/SalesAgentView"}>Agents "Sales Agent view"</Link> </li>
                        <li> <Link to={"/reports"}>Reports</Link> </li>
                        <li> <Link to={"/SalesManagement"}>Settings "Sales Agent Management"</Link> </li>
                    </ul>
                </div>
                <div>
                    <h2>Main Content : [Lead Management/:id]</h2>
                    <ul>
                        {processedLead.map((lead,index)=>(
                            <li key={index} style={{textDecoration: "none"}}> <Link to={`/leadManagement/${lead._id}`}>{index+1} {lead.name}  </Link></li>
                        ))}
                    </ul>
                    <h3>Lead Status:</h3>
                    <ul>
                        <li>New: {filterFunction("New")} Leads</li>
                        <li>Contacted: {filterFunction("Contacted")}  Leads</li>
                        <li>Qualified: {filterFunction("Qualified")} Leads</li>
                        <li>Proposal Sent: {filterFunction("Proposal Sent")} Leads</li>
                        <li>Closed: {filterFunction("Closed")} Leads</li>
                    </ul>
                    <h3>Quick Filters:</h3>
                    <ul>
                        {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'].map((status, index)=>(
                            <button key={index} value={status} onClick={(e)=>setQuickFilter({...quickFilter,status})}>  {status} </button>
                        ))}
                        <button value={""} onClick={(e)=>setQuickFilter({...quickFilter, status: ""})}> All </button>
                    </ul>
                    <p> <Link to={"/newLead"}> Add New Lead Button </Link> </p>
                </div>
            </div>
        ) : ( <div>Loading...</div> ) )
}