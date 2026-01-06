import {useEffect, useState} from "react";

export default function NewSalesAgent(){
    
    const [formData, setFormData] = useState({
            name: "",
            email: "",
        });
    const [error, setError] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [success, setSuccess] = useState(false);

    const urlAgent = `http://localhost:3000/api/agents`;
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const payload = formData;
        try {
            setFetching(true);
            const response = await fetch(urlAgent,{
                method: "POST",
                headers: {"COntent-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if(!response.ok) {
                setError(true);
                setFetching(false);
                return;
            }
            const json = await response.json();
            setFormData({
                name: "",
                email: "",
            })
            setFetching(false);
            setSuccess(true);            
        } catch (error) {
            setError(true);
            setFetching(false);
        }
    }
    
    useEffect(()=>{
        let timer;

        if(success){
            timer = setTimeout(()=> {setSuccess(false);},3000);
        }   

        return ()=>clearTimeout(timer);
    }, [success]);
    
    return (
        <div>
            <h1>Add New Sales Agent</h1>
            <div>
                <div>
                    <form action="" onSubmit={(e)=>handleSubmit(e)}>
                        <label htmlFor=""> Agent Name: </label>
                        <input type="text" name="" id="" value={formData.name ?? ""} onChange={(e)=>setFormData({...formData, name: e.target.value})}/>
                         <br />
                        <label htmlFor=""> Email Address: </label>
                        <input type="mail" name="" id="" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
                        <br />
                        <button disabled={fetching}> {fetching ? `Creating Agent...` : `Create Agent Button`} </button>
                    </form>
                    {error && <div> An error occured </div> }
                    {success && <div>Agent created sucessfully.</div> }
                </div>

            </div>
        </div>
    )
}