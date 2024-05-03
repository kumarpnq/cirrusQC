import { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { debounce } from "lodash";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import PropTypes from "prop-types";
import { ResearchContext } from "../../../context/ContextProvider";
import { url } from "../../../constants/baseUrl";

const DebounceSearchCompany = ({ setSelectedCompany }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false); // State to manage visibility
  const { userToken } = useContext(ResearchContext);
  const containerRef = useRef(null);

  const headers = { Authorization: `Bearer ${userToken}` };

  useEffect(() => {
    // Event listener to detect clicks outside the component
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
      setShowResults(true); // Show results when typing
    } else {
      setShowResults(false); // Hide results when input is empty
    }
  };

  const handleSelectOption = (option) => {
    if (selectedOption && selectedOption.value === option.value) {
      setSelectedOption(null);
      setSelectedCompany(null);
    } else {
      setSelectedOption(option);
      setSelectedCompany(option);
    }
    setShowResults(false);
  };

  return (
    <div
      style={{ width: "300px" }}
      className="relative mt-2"
      ref={containerRef}
    >
      <div className="flex items-center pr-8 border border-gray-400 rounded-sm">
        <input
          className="border-none outline-none text-[0.8em] flex-1 py-1 pl-1"
          type="text"
          placeholder="Search companies..."
          onChange={(e) => handleSearchTermChange(e.target.value)}
          onFocus={() => setShowResults(true)} // Show results when input is focused
        />
        <div onClick={() => setShowResults(!showResults)}>
          {showResults ? (
            <IoMdArrowDropup className="text-gray-400 cursor-pointer" />
          ) : (
            <IoMdArrowDropdown className="text-gray-400 cursor-pointer" />
          )}
        </div>
      </div>
      {showResults && (
        <ul className="absolute left-0 right-0 px-2 py-2 text-gray-600 bg-white border border-gray-400 rounded-sm shadow-md top-full">
          {searchResults.length ? (
            searchResults.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelectOption(option)}
                className={`my-1 cursor-pointer text-[0.8em] ${
                  selectedOption === option ? "bg-blue-200" : ""
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
};

export default DebounceSearchCompany;
