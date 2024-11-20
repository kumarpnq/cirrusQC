import { useEffect, useState } from "react";
import axiosInstance from "../../axiosConfig";

const useFetchMongoData = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(endpoint);
        setData(res.data);
      } catch (error) {
        setError(error.message || "An error occurred");
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
};

export default useFetchMongoData;
