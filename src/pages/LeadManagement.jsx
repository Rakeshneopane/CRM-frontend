import { useLeadContext } from "../contexts/leadContext";
import { useParams,Link } from "react-router-dom";
import { useFetch } from "../useFetch";
import { useEffect, useState } from "react";

export default function LeadManagement(){

    const { leadData } = useLeadContext();
    const { leadId } = useParams();
    const leadUrl = `http://localhost:3000/api/lead/${leadId}`;
    const { data: leadFetch } = useFetch( leadUrl, {} );
    const normalisedLeadFetch = leadFetch.lead;

    const commentUrl = `http://localhost:3000/api/lead/${leadId}/comments`;
    const { data: commentFetch,} = useFetch(commentUrl, {});
   

    const leadInLeads = leadData.find(lead => lead._id === leadId);
    const lead = leadInLeads ? leadInLeads : normalisedLeadFetch;

    const [comment, setComment] = useState([]);
    const [commentInput, setCommentInput] = useState("");
    const [success, setSuccess] = useState("");
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(false);

    const normalisedComment = comment; 

    //persist Lead
    useEffect(()=>{    
        if(!leadFetch.lead) return; 
        window.localStorage.setItem("Lead", JSON.stringify(normalisedLeadFetch));
        
    },[leadFetch]);

    useEffect(()=>{
        if(!commentFetch?.comment) return;
        setComment(commentFetch.comment);
        window.localStorage.setItem("Comment", JSON.stringify(normalisedComment));
    },[commentFetch]);

    const handleSubmit =async(e)=>{
        e.preventDefault();
        try {
            const payLoad = {
            lead: lead._id,
            author: lead.salesAgent?._id ?? lead.salesAgent,
            commentText: commentInput,
        }
        setFetching(true);
        const url = `http://localhost:3000/api/lead/${lead._id}/comments`;
        const response = await fetch(url,{
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify(payLoad)
        })
        if(!response.ok) throw new Error("Failed to comment on lead.");
        const responseConfirmation = await response.json(); 
        if(responseConfirmation){
            setSuccess("Commented sucessfully");
            setComment(prev=>[...prev, responseConfirmation.comment]);
            setCommentInput("");
            setFetching(false);
            setError(false);
        }
        } catch (error) {
            setError(true);
        }
    }

    return (lead ? (
        <div>
            <h1>Lead Management: {lead.name}</h1>
            <div>
                <h2>Sidebar</h2>
                <ul>
                    <li> <Link to="/"> Back to Dashboard </Link> </li>
                </ul>
            </div>
            <div>
                <h2>lead Deatils</h2>
                <ul>
                    <li>Lead Name: {lead.name} </li>
                    <li>Sales Agent: {lead.salesAgent.name} </li>
                    <li>Lead Source: {lead.source} </li>
                    <li>Lead Status: {lead.status} </li>
                    <li>Priority: {lead.priority} </li>
                    <li>Time to Close: {lead.timeToClose} </li>
                </ul>
                <button> <Link to={`/editLead/${lead._id}`}> Edit Lead Details Button </Link> </button>
                <h3>Comments Section:</h3>
                <ul>
                    <li> {lead.salesAgent.name} : {new Date(lead.createdAt).toLocaleString()}</li>
                    <div>
                        <h4> Comment: </h4>  
                        {normalisedComment.length > 0 ? (
                            normalisedComment.map(c => (
                                <li key={c._id}>
                                {c.author?.name}: {c.commentText}
                                </li>                                
                            ))
                            ) : (
                            <li>No comments added yet</li>
                            )}
                    </div>
                    <li>Add New Comment :  
                        <form action="" onSubmit={(e)=>handleSubmit(e)}>
                            <input type="text" value={commentInput} onChange={(e)=>setCommentInput(e.target.value)} />
                            <button disabled={fetching}> { fetching ? "Saving comment..." : "Submit comment"} </button>
                        </form>
                        { success && <div> {success} </div> }
                        { error && <div> An error occured. </div>}
                    </li>
                </ul>
            </div>
        </div>
        )
        :
        (<div> Loading... </div>)
    );
}