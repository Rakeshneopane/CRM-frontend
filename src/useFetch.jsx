import { useEffect,useState } from "react";

export const useFetch = (url, initialData) =>{

   
    const [data, setData] = useState(initialData);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if (!url) return;

        let active = true;
        setLoading(true);

        const fetchData = async() => {
            try {
                const response = await fetch(url);
                const json = await response.json();
                if(active)
                    setData(json);

            } catch (error) {    
                if(active)    
                    setError(error.message);
            } finally{
                if(active)
                    setLoading(false);
            }
        };

        fetchData();

        return ()=>{
            active = false;
        };
    
    }, [url]);

    return {data, loading, error}
}