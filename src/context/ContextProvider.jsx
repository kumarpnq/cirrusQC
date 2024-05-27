import { createContext, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const ResearchContext = createContext(null);
const ContextProvider = ({ children }) => {
  // page access
  const [dumpAccess, setDumpAccess] = useState(false);

  const navigate = useNavigate();
  // auto logout
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [userToken, setUserToken] = useState("");
  //state for the login component
  const [researchOpen, setResearchOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  // for logout timer
  const [timerId, setTimerId] = useState(null);
  // loading state while fetching tableData
  // table headers in uppercase
  const [tableHeaders, setTableHeaders] = useState([]);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
  const formattedDate = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");
  const formattedNextDay = new Date(
    nextDay.getTime() - nextDay.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");

  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  // dates end
  // pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(600);

  const [showTableData, setShowTableData] = useState(false);

  // if user forgot the save the data after apply changes in  table
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  // qc2print
  const [qc2Open, setQc2Open] = useState(false);
  const [qc2PrintTableData, setQc2PrintTableData] = useState([]);
  const [fetchAfterSave, setFetchAfterSave] = useState(false);

  // unprotected route
  const [isValidNavigation, setIsValidNavigation] = useState(false);

  const handleLogout = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    setUserToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("isDMP");
    setUnsavedChanges(false);
    setPageNumber(1);
    navigate("/login");
  };

  return (
    <ResearchContext.Provider
      value={{
        dumpAccess,
        setDumpAccess,
        handleLogout,
        researchOpen,
        setResearchOpen,
        setLogoutTimer,
        name,
        setName,
        password,
        setPassword,
        setUserToken,
        userToken,
        timerId,
        setTimerId,
        fromDate,
        setFromDate,
        dateNow,
        setDateNow,
        showTableData,
        setShowTableData,
        tableHeaders,
        setTableHeaders,
        // data saved or not
        unsavedChanges,
        setUnsavedChanges,
        // Pagination
        pageNumber,
        setPageNumber,
        recordsPerPage,
        setRecordsPerPage,
        // qc2print
        qc2Open,
        setQc2Open,
        qc2PrintTableData,
        setQc2PrintTableData,
        fetchAfterSave,
        setFetchAfterSave,
        // unprotected route
        isValidNavigation,
        setIsValidNavigation,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};
ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default ContextProvider;
