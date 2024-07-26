import { useContext, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// hook
import useFetchData from "../hooks/useFetchData";

// * third party imports
import { toast } from "react-toastify";
import axios from "axios";
// **constants
import { url } from "../constants/baseUrl";
import {
  dateTypes,
  qc1Array,
  qc2Array,
  qcPermissions,
} from "../constants/dataArray";
import { formattedDate, formattedNextDay } from "../constants/dates";

// ** component
import SearchableDropdown from "../components/dropdowns/SearchableDropdown";
import Datetype from "../components/research-dropdowns/Datetype";
import FromDate from "../components/research-dropdowns/FromDate";
import ToDate from "../components/research-dropdowns/ToDate";
import Qc1All from "../components/research-dropdowns/Qc1All";
import Qc2All from "../components/research-dropdowns/Qc2All";
import Qc1By from "../components/research-dropdowns/Qc1By";
import Qc2By from "../components/research-dropdowns/Qc2By";
import Button from "../components/custom/Button";
import BasicTabs from "../dump-components/customTabPanel";
import AlertDialogSlide from "../dump-components/alertSlide";
import Permissions from "../dump-components/Permission";
import JobDetails from "../dump-components/JobDetails";
import { ResearchContext } from "../context/ContextProvider";
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
const Dump = () => {
  const { userToken } = useContext(ResearchContext);
  // states
  const [tabValue, setTabValue] = useState(0);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [dateType, setDateType] = useState("article");
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [qc1Done, setQc1Done] = useState("2");
  const [qc2Done, setQc2Done] = useState("2");
  const [qc1By, setQc1By] = useState("");
  const [qc2By, setQc2By] = useState("");
  const [dumpLoading, setDumpLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedColumnsForDump, setSelectedColumnsForDump] = useState([]);
  const [qcPermission, setQcPermission] = useState(0);
  // job data
  const [jobData, setJobData] = useState([]);
  const [fetchDumpData, setFetchDumpData] = useState(false);

  // selectedDate must be less than 62 days
  useEffect(() => {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const timeDifference = Math.abs(endDate.getTime() - startDate.getTime());
    const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (dayDifference > 62) {
      toast.warning("limit exceeding!");
    }
  }, [fromDate, toDate]);

  // clients
  const {
    data: clientList,
    // error,
    // loading,
  } = useFetchData(`${url}clientlist/`, clients);
  useEffect(() => {
    clientList?.data?.clients && setClients(clientList.data.clients);
  }, [clientList]);

  // company
  const {
    data: companyList,
    // error,
    // loading,
  } = useFetchData(selectedClient ? `${url}companylist/${selectedClient}` : "");
  useEffect(() => {
    companyList?.data?.companies &&
      setCompanies(companyList?.data?.companies || []);
  }, [selectedClient, companyList]);
  const { data: qcUserData } = useFetchData(`${url}qcuserlist/`, {
    qc1By,
    qc2By,
  });
  const qcUsersData = qcUserData?.data?.qc_users || [];

  const { data: articleData } = useFetchData(
    `${url}articlecolumnslist/`,
    tabValue
  );
  const articleFeedList = articleData?.data?.socialfeedlist || {};

  const { data: socialFeedData } = useFetchData(
    `${url}socialfeedcolumnslist/`,
    tabValue
  );
  const socialFeedList = socialFeedData?.data?.socialfeedlist || {};

  const columnsForDump = tabValue ? articleFeedList : socialFeedList;

  const handleDump = () => {
    if (!selectedClient) {
      return toast.warning("Please select the fields.");
    }
    setDumpLoading((prev) => !prev);
    setOpenDialog(true);
    setDumpLoading((prev) => !prev);
  };
  // for the job details
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${userToken}`,
        };
        const screen_type = tabValue ? "print" : "online";
        const response = await axios.get(
          `${url}userjoblist?screen=${screen_type}`,
          {
            headers,
          }
        );
        setJobData(response.data.job_list);
        setFetchDumpData(false);
      } catch (error) {
        toast.error("Error while fetching");
      }
    };
    fetchJobs();
  }, [userToken, tabValue, fetchDumpData]);

  const handleReset = () => {
    setSelectedClient("");
    setSelectedCompanies([]);
    setDateType("");
    setFromDate(formattedDate);
    setToDate(formattedNextDay);
    setQc1Done("");
    setQc2Done("");
    setQc1By([]);
    setQc2By([]);
    setQcPermission(0);
  };

  const classes = useStyle();
  return (
    <div className="mx-3 mt-1 ">
      <BasicTabs
        value={tabValue}
        setValue={setTabValue}
        setSelectedColumnsForDump={setSelectedColumnsForDump}
      />
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Search Filters
        </AccordionSummary>
        <AccordionDetails>
          <div className="flex flex-wrap items-center gap-1 mt-2 ">
            <div className="flex items-center mt-1" style={{ height: 25 }}>
              <SearchableDropdown
                options={clients}
                testclient={selectedClient}
                setTestClient={setSelectedClient}
                label="Clients"
                width={300}
              />
            </div>
            {/* company */}

            <div className="w-[200px] pt-2.5">
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
            <Datetype
              dateType={dateType}
              setDateType={setDateType}
              dateTypes={dateTypes}
              classes={classes}
            />

            {
              // only show when tab is print
              !!tabValue && (
                <div className="mb-[2px]">
                  <Permissions
                    value={qcPermission}
                    setValue={setQcPermission}
                    classes={classes}
                    width={120}
                    mapValue={qcPermissions}
                    placeholder="Permission"
                  />
                </div>
              )
            }

            <div className="h-[25px] flex items-center justify-center">
              <FromDate fromDate={fromDate} setFromDate={setFromDate} />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Qc1All
                qc1done={qc1Done}
                setQc1done={setQc1Done}
                classes={classes}
                qc1Array={qc1Array}
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
            <div className="h-[25px] flex items-center justify-center">
              <Qc1By
                qcUsersData={qcUsersData}
                qc1by={qc1By}
                setQc1by={setQc1By}
                classes={classes}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Qc2By
                qcUsersData={qcUsersData}
                classes={classes}
                qc2by={qc2By}
                setQc2by={setQc2By}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Button
                btnText={dumpLoading ? "Searching" : "Search"}
                onClick={handleDump}
                isLoading={dumpLoading}
              />
            </div>
            <div className="h-[25px] flex items-center justify-center">
              <Button
                btnText={"Reset"}
                onClick={handleReset}
                // isLoading={dumpLoading}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      <div className="flex flex-col gap-5 mt-1">
        <JobDetails rows={jobData} URI={url} />
      </div>

      <AlertDialogSlide
        open={openDialog}
        setOpen={setOpenDialog}
        data={columnsForDump}
        selectedColumnForDump={selectedColumnsForDump}
        setSelectedColumnsForDump={setSelectedColumnsForDump}
        tabValue={tabValue}
        clientId={selectedClient}
        companyId={selectedCompanies}
        dateType={dateType}
        fromDate={fromDate}
        toDate={toDate}
        qc1By={qc1By}
        qc2By={qc2By}
        isQc1={qc1Done}
        isQc2={qc2Done}
        qcPermission={qcPermission}
        setFetchDumpData={setFetchDumpData}
      />
    </div>
  );
};

export default Dump;
