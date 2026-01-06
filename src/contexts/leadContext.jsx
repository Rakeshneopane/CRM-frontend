import { useState, useEffect, useContext, createContext } from "react";
import { useFetch } from "../useFetch";

const LeadContext = createContext();
export const useLeadContext = ()=> useContext(LeadContext);

export default function LeadProvider({children}) {

    const [leadData, setLeadData] = useState([]);
    const url = "http://localhost:3000/api/leads";
    const { data: leadRes } = useFetch(url, { "leads": [] });

    // save leads
    useEffect(()=>{
        if(!leadRes?.leads) return; 
        const normalisedData = leadRes.leads;
        setLeadData(normalisedData);
        window.localStorage.setItem("leadData", JSON.stringify(normalisedData));     
    }, [leadRes]);

    // quick filter for status and sales agent

    const [quickFilter, setQuickFilter] = useState({
        status: "",
        salesAgent: "",
    });

    //sort type
     const priorityObject = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    };
    const [sortType, setSortType] = useState(""); 

    const processedLead = leadData.filter((lead)=>{
        const matchStatus = !quickFilter.status || lead.status === quickFilter.status;
        const matchSalesAgent = !quickFilter.salesAgent || lead.salesAgent?.name === quickFilter.salesAgent;
        return matchSalesAgent && matchStatus;  
    }).sort((a, b)=>{
        switch(sortType){
            case "priority":
                return priorityObject[a.priority] - priorityObject[b.priority];
            case "timeToClose":
                return a.timeToClose - b.timeToClose;
            default :
                return 0;
        }
    });    

    useEffect(()=>{
        if(leadData.length === 0) return;
        window.localStorage.setItem("localLeadData", JSON.stringify(leadData));
    },[leadData]);

    let persistantLead = JSON.parse(window.localStorage.getItem("localLeadData"))|| [{name: "No agent was fetched"}];

    let uniqueSalesAgentName = [...new Set(persistantLead.map(lead=> lead.salesAgent?.name).filter(Boolean))];
    console.log("unique sales Agent: ", uniqueSalesAgentName); 

    return (
        <LeadContext.Provider value={{ 
                // normalised data from backend 
                leadData,
                //filter & its setter function
                quickFilter,
                setQuickFilter,
                //sort & its setter function
                sortType,
                setSortType,
                // processed data 
                processedLead, 
                uniqueSalesAgentName,
                }}>
            {children}
        </LeadContext.Provider>
    )
}

