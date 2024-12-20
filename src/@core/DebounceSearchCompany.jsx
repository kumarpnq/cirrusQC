import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import PropTypes from "prop-types";
import { url } from "../constants/baseUrl";
import { Tooltip } from "@mui/material";

const DebounceSearchCompany = ({
  setSelectedCompany,
  selectedCompany,
  isMultiple,
  width,
  height,
  clientId,
}) => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(
    isMultiple ? [] : null
  );

  useEffect(() => {
    if (
      !selectedCompany ||
      (Array.isArray(selectedCompany) && selectedCompany?.length === 0)
    ) {
      setSelectedOptions(isMultiple ? [] : null);
    }
  }, [selectedCompany, isMultiple]);

  const [showResults, setShowResults] = useState(false);
  const userToken = localStorage.getItem("user");
  const containerRef = useRef(null);

  const headers = { Authorization: `Bearer ${userToken}` };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchData = async (query) => {
    const requestParam = { search_term: query };

    try {
      const response = await axios.get(`${url}companylist/`, {
        headers,
        params: requestParam,
      });
      setSearchResults(
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
      setShowResults(true);
    }
  };

  const handleSelectOption = (option) => {
    if (isMultiple) {
      const isSelected = selectedOptions.some((o) => o.value === option.value);
      if (isSelected) {
        const newOptions = selectedOptions.filter(
          (o) => o.value !== option.value
        );
        setSelectedOptions(newOptions);
        setSelectedCompany(newOptions);
      } else {
        const newOptions = [...selectedOptions, option];
        setSelectedOptions(newOptions);
        setSelectedCompany(newOptions);
      }
    } else {
      setSelectedOptions(option);
      setSelectedCompany(option);
      setShowResults(false);
    }
  };

  const renderHeader = () => {
    if (isMultiple && selectedOptions.length > 0) {
      return `${selectedOptions?.length} selected` || "Company";
    } else if (selectedOptions && !isMultiple) {
      return (
        <Tooltip title={selectedOptions.label}>
          <span className="text-nowrap">
            {selectedOptions?.label?.substring(0, 22) + "..."}
          </span>
        </Tooltip>
      );
    } else {
      return <span className="italic text-gray-500">Company</span>;
    }
  };

  return (
    <div
      style={{ width: width ? width : "300px" }}
      className="relative z-50 mt-2"
      ref={containerRef}
    >
      <div
        className={`flex items-center pr-8 border border-gray-400 rounded-sm ${
          height ? height : "h-6"
        }`}
        onClick={() => setShowResults(!showResults)}
      >
        <h2
          className="text-[0.9em] flex-1 ml-1 "
          onClick={() => setShowResults(!showResults)}
        >
          {renderHeader()}
        </h2>
        <div onClick={() => setShowResults(!showResults)}>
          {showResults ? (
            <IoMdArrowDropup className="text-gray-400 cursor-pointer" />
          ) : (
            <IoMdArrowDropdown className="text-gray-400 cursor-pointer" />
          )}
        </div>
      </div>

      {showResults && (
        <ul className="absolute left-0 right-0 px-2 py-2 text-gray-600 bg-white border border-gray-400 rounded-sm shadow-md top-6 h-[250px] overflow-y-scroll z-50">
          <li>
            <input
              className="border border-gray-500 w-full rounded-sm outline-none text-[0.8em]  py-1 pl-1"
              type="text"
              placeholder="Search companiees..."
              onChange={(e) => handleSearchTermChange(e.target.value)}
              // onFocus={() => setShowResults(true)} // Show results when input is focused
            />
          </li>

          {searchResults.length ? (
            searchResults.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelectOption(option)}
                className={`my-1 cursor-pointer text-[0.8em] ${
                  isMultiple &&
                  selectedOptions.some((o) => o.value === option.value)
                    ? "bg-blue-200"
                    : ""
                }`}
              >
                {option.label}
              </li>
            ))
          ) : (
            <li className="my-1 cursor-pointer text-[0.8em]">No options</li>
          )}
        </ul>
      )}
    </div>
  );
};

DebounceSearchCompany.propTypes = {
  setSelectedCompany: PropTypes.func.isRequired,
  isMultiple: PropTypes.bool,
  selectedCompany: PropTypes.any,
  width: PropTypes.string,
  height: PropTypes.string,
  clientId: PropTypes.string,
};

DebounceSearchCompany.defaultProps = {
  isMultiple: false,
};

export default DebounceSearchCompany;
