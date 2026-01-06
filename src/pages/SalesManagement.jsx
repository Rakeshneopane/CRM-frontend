import { useLeadContext } from "../contexts/leadContext";
import { Link } from "react-router-dom";
import { useFetch } from "../useFetch";

export default function SalesManagement(){

    const { leadData } = useLeadContext();

    const url = `http://localhost:3000/api/agents`;
    const {data: salesAgents} = useFetch(url, []);
        return (
        <div>
            <h1>Sales Agent Management</h1>
            <div>
                <h2>Sidebar</h2>
                <ul>
                    <li> <Link to={"/"}>Back to Dashboard</Link> </li>
                </ul>
            </div>
            <div>
                <div>
                    <h2>Sales Agent List</h2>
                    <ul>
                        { salesAgents.allAgents && salesAgents.allAgents.length > 0 && 
                        salesAgents.allAgents
                        .map((a, index)=>
                            ( 
                            <li key={index}>  
                                Agent:  {a.name},
                                Email: {a.email} </li> 
                            )
                        )}
                    </ul>
                    <button> <Link to={"/addNewSalesAgent"}> Add New Agent Button </Link> </button>
                </div>

            </div>
        </div>
    )
}