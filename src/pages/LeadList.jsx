import { useLeadContext } from "../contexts/leadContext"; 
import {useEffect, useState} from "react";
import { Link } from "react-router-dom"

export default function LeadList(){

    const { leadData, quickFilter, setQuickFilter, processedLead, setSortType } = useLeadContext();

    useEffect(()=>{
        if(leadData.length === 0) return;
        window.localStorage.setItem("localLeadData", JSON.stringify(leadData));
    },[leadData]);

    let persistantLead = JSON.parse(window.localStorage.getItem("localLeadData"))|| [{name: "No agent was fetched"}];

    let uniqueSalesAgentName = [...new Set(persistantLead.map(lead=> lead.salesAgent?.name).filter(Boolean))];
    console.log("unique sales Agent: ", uniqueSalesAgentName);    

    return (
        <div>
            <h1>Lead List</h1>
            <div>
                <h2>Sidebar</h2>
                <ul>
                    <Link to={"/"}> <li>  Back to Dashboard </li> </Link> 
                </ul>
            </div>
            <div>
                <h2>Lead Overview</h2>
                <ul>
                    {
                    processedLead.length > 0 && processedLead.map((lead,index)=>(
                        <li key={lead._id}> Lead {index + 1}: 
                            <ul>
                                <li>Status- {lead.status} </li> 
                                <li>Sales agent- {lead.salesAgent.name} </li> 
                                <li>Priority- {lead.priority} </li>
                                <li>Time to close- {lead.timeToClose}</li>
                            </ul>
                        </li>
                    ))
                    }
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
                <button> <Link to={"/newLead"}> Add New Lead Button </Link> </button>
            </div>
        </div>
    )
}