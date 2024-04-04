import { useState, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import { debounce } from "lodash";
import { ResearchContext } from "../../context/ContextProvider";
import { url } from "../../constants/baseUrl";
import PropTypes from "prop-types";

const DebounceSearch = ({ selectedCompany, setSelectedCompany }) => {
  const [companies, setCompanies] = useState([]);
  const { userToken } = useContext(ResearchContext);

  const headers = { Authorization: `Bearer ${userToken}` };

  const fetchData = async (query) => {
    const requestParam = { search_term: query };

    try {
      const response = await axios.get(`${url}companylist/`, {
        headers,
        params: requestParam,
      });
      setCompanies(
        response.data.companies.map((company) => ({
          value: company.companyid,
          label: company.companyname,
        }))
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const debouncedFetchData = debounce(fetchData, 500);

  const handleSearchTermChange = (newValue) => {
    if (newValue.length >= 3) {
      debouncedFetchData(newValue);
    }
  };

  const handleSelectCompany = (selectedOption) => {
    setSelectedCompany(selectedOption);
  };

  return (
    <div style={{ width: "300px", zIndex: 999 }} className="mt-2">
      <Select
        options={companies}
        value={selectedCompany}
        onChange={handleSelectCompany}
        onInputChange={handleSearchTermChange}
        placeholder="Search companies..."
        isSearchable
        styles={{
          input: (provided) => ({
            ...provided,
            fontSize: "15px",
          }),
          menuPortal: (base) => ({
            ...base,
            fontSize: "0.8em",
            height: "20px",
          }),
        }}
      />
    </div>
  );
};
DebounceSearch.propTypes = {
  selectedCompany: PropTypes.objectOf(PropTypes.any).isRequired,
  setSelectedCompany: PropTypes.func.isRequired,
};
export default DebounceSearch;
