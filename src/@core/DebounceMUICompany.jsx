import { useState, useCallback } from "react";
import { TextField, Autocomplete, Chip, CircularProgress } from "@mui/material";
import axios from "axios";
import debounce from "lodash/debounce";
import { url } from "../constants/baseUrl";

const SearchDropdown = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  // Debounced API call function
  const fetchCompanies = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery) {
        setOptions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const userToken = localStorage.getItem("user");
        const response = await axios.get(`${url}companylist/`, {
          headers: { Authorization: `Bearer ${userToken}` },
          params: { search_term: searchQuery },
        });

        // Assuming response.data.companies is an array of companies
        setOptions(response.data.companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Handle input change
  const handleInputChange = (event, value) => {
    setSearchTerm(value);
    fetchCompanies(value);
  };

  // Handle selection change
  const handleSelectionChange = (event, newValue) => {
    setSelectedCompanies(newValue);
  };

  return (
    <div className="mt-2">
      <Autocomplete
        multiple
        size="small"
        id="company-dropdown"
        options={options}
        getOptionLabel={(option) => option.companyname || ""} // Handle empty labels
        onInputChange={handleInputChange}
        onChange={handleSelectionChange}
        value={selectedCompanies}
        loading={loading}
        disableCloseOnSelect // Prevent closing dropdown on select
        filterSelectedOptions={false} // Keep selected options in the list
        isOptionEqualToValue={(option, value) =>
          option.companyid === value.companyid
        }
        noOptionsText="No companies found"
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Companies"
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              key={option.companyid}
              label={option.companyname}
              size="small"
              {...getTagProps({ index })}
            />
          ))
        }
      />
    </div>
  );
};

export default SearchDropdown;
