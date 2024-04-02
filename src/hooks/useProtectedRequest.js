import { useState } from "react";
import axios from "axios";
import { url } from "../constants/baseUrl";

const useProtectedRequest = (userToken) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const makeRequest = async (requestData) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${userToken}` };
      const response = await axios.post(
        `${url}updatearticletagdetails/`,
        requestData,
        {
          headers,
        }
      );
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, makeRequest };
};

export default useProtectedRequest;
