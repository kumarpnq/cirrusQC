import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../constants/baseUrl";

const useFetchCompanies = (selectedClient) => {
  const [companyData, setCompanyData] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const userToken = localStorage.getItem("user");

        const endpoint = selectedClient
          ? `${url}companylist/${selectedClient}`
          : `${url}companylist/`;

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        setCompanyData(response.data.companies);
      } catch (error) {
        setCompanyData([]);
        console.error("Error fetching companies:", error.message);
      }
    };

    fetchCompanies();
  }, [selectedClient]);

  return companyData;
};

export default useFetchCompanies;
