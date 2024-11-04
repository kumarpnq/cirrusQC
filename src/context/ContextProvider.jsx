import {
  createContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const ResearchContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [screenPermissions, setScreenPermissions] = useState({
    "Online-QC2": false,
    "Print-QC2": false,
    Dump: false,
    "Manual-upload": false,
    "Non-Tagged": false,
    Analytics: false,
    onlineQC1: false,
    printQc1: false,
    clientBasketCityPublication: false,
    PrintSimilarArticles: false,
    copyArticles: false,
    mailerSchedular: false,
    companySlicing: false,
    whatsappContact: false,
    clientMaster: false,
    booleanKeyword: false,
  });
  const [permissionLoading, setPermissionLoading] = useState(false);

  const navigate = useNavigate();
  // auto logout
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [userToken, setUserToken] = useState("");
  // state for the login component
  const [researchOpen, setResearchOpen] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  // for logout timer
  const [timerId, setTimerId] = useState(null);
  // loading state while fetching tableData

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

  const handleLogout = useCallback(() => {
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
    setUserToken("");
    localStorage.removeItem("user");
    localStorage.removeItem("isDMP");
    setUnsavedChanges(false);
    setPageNumber(1);
    navigate("/login");
  }, [logoutTimer, navigate]);

  useEffect(() => {
    const permissionData = sessionStorage.getItem("prmsn");

    if (permissionData) {
      const parsedPermissions = JSON.parse(permissionData);
      // Map permission values to boolean
      const mappedPermissions = Object.fromEntries(
        Object.entries(parsedPermissions).map(([key, value]) => [
          key,
          value === "Yes",
        ])
      );
      setScreenPermissions(mappedPermissions);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      screenPermissions,
      setScreenPermissions,
      permissionLoading,
      setPermissionLoading,
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
    }),
    [
      screenPermissions,
      permissionLoading,
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
      unsavedChanges,
      setUnsavedChanges,
      pageNumber,
      setPageNumber,
      recordsPerPage,
      setRecordsPerPage,
      qc2Open,
      setQc2Open,
      qc2PrintTableData,
      setQc2PrintTableData,
      fetchAfterSave,
      setFetchAfterSave,
      isValidNavigation,
      setIsValidNavigation,
    ]
  );

  return (
    <ResearchContext.Provider value={contextValue}>
      {children}
    </ResearchContext.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContextProvider;
