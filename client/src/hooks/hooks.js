import { useState, useEffect } from "react";
import axios from "axios";
//useCount for + -
function useCount(iniValue = 0) {
  const [count, setCount] = useState(iniValue);
  const increment = (e) => {
    e.stopPropagation();
    setCount((prevCount) => prevCount + 1);
  };
  const decrement = (e) => {
    e.stopPropagation();
    setCount((prevCount) => prevCount - 1);
  };
  return [count, increment, decrement];
}

function useGet(link) {
  const [data, setData] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(link);
        console.log("API response: ", res.data); 
        setData(res.data);
      } catch (e) {
        setError(e);
        console.log(e);
      } finally {
        //if succ or not
        setLoading(false);
      }
    };
    fetchData();
  }, [link]);
  return { data, error, loading };
}

export { useCount, useGet };
