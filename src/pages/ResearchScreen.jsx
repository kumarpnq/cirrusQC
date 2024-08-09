import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// * constants
import {
  dateTypes,
  qc1Array,
  continents,
  countriesByContinent,
  qc2Array,
} from "../constants/dataArray";
import { url } from "../constants/baseUrl";

import ResearchTable from "../components/research-components/ResearchTable";
import { ResearchContext } from "../context/ContextProvider";

// * components import
import useFetchData from "../hooks/useFetchData";
import SearchableDropDown from "../components/dropdowns/SearchableDropdown";
import CheckboxComp from "../components/checkbox/Checkbox";
import Datetype from "../components/research-dropdowns/Datetype";
import FromDate from "../components/research-dropdowns/FromDate";
import ToDate from "../components/research-dropdowns/ToDate";
import Qc1All from "../components/research-dropdowns/Qc1All";
import Qc2All from "../components/research-dropdowns/Qc2All";
import Qc1By from "../components/research-dropdowns/Qc1By";
import Qc2By from "../components/research-dropdowns/Qc2By";
import Languages from "../components/research-dropdowns/Languages";
import Continents from "../components/research-dropdowns/Continents";
import Countries from "../components/research-dropdowns/Countries";
import CustomAutocomplete from "../components/custom/Autocomplet";
import CustomMultiSelect from "../@core/CustomMultiSelect";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
    marginTop: "1em",
  },

  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    background: "#d4c8c7",
  },
}));
const ResearchScreen = () => {
  const classes = useStyle();
  const userToken = localStorage.getItem("user");
  const [clients, setClients] = useState([]);
  const [company, setCompany] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [clientId, setClientId] = useState("");
  const [companyId, setCompanyId] = useState([]);

  //languages
  const [language, setLanguage] = useState([]);
  // selecting continent
  const [continent, setContinent] = useState([]);
  // basis onn the selection of the continent showing th country
  const [country, setCountry] = useState([]);
  // image
  const [isImage, setIsImage] = useState(0);
  // video
  const [isVideo, setIsVideo] = useState(0);
  // qcusers data
  // data type separate
  const [dateType, setDateType] = useState("article");
  // qc by defaut it will be null
  const [qc1done, setQc1done] = useState(2);
  // qc2done
  const [qc2done, setQc2done] = useState(0);
  // qc1by
  const [qc1by, setQc1by] = useState("");
  // qc2by
  const [qc2by, setQc2by] = useState("");
  const [tableHeaders, setTableHeaders] = useState([]);
  const [qcUsersData, setQcUsersData] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  // loading state for the tableData fetching
  const [tableDataLoading, setTableDataLoading] = useState(false);
  // converting arrays to the string.
  const [langsToString, setLangsToString] = useState("");
  const [continentsToString, setContinentsToString] = useState("");
  const [countriesToString, setCountriesToString] = useState("");

  // main data
  const [tableData, setTableData] = useState([]);
  const {
    fromDate,
    setFromDate,
    dateNow,
    setDateNow,
    setShowTableData,
    unsavedChanges,
    setUnsavedChanges,
  } = useContext(ResearchContext);
  const researchTableRef = useRef(null);
  useEffect(() => {
    if (tableData.length > 1 && researchTableRef.current) {
      researchTableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [tableData]);
  // base url
  // clients
  const {
    data: clientData,
    error: ClientError,
    loading: clientLoading,
  } = useFetchData(`${url}clientlist/`, clients);
  useEffect(() => {
    if (clientData.data) {
      setClients(clientData.data.clients);
    } else {
      console.log(ClientError);
    }
  }, [clientData, setClients, ClientError]);
  // fetching the companies
  const {
    data: companyData,
    error: companyError,
    loading: companyLoading,
  } = useFetchData(clientId ? `${url}companylist/${clientId}` : "");
  useEffect(() => {
    if (clientId || companyData.data) {
      setCompany(companyData?.data?.companies || []);
      setCompanies([]);
      setUnsavedChanges(false);
      setShowTableData(false);
    } else {
      console.log(companyError);
    }
  }, [
    clientId,
    companyData,
    setCompany,
    setCompanies,
    setShowTableData,
    companyError,
    setUnsavedChanges,
  ]);
  //fetching qcusers
  const { data: qcUserData, error: qcUserDataError } = useFetchData(
    `${url}qcuserlist/`
  );
  useEffect(() => {
    if (qcUserData.data) {
      setQcUsersData(qcUserData.data.qc_users);
    } else {
      console.log(qcUserDataError);
    }
  }, [qcUserData, qcUserDataError]);

  // loading states

  const arrayToString = (arr) => {
    if (Array.isArray(arr)) {
      if (arr.length > 0) {
        return arr.map((item) => `'${item}'`).join(",");
      } else {
        return "";
      }
    } else {
      return "";
    }
  };
  useEffect(() => {
    companies
      ? setCompanyId(companies?.map((item) => `'${item}'`).join(","))
      : setCompanyId([]);
  }, [companies]);
  useEffect(() => {
    const langsV = arrayToString(language);
    const continentV = arrayToString(continent);
    const countriesV = arrayToString(country);

    setLangsToString(langsV);
    setContinentsToString(continentV);
    setCountriesToString(countriesV);
  }, [language, continent, country, qc1by, qc2by]);

  // * languages
  const {
    data: langs,
    //  error: langsError,
    // loading: langsLoading,
  } = useFetchData(`${url}languagelist/`);

  // searching the tabledata using multiple parameters
  const handleSearch = async () => {
    if (clientId) {
      if (unsavedChanges) {
        toast.error("You might be missing to save", {
          autoClose: 3000,
        });
      } else {
        setShowTableData(!!companies);
        setTableDataLoading(true);

        // * extracting languages
        const languages = langs?.data?.languages || [];
        const matchingLanguageKeys = Object.entries(languages)
          .filter(([key, value]) => language.includes(value))
          .map(([key, value]) => key);
        try {
          let requestData = {
            client_id: clientId,
            // company_id: "'690','GOOGLE_AND','1222'", //optional using condition
            date_type: dateType,
            from_date: fromDate,
            to_date: dateNow,
            // search_text: searchValue,
            // qc1_by: "qc1_user", //optional using condition
            // qc2_by: "qc2_user", //optional using condition
            is_qc1: Number(qc1done),
            is_qc2: Number(qc2done),
            has_image: isImage,
            has_video: isVideo,
            // continent: "Asia", //optional using condition
            // country: "India",  //optional using condition
            // language: langsTostring, //optional using condition
            // page: pageNumber,
            // items_per_page: recordsPerPage,
            // count:'Y',   //optional using condition
          };
          // eslint-disable-next-line no-inner-declarations
          function addPropertyIfConditionIsTrue(condition, property, value) {
            if (condition) {
              requestData[property] = value;
            }
          }
          addPropertyIfConditionIsTrue(companyId, "company_id", companyId);
          addPropertyIfConditionIsTrue(qc1by, "qc1_by", qc1by);
          addPropertyIfConditionIsTrue(qc2by, "qc2_by", qc2by);
          addPropertyIfConditionIsTrue(
            continentsToString,
            "continent",
            continentsToString
          );
          addPropertyIfConditionIsTrue(
            countriesToString,
            "country",
            countriesToString
          );
          addPropertyIfConditionIsTrue(
            arrayToString(matchingLanguageKeys),
            "language",
            arrayToString(matchingLanguageKeys)
          );

          const requestDataJSON = JSON.stringify(requestData);
          const response = await axios.post(
            `${url}listArticlebyQCTemp/`,
            requestDataJSON,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + userToken,
              },
            }
          );
          if (response) {
            const localeV = response.data.feed_data;
            if (localeV && localeV.length > 0) {
              // Check if localeV is not null or undefined
              const updatedData = localeV.map((item) => ({
                ...item,
                link: (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Link
                  </a>
                ),
              }));
              setTableData(updatedData);
              setTableHeaders(
                Object.keys(localeV[0]).map((header) =>
                  header.toUpperCase().replace(/_/g, " ")
                )
              );
            } else {
              toast.warning("No data found.");
            }
          }

          setTableDataLoading(false);
        } catch (error) {
          toast.error(error.message);
          setTableDataLoading(false);
          setTableData([]);
        }
      }
    } else {
      toast.warn("Please select a client.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="h-full pl-4">
      {/* Category dropdowns filter out */}
      {/* client */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Search Filters
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-wrap items-center gap-1 mt-2">
            <div className="flex items-center mt-1" style={{ height: 25 }}>
              <SearchableDropDown
                options={clients}
                setTestClient={setClientId}
                testclient={clientId}
                label={"Clients"}
                width={200}
              />
            </div>
            {/* comapany */}

            <div className="w-[200px] mt-3">
              <CustomMultiSelect
                dropdownToggleWidth={200}
                dropdownWidth={250}
                keyId="companyid"
                keyName="companyname"
                options={company || []}
                selectedItems={companies}
                setSelectedItems={setCompanies}
                title="companies"
              />
            </div>
            {/* Datetype */}
            <Datetype
              dateType={dateType}
              classes={classes}
              dateTypes={dateTypes}
              setDateType={setDateType}
            />
            {/* date filter from date */}
            <FromDate fromDate={fromDate} setFromDate={setFromDate} />
            {/* date filter to now date */}
            <ToDate dateNow={dateNow} setDateNow={setDateNow} isMargin={true} />
            {/* qc1 done */}
            <Qc1All
              qc1done={qc1done}
              setQc1done={setQc1done}
              classes={classes}
              qc1Array={qc1Array}
            />
            {/* qc2 done */}
            <Qc2All
              qc2done={qc2done}
              setQc2done={setQc2done}
              classes={classes}
              qc2Array={qc2Array}
            />
            {/* qc1 by */}
            <Qc1By
              qcUsersData={qcUsersData}
              qc1by={qc1by}
              setQc1by={setQc1by}
              classes={classes}
            />
            {/* qc2 by */}
            <Qc2By
              qcUsersData={qcUsersData}
              classes={classes}
              qc2by={qc2by}
              setQc2by={setQc2by}
            />
            {/* image checkbox */}
            <div className="flex items-center" style={{ height: 20 }}>
              <div className="mt-4">
                <CheckboxComp
                  value={isImage}
                  setValue={setIsImage}
                  label={"Image"}
                />
              </div>
              {/* video checkbox */}
              <div className="mt-4">
                <CheckboxComp
                  value={isVideo}
                  setValue={setIsVideo}
                  label={"Video"}
                />
              </div>
            </div>
            {/* languages */}
            <Languages
              language={language}
              setLanguage={setLanguage}
              classes={classes}
              // isOnlineScreen
            />
            {/* continents */}
            <Continents
              continent={continent}
              countriesByContinent={countriesByContinent}
              setContinent={setContinent}
              setFilteredCountries={setFilteredCountries}
              continents={continents}
              classes={classes}
            />
            {/* countries */}
            <Countries
              country={country}
              setCountry={setCountry}
              classes={classes}
              filteredCountries={filteredCountries}
            />
            <button
              onClick={() => {
                handleSearch();
              }}
              className={`bg-primary border border-gray-400 rounded px-10 mt-3 uppercase text-white text-[0.9em] ${
                tableDataLoading ? "text-yellow-300" : "text-white"
              }`}
            >
              {tableDataLoading ? "Loading..." : "Search"}
            </button>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* table */}
      <div ref={researchTableRef}>
        <ResearchTable
          tableDataLoading={tableDataLoading}
          tableData={tableData}
          tableHeaders={tableHeaders}
          setTableData={setTableData}
        />
      </div>
    </div>
  );
};

export default ResearchScreen;
