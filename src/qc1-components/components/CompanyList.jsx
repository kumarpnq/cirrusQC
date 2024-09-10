import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import { url } from "../../constants/baseUrl";
import axios from "axios";

const CompanyList = ({
  selectedClient,
  selectedCompanies,
  setSelectedCompanies,
}) => {
  // Fetch logic
  const [companies, setCompanies] = useState([]);
  const [cache, setCache] = useState([]);

  const fetchCompaniesWithClient = async (key) => {
    try {
      const userToken = localStorage.getItem("user");
      const endpoint = `${url}companylist/${key}`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setCompanies(response.data.companies);
    } catch (error) {
      setCompanies([]);
      console.error("Error fetching companies:", error.message);
    }
  };

  const fetchCompanies = async () => {
    try {
      const userToken = localStorage.getItem("user");
      const endpoint = `${url}companylist/`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setCompanies(response.data.companies);
      setCache(response.data.companies);
    } catch (error) {
      setCompanies([]);
      console.error("Error fetching companies:", error.message);
    }
  };

  useEffect(() => {
    if (selectedClient) {
      fetchCompaniesWithClient(selectedClient);
    } else {
      if (cache && cache?.length) {
        setCompanies([...cache]);
      } else {
        fetchCompanies();
      }
    }
  }, [selectedClient, cache]);

  return (
    <div>
      <CustomMultiSelect
        dropdownToggleWidth={200}
        dropdownWidth={250}
        keyId="companyid"
        keyName="companyname"
        options={companies || []}
        selectedItems={selectedCompanies}
        setSelectedItems={setSelectedCompanies}
        title="companies"
      />
    </div>
  );
};

CompanyList.propTypes = {
  selectedClient: PropTypes.string,
  selectedCompanies: PropTypes.arrayOf(
    PropTypes.shape({
      companyid: PropTypes.string.isRequired,
      companyname: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedCompanies: PropTypes.func.isRequired,
};

export default CompanyList;
