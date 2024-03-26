import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
// hook
import useFetchData from "../hooks/useFetchData";

// * third party imports
import { toast } from "react-toastify";
// **constants
import { url } from "../constants/baseUrl";
import { dateTypes, qc1Array, qc2Array } from "../constants/dataArray";
import { formattedDate, formattedNextDay } from "../constants/dates";

// ** component
import SearchableDropdown from "../components/dropdowns/SearchableDropdown";
import CustomAutocomplete from "../components/custom/Autocomplet";
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
  // states
  const [tabValue, setTabValue] = useState(0);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [dateType, setDateType] = useState("");
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [qc1Done, setQc1Done] = useState("");
  const [qc2Done, setQc2Done] = useState("");
  const [qc1By, setQc1By] = useState([]);
  const [qc2By, setQc2By] = useState([]);
  const [dumpLoading, setDumpLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedColumnsForDump, setSelectedColumnsForDump] = useState([]);

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

  const handleReset = () => {};

  const classes = useStyle();
  return (
    <div className="mt-1">
      <BasicTabs value={tabValue} setValue={setTabValue} />
      <div className="h-screen mx-3">
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
          <CustomAutocomplete
            companies={selectedCompanies}
            setCompanies={setSelectedCompanies}
            company={companies}
          />
          <Datetype
            dateType={dateType}
            setDateType={setDateType}
            dateTypes={dateTypes}
            classes={classes}
          />
          <div className="h-[25px] flex items-center justify-center">
            <FromDate fromDate={fromDate} setFromDate={setFromDate} />
          </div>
          <div className="h-[25px] flex items-center justify-center">
            <ToDate dateNow={toDate} setDateNow={setToDate} />
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
              s
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
      />
    </div>
  );
};

export default Dump;
