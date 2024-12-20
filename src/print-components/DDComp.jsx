import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { makeStyles } from "@mui/styles";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// ** constantss
import { formattedDate, formattedNextDay } from "../constants/dates";
import { qc1ArrayWithPartially, qc2Array } from "../constants/dataArray";
import { url } from "../constants/baseUrl";
// **component imports
import Client from "./dropdowns/Client";
import Category from "./dropdowns/Category";
import useFetchData from "../hooks/useFetchData";
import Datetype from "./dropdowns/DateType";
import FromDate from "../components/research-dropdowns/FromDate";
import ToDate from "../components/research-dropdowns/ToDate";
import Publication from "./dropdowns/Publication";
import PubType from "./dropdowns/PubType";
import SearchableCategory from "../components/research-dropdowns/table-dropdowns/SearchableCategory";
import SubjectSearchable from "../components/research-dropdowns/table-dropdowns/SubjectSearchable";
import TableDropdown from "../components/dropdowns/TableDropdown";
import Qc1All from "../components/research-dropdowns/Qc1All";
import Qc2All from "../components/research-dropdowns/Qc2All";
import Qc1By from "../components/research-dropdowns/Qc1By";
import Qc2By from "../components/research-dropdowns/Qc2By";
import Cities from "./dropdowns/Cities";
import Languages from "../components/research-dropdowns/Languages";
import Qc2Table from "./Qc2Table";
import { ResearchContext } from "../context/ContextProvider";
import Button from "../components/custom/Button";
import TextFields from "../components/TextFields/TextField";
import { mapBinaryToYesNoAll } from "../utils/mapBinaryToYesNoAll";

// ** third party imports
import axios from "axios";
import { toast } from "react-toastify";
import CustomDebounceDropdown from "../@core/CustomDebounceDropdown";
import { arrayToString } from "../utils/arrayToString";
import CustomTextField from "../@core/CutsomTextField";
import CustomMultiSelect from "../@core/CustomMultiSelect";
import YesOrNo from "../@core/YesOrNo";
import { getValueByTitle } from "../utils/getQc3ValueUsingTitle";

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
const DDComp = () => {
  const { userToken, pageNumber, recordsPerPage, setFetchAfterSave } =
    useContext(ResearchContext);
  // main table data
  const [printTableData, setPrintTableData] = useState([]);
  const printTableRef = useRef(null);
  useEffect(() => {
    if (printTableData.length > 1 && printTableRef.current) {
      printTableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [printTableData]);
  const [client, setClient] = useState("");
  const [withCategory, setWithCategory] = useState("");
  const [companies, setCompanies] = useState([]);
  const [dateType, setDateType] = useState("upload");
  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  const [publicationGroup, setPublicationGroup] = useState("");
  const [publication, setPublication] = useState("");
  const [pubType, setPubType] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [pageNo, setPageNo] = useState();
  const [searchArticleID, setSearchArticleID] = useState();
  const [qc3, setQc3] = useState("");
  const [selectedFullClient, setSelectedFullClient] = useState({
    clientId: "",
    clientName: "",
  });

  // reporting tone
  const [reportingTones, setReportingTones] = useState([]);
  const [reportingTone, setReportingTone] = useState("");
  const { data: reportingTons } = useFetchData(`${url}reportingtonelist`);
  useEffect(() => {
    if (reportingTons.data) {
      setReportingTones(reportingTons.data.reportingtones_list);
    }
  }, [reportingTons]);
  // prominence
  const [prominences, setProminences] = useState([]);
  const [prominence, setProminence] = useState("");
  const { data: prominenceLists } = useFetchData(`${url}prominencelist`);
  useEffect(() => {
    if (prominenceLists.data) {
      setProminences(prominenceLists.data.prominence_list);
    }
  }, [prominenceLists]);
  const [qc1Done, setQc1Done] = useState(2);
  const [qc2Done, setQc2Done] = useState("0");
  const [qc1By, setQc1By] = useState("");
  const [qc2By, setQc2By] = useState("");
  const { data: qcUserData } = useFetchData(`${url}qcuserlist/`, {
    qc1By,
    qc2By,
  });

  const qcUsersData = qcUserData?.data?.qc_users || [];
  const { data: clientList } = useFetchData(`${url}clientlist/`);
  const clientLists = clientList?.data?.clients || [];

  useEffect(() => {
    let selectedClient = client;
    if (client) {
      const clientData = clientLists.find(
        (client) => client?.clientid === selectedClient
      );

      setSelectedFullClient({
        clientId: clientData?.clientid,
        clientName: clientData?.clientname,
      });
    }
  }, [client, clientLists]);

  const [city, setCity] = useState([]);
  const [languages, setLanguages] = useState([]);
  // main TableData
  const [isTableDataLoading, setIsTableDataLoading] = useState(false);
  const [totalRecordsCount, setTotalRecordsCount] = useState(0);
  const [fetchingUsingPrevNext, setFetchingUsingPrevNext] = useState(false);
  const [retrieveAfterSave, setRetrieveAfterSave] = useState(false);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const addPropertyIfConditionIsTrue = (condition, obj, key, value) => {
    if (condition) {
      obj[key] = value;
    }
  };

  useEffect(() => {
    // Set isInitialMount to false after the first render
    setIsInitialMount(false);
  }, []);

  // * data states clear before refresh
  const [updatedData, setUpdatedData] = useState([]);
  const [differData, setDifferData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  const [highlightRows, setHighlightRows] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSearchPrintData = useCallback(async () => {
    // Don't run the function on the initial mount
    if (isInitialMount) {
      return;
    }

    if (!client) {
      toast.warning(`Please select a Client`);
      return;
    }

    setPrintTableData([]);
    setUpdatedData([]);
    setDifferData([]);
    setSearchedData([]);
    setHighlightRows([]);
    setSelectedItems([]);

    try {
      setIsTableDataLoading(true);
      const requestData = {
        client_id: client,
        from_date: fromDate,
        to_date: dateNow,
        date_type: dateType,
        // items_per_page: 50000,
        // page: pageNumber,
        count: "Y",
      };

      // Adding optional fields conditionally
      addPropertyIfConditionIsTrue(
        withCategory,
        requestData,
        "with_category",
        withCategory
      );
      addPropertyIfConditionIsTrue(
        companies.length > 0,
        requestData,
        "company_id",
        arrayToString(companies)
      );
      addPropertyIfConditionIsTrue(
        languages.length > 0,
        requestData,
        "language",
        arrayToString(languages)
      );
      addPropertyIfConditionIsTrue(
        publicationGroup,
        requestData,
        "pubgroup_id",
        publicationGroup
      );
      addPropertyIfConditionIsTrue(
        publication,
        requestData,
        "publication_id",
        publication
      );
      addPropertyIfConditionIsTrue(pubType, requestData, "pubtype", pubType);
      addPropertyIfConditionIsTrue(category, requestData, "category", category);
      addPropertyIfConditionIsTrue(
        subject,
        requestData,
        "reportingsubject",
        subject
      );
      addPropertyIfConditionIsTrue(
        reportingTone,
        requestData,
        "reportingtone",
        reportingTone
      );
      addPropertyIfConditionIsTrue(
        prominence,
        requestData,
        "prominence",
        prominence
      );
      addPropertyIfConditionIsTrue(
        qc1Done,
        requestData,
        "is_qc1",
        mapBinaryToYesNoAll(qc1Done)
      );
      addPropertyIfConditionIsTrue(
        qc2Done,
        requestData,
        "is_qc2",
        Number(qc2Done)
      );
      addPropertyIfConditionIsTrue(
        qc3,
        requestData,
        "is_qc3",
        getValueByTitle(qc3)
      );
      addPropertyIfConditionIsTrue(qc1By, requestData, "qc1_by", qc1By);
      addPropertyIfConditionIsTrue(qc2By, requestData, "qc2_by", qc2By);
      addPropertyIfConditionIsTrue(
        city.length > 0 && arrayToString(city),
        requestData,
        "city",
        arrayToString(city)
      );
      addPropertyIfConditionIsTrue(
        pageNo && Number(pageNo),
        requestData,
        "pagenumber",
        Number(pageNo)
      );
      addPropertyIfConditionIsTrue(
        Number(searchArticleID),
        requestData,
        "search_id",
        Number(searchArticleID)
      );

      const headers = {
        Authorization: "Bearer " + userToken,
      };
      const response = await axios.post(
        `${url}listArticlebyQCPrint/`,
        requestData,
        {
          headers,
        }
      );

      if (response?.data?.feed_data.length > 0) {
        setPrintTableData(response.data.feed_data);
      } else {
        toast.warning("No data found.");
      }
      if (response?.data?.feed_count) {
        const count = response?.data?.feed_count[0].total_rows;
        setTotalRecordsCount(count);
      }
      setFetchAfterSave(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTableDataLoading(false);
      setFetchingUsingPrevNext(false);
    }
  }, [
    client,
    fromDate,
    dateNow,
    dateType,
    recordsPerPage,
    pageNumber,
    withCategory,
    companies,
    languages,
    publicationGroup,
    publication,
    pubType,
    category,
    subject,
    reportingTone,
    prominence,
    qc1Done,
    qc2Done,
    qc1By,
    qc2By,
    city,
    pageNo,
    userToken,
    url,
    setPrintTableData,
    setTotalRecordsCount,
    setIsTableDataLoading,
    setFetchingUsingPrevNext,
    toast,
    setFetchAfterSave,
    isInitialMount,
    searchArticleID,
    qc3,
  ]);

  // separation of company list logic
  const [companyData, setCompanyData] = useState([]);
  const [cachedCompanies, setCachedCompanies] = useState([]);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const headers = {
          Authorization: "Bearer " + userToken,
        };
        const response = await axios.get(`${url}companylist/${client || ""}`, {
          headers,
        });
        setCompanyData(response.data.companies || []);
        if (!client && !cachedCompanies.length) {
          setCachedCompanies(response.data.companies || []);
        }
      } catch (error) {
        console.log("Error while fetching companies");
      }
    };
    fetchCompanies();
  }, [client, cachedCompanies.length, userToken]);
  const companiesToMap = !client
    ? cachedCompanies.length
      ? cachedCompanies
      : companyData
    : companyData || [];
  const classes = useStyle();
  return (
    <div className="flex flex-col h-screen px-4">
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Search Filters
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-wrap items-center justify-start gap-2">
            <div className="h-[25px] flex items-center justify-center pt-1">
              <Client
                label="Client"
                client={client}
                setClient={setClient}
                width={200}
                setCompanies={setCompanies}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Category
                category={withCategory}
                setCategory={setWithCategory}
                classes={classes}
                width={150}
              />
            </div>
            <div className="h-[25px] pt-1.5 w-[200px]">
              <CustomMultiSelect
                dropdownToggleWidth={200}
                dropdownWidth={250}
                keyId="companyid"
                keyName="companyname"
                options={companiesToMap || []}
                selectedItems={companies}
                setSelectedItems={setCompanies}
                title="companies"
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Datetype
                dateType={dateType}
                setDateType={setDateType}
                classes={classes}
                width={150}
              />
            </div>

            <div className="h-[25px] flex items-center justify-center">
              <FromDate fromDate={fromDate} setFromDate={setFromDate} />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <ToDate
                dateNow={dateNow}
                setDateNow={setDateNow}
                isMargin={true}
              />
            </div>

            <div className="h-[25px] flex items-center justify-center">
              <CustomDebounceDropdown
                publicationGroup={publicationGroup}
                setPublicationGroup={setPublicationGroup}
                bg="secondory"
                m="mt-3"
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Publication
                publicationGroup={publicationGroup}
                publication={publication}
                setPublication={setPublication}
                classes={classes}
                width={150}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <PubType
                pubType={pubType}
                setPubType={setPubType}
                classes={classes}
                width={150}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center pt-1">
              <SearchableCategory
                label="Category"
                setCategory={setCategory}
                category={category}
                width={150}
                endpoint="categorylist"
              />
            </div>
            <div className="h-[25px] flex items-center justify-center pt-1">
              <SubjectSearchable
                label="Subject"
                setSubject={setSubject}
                subject={subject}
                width={150}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <TableDropdown
                value={reportingTone}
                setValues={setReportingTone}
                placeholder={"Tone"}
                mappingValue={reportingTones}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <TableDropdown
                value={prominence}
                setValues={setProminence}
                placeholder={"Prominence"}
                mappingValue={prominences}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Qc1All
                qc1done={qc1Done}
                setQc1done={setQc1Done}
                classes={classes}
                qc1Array={qc1ArrayWithPartially}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Qc2All
                qc2done={qc2Done}
                setQc2done={setQc2Done}
                classes={classes}
                qc2Array={qc2Array}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center mt-3">
              <YesOrNo
                classes={classes}
                mapValue={["With Auto", "Without Auto", "All", "Only Auto"]}
                placeholder="QC3"
                value={qc3}
                setValue={setQc3}
                width={100}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Qc1By
                qcUsersData={qcUsersData || []}
                qc1by={qc1By}
                setQc1by={setQc1By}
                classes={classes}
                pageType={"print"}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Qc2By
                qcUsersData={qcUsersData || []}
                classes={classes}
                qc2by={qc2By}
                setQc2by={setQc2By}
                pageType={"print"}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Cities classes={classes} city={city} setCity={setCity} />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Languages
                language={languages}
                setLanguage={setLanguages}
                classes={classes}
              />
            </div>

            <div className="h-[25px] flex items-center justify-center w-[95px]">
              <TextFields
                placeholder="Page"
                type={"number"}
                value={pageNo}
                setValue={setPageNo}
              />
            </div>
            <div className="flex items-center justify-center h-3 pt-3">
              <CustomTextField
                width={170}
                placeholder={"ArticleID"}
                type={"number"}
                value={searchArticleID}
                setValue={setSearchArticleID}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Button
                btnText={isTableDataLoading ? "Searching" : "Search"}
                onClick={handleSearchPrintData}
                isLoading={isTableDataLoading}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>

      <div ref={printTableRef}>
        <Qc2Table
          isTableDataLoading={isTableDataLoading}
          qc2PrintTableData={printTableData}
          setQc2PrintTableData={setPrintTableData}
          totalRecordsCount={totalRecordsCount}
          setFetchingUsingPrevNext={setFetchingUsingPrevNext}
          setRetrieveAfterSave={setRetrieveAfterSave}
          updatedData={updatedData}
          setUpdatedData={setUpdatedData}
          highlightRows={highlightRows}
          setHighlightRows={setHighlightRows}
          searchedData={searchedData}
          setSearchedData={setSearchedData}
          differData={differData}
          setDifferData={setDifferData}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          selectedClient={selectedFullClient}
        />
      </div>
    </div>
  );
};

export default DDComp;
