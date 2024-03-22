import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

const CustomAutocomplete = ({ company, companies, setCompanies }) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectAllFlag, setSelectAllFlag] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const componentRef = useRef();
  const firstCompanyName = company
    .filter((item) => item.companyid === companies[0])
    .map((item) => item.companyname)
    .join(" ");

  useEffect(() => {
    setFilteredSuggestions(company);
  }, [company]);

  const handleOutsideClick = (e) => {
    if (componentRef.current && !componentRef.current.contains(e.target)) {
      setIsListOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const filtered = company.filter((suggestion) =>
      suggestion.companyname.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    setIsListOpen(!!value.trim());
  };
  const handleSuggestionClick = (suggestion) => {
    const isAlreadySelected = companies.includes(suggestion.companyid);

    if (isAlreadySelected) {
      const updatedItems = companies.filter(
        (item) => item !== suggestion.companyid
      );
      setCompanies(updatedItems);
    } else {
      setCompanies([...companies, suggestion.companyid]);
    }
    setInputValue("");
    setFilteredSuggestions(company);
  };

  const handleClickAll = () => {
    const allCompanyIds = company.map((suggestion) => suggestion.companyid);
    setCompanies(allCompanyIds);
    setSelectAllFlag(true);
  };

  const handleDisselectAll = () => {
    if (companies.length > 0) {
      setCompanies([]);
      setSelectAllFlag(false);
    }
  };

  return (
    <div className="relative mt-3" ref={componentRef}>
      <div
        role="button"
        className="flex items-center justify-between border border-gray-400 focus:border-black w-[200px] h-[25px] rounded-[3px] text-[0.8em] px-3"
        onClick={() => setIsListOpen(!isListOpen)}
      >
        {(!companies.length && (
          <span className="italic text-gray-600">Select</span>
        )) ||
          (companies.length === 1 && (
            <span className="truncate">
              {firstCompanyName.length > 8
                ? `${firstCompanyName.substring(0, 16)}...`
                : firstCompanyName}
            </span>
          )) ||
          (companies.length > 1 && `${companies.length} selected`)}{" "}
        <span className="text-lg text-gray-500">
          {isListOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
        </span>
      </div>
      {isListOpen && (
        <div className="absolute top-6 left-0 bg-white border border-gray-300 rounded-md z-50 w-[200px] h-[200px] text-[0.8em] flex flex-col items-center gap-1">
          {company.length > 0 ? (
            <>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="border border-gray-400 rounded-[3px] top-1 w-full outline-none"
              />
              <div className="flex items-center w-full mx-2 bg-gray-200 justify-evenly">
                <button
                  onClick={handleClickAll}
                  disabled={selectAllFlag}
                  className={`${selectAllFlag && "cursor-not-allowed"}`}
                >
                  Select All
                </button>
                <button
                  onClick={handleDisselectAll}
                  disabled={companies.length === 0}
                  className={`${
                    companies.length === 0 && "cursor-not-allowed"
                  }`}
                >
                  Deselect All
                </button>
              </div>
              <ul className="flex flex-col gap-2 mx-2 overflow-y-scroll">
                {/* Display selected items at the top */}
                {companies.map((selectedCompanyId) => {
                  const selectedSuggestion = company.find(
                    (suggestion) => suggestion.companyid === selectedCompanyId
                  );

                  return (
                    <li
                      style={{ opacity: 0.7 }}
                      key={selectedSuggestion.companyid}
                      onClick={() => handleSuggestionClick(selectedSuggestion)}
                      className={`cursor-pointer bg-[#e6faf9] w-full`}
                    >
                      {selectedSuggestion.companyname}
                    </li>
                  );
                })}
                {/* Display unselected items */}
                {filteredSuggestions.map((suggestion) => (
                  <li
                    style={{ opacity: 0.7 }}
                    key={suggestion.companyid}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`cursor-pointer w-full ${
                      companies.includes(suggestion.companyid) ? "hidden" : ""
                    }`}
                  >
                    {suggestion.companyname}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <span>No Options</span>
          )}
        </div>
      )}
    </div>
  );
};

CustomAutocomplete.propTypes = {
  company: PropTypes.arrayOf(
    PropTypes.shape({
      companyid: PropTypes.string.isRequired,
      companyname: PropTypes.string.isRequired,
    })
  ).isRequired,
  companies: PropTypes.arrayOf(PropTypes.string).isRequired,
  setCompanies: PropTypes.func.isRequired,
};

export default CustomAutocomplete;
