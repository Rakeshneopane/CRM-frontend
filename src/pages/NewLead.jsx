import { useEffect, useState } from "react";
import { useFetch } from "../useFetch";
import { Link, useParams } from "react-router-dom";

export default function NewLead(){

    const [formData, setFormData] = useState({
        name: "",
        source: "",
        salesAgent: "",
        status: "",
        priority: "",
        timeToClose: 0,
        tags: "",
    });

    const urlAgent = `http://localhost:3000/api/agents`
    const { data: salesAgentFetch } = useFetch(urlAgent, {allAgents : []});
    const normalisedAgent = salesAgentFetch?.allAgents || [];

    const urlTags = "http://localhost:3000/api/tags";
    const {data: tagsFetch } = useFetch(urlTags, {allTags: []});
    const normalisedTags = tagsFetch?.allTags || [];

    useEffect(()=>{
        if(normalisedAgent.length === 0) return;
        window.localStorage.setItem("salesAgentLocal", JSON.stringify(normalisedAgent));
        if(normalisedAgent.length === 0) return;
        window.localStorage.setItem("tagsLocal", JSON.stringify(normalisedTags));
    },[normalisedAgent, normalisedTags]);

    const { leadId } = useParams();
    const isEditMode = !!leadId;

    const leadUrl = isEditMode ? `http://localhost:3000/api/lead/${leadId}`: null;
    const { data: leadFetch } = useFetch( leadUrl, {} );
    const leadToEdit = leadFetch.lead;

    useEffect(()=>{
        if(!isEditMode || !leadToEdit) return;
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
        })
    },[leadToEdit, isEditMode]);

    const [error, setError] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setError(false);
        try {
            setFetching(true);
            const url = isEditMode
                            ? `http://localhost:3000/api/lead/${leadId}`
                            : `http://localhost:3000/api/lead`;
            const method = isEditMode ? "PUT": "POST";

            const response = await fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData),
            })
            if(!response.ok) throw new Error("Post Failed");

            const json = await response.json();
            setFetching(false);
            if (!isEditMode) {
                setFormData({
                    name: "",
                    source: "",
                    salesAgent: "",
                    status: "",
                    priority: "",
                    timeToClose: 0,
                    tags: ""
                });
            }
            setSuccess(true);   
            setTimeout(()=>{
                setSuccess(false)
            },3000);         
        
        } catch (error) {
            setError(true);
        
        } finally {
            setFetching(false);
        }
    }

        return (
        <div>
            <h1>{isEditMode ? "Edit Lead" : "Add New Lead"}</h1>
            <div>
                <form action="" onSubmit={(e)=>handleSubmit(e)}>
                    {/* Lead Name */}
                    <label htmlFor="">Lead Name: </label>
                    <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e)=>setFormData({...formData, name: e.target.value})} 
                        required
                    />
                    <br />
                    {/* Source */}
                    <label htmlFor="">Lead Source: </label>
                    <select 
                        value={formData.source} 
                        onChange={(e)=>setFormData({...formData, source: e.target.value})} 
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
                    <br />
                    {/* Sales Agent */}
                    <label> Sales Agent: </label>
                    { normalisedAgent.length > 0 ? (                       
                        <select 
                            value={formData.salesAgent} 
                            onChange={(e)=>setFormData({...formData, salesAgent: e.target.value})}
                            required
                            >
                            <option value="">Select Agent</option>
                            {normalisedAgent.map((a,index)=>(
                                <option value={a._id} key={a._id}>
                                    {a.name}
                                </option>))}
                        </select>
                     ): (
                            <Link to="/">
                                <button> Add a new Sales Agent </button>
                            </Link>
                    )}                    
                    <br />
                    {/* Status */}
                    <label>Lead Status: </label>
                    <select 
                        value={formData.status} 
                        onChange={(e)=>setFormData({...formData, status: e.target.value})}
                        required
                        >
                        <option value="">Select Status</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <br />
                    {/* Priority */}
                    <label>Priority: </label>
                    <select  
                        value={formData.priority} 
                        onChange={(e)=>setFormData({...formData, priority: e.target.value})}
                        required
                        >
                        <option value="">Select priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                    <br />
                    {/* Time to close */}
                    <label>Time to Close: </label>
                    <input 
                        type="number" 
                        value={formData.timeToClose} 
                        onChange={(e)=>setFormData({...formData, timeToClose: e.target.value})} 
                        required
                    />
                    <br />
                    {/* Tags */}
                    <label>Tags: </label>
                    {normalisedTags.length>0 && (
                        <select
                            value={formData.tags} 
                            onChange={(e)=>setFormData({...formData, tags: e.target.value})}
                            required
                        >
                            <option value="">Select Tags</option>
                            {
                                normalisedTags.map((t)=>(
                                    <option value={t._id} key={t._id}> {t.name} </option>
                                ))  
                            }
                        </select>
                    ) }
                    <br />
                    
                    <button disabled={fetching} > 
                        {fetching
                            ? "Saving..."
                            : isEditMode
                                ? "Update Lead"
                                : "Create Lead"}
                        </button>
                </form>

                {success && (
                    <p style={{ color: "green" }}>
                        {isEditMode ? "Lead updated successfully!" : "Lead created successfully!"}
                    </p>
                )}
                {error && <div style={{color: "red"}}> Error saving lead. Please try again. </div> }
            </div>
        </div>
    )
}