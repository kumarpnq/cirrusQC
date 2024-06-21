import { useCallback, useState } from "react";
import { Box, Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

// *component imports
import SearchableDropdown from "../../components/dropdowns/SearchableDropdown";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import Qc1All from "../../components/research-dropdowns/Qc1All";
import Qc1By from "../../components/research-dropdowns/Qc1By";
import Languages from "../../components/research-dropdowns/Languages";
import Continents from "../../components/research-dropdowns/Continents";
import Countries from "../../components/research-dropdowns/Countries";
import CheckboxComp from "../../components/checkbox/Checkbox";
import Button from "../../components/custom/Button";
import EditDialog from "../../qc1-components/print/edit-dialog/EditDialog";
import CustomAutocomplete from "../../components/custom/Autocomplet";
import Datetype from "../../components/research-dropdowns/Datetype";

// * data hooks
import useFetchData from "../../hooks/useFetchData";

// *constants
import { url } from "../../constants/baseUrl";
import {
  continents,
  countriesByContinent,
  dateTypes,
  qc1Array,
} from "../../constants/dataArray";
import { formattedDate, formattedNextDay } from "../../constants/dates";

// * third party imports
import axios from "axios";
import { toast } from "react-toastify";

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

const Online = () => {
  // * state variables for search data
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [selectedDateType, setSelectedDateType] = useState("article");
  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  const [isQc1Done, setIsQc1Done] = useState(1);
  const [qc1By, setQc1By] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedContinents, setSelectedContinents] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [isImage, setIsImage] = useState(0);
  const [isVideo, setIsVideo] = useState(0);

  // * data hooks
  const {
    data: clientData,
    error: ClientError,
    loading: clientLoading,
  } = useFetchData(`${url}clientlist/`);
  const {
    data: companyData,
    error: companyError,
    loading: companyLoading,
  } = useFetchData(selectedClient ? `${url}companylist/${selectedClient}` : "");
  const { data: qcUserData } = useFetchData(`${url}qcuserlist/`);

  // * table data
  const [tableData, setTableData] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const fetchTableData = useCallback(async () => {
    try {
      setTableDataLoading(true);
      const response = await axios.get(`${url}endpoint`);
      console.log(response);
      setTableData(response.data);
      console.log(tableData);
    } catch (error) {
      toast.error(error);
    } finally {
      setTableDataLoading(false);
    }
  }, [tableData]);
  // *  mui style
  const classes = useStyle();

  //  * edit dialog
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [articleNumber, setArticleNumber] = useState(0);

  const handleRowClick = (row, rowNumber) => {
    setOpen((prev) => !prev);
    setSelectedRow(row);
    setArticleNumber(rowNumber);
  };

  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <button onClick={() => handleRowClick(params.row, params.id)}>
          Edit
        </button>
      ),
    },
    { field: "headline", headerName: "Headline", width: 250 },
    { field: "summary", headerName: "Summary", width: 300 },
    { field: "journalist", headerName: "Journalist", width: 150 },
    { field: "publication", headerName: "Publication", width: 150 },
    {
      field: "url",
      headerName: "URL",
      width: 100,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      ),
    },
    { field: "qcDone", headerName: "QC Done", width: 100 },
    { field: "articleDate", headerName: "Article Date", width: 150 },
    { field: "articleId", headerName: "Article ID", width: 150 },
  ];

  const rows = [
    {
      id: 1,
      action: "#",
      headline:
        "Fortune India: Business News, Strategy, Finance and Corporate Insight",
      summary:
        "BYJU s to delay March salaries; blames ‘misguided foreign investors BYJU s says these investors obtained court order that restricted use of funds raised through rights issue; assures employees could receive salaries by April 8.",
      journalist: "",
      publication: "fortuneindia.com",
      url: "#",
      qcDone: "No",
      articleDate: "18-JUN-24",
      articleId: "18200740589",
    },
    {
      id: 2,
      action: "#",
      headline:
        "Fortune India: Business News, Strategy, Finance and Corporate Insight",
      summary:
        "‘Moved mountains : Byju Raveendran admits to struggles in clearing salaries BYJU s says the co. has not had any external investor funding for 2 years apart from founder infusing over $1 bn — a reason why it launched a $200 mn righ ts issue to quickly raise mone.",
      journalist: "",
      publication: "fortuneindia.com",
      url: "#",
      qcDone: "No",
      articleDate: "18-JUN-24",
      articleId: "18200746311",
    },
    {
      id: 3,
      action: "#",
      headline:
        "Seethamraju Sudhakar @SakshiTV - Andhra/Telangana News తెలుగు వార్తలు - Video - APLatestNews",
      summary: ".",
      journalist: "",
      publication: "aplatestnews.com",
      url: "#",
      qcDone: "No",
      articleDate: "18-JUN-24",
      articleId: "18200749964",
    },
  ];

  return (
    <Box mx={2}>
      <Box
        sx={{ display: "flex", alignItems: "center", flexFlow: "wrap", gap: 1 }}
      >
        <div className="flex items-center mt-1" style={{ height: 25 }}>
          <SearchableDropdown
            options={clientData?.data?.clients || []}
            testclient={selectedClient}
            setTestClient={setSelectedClient}
            label="Clients"
            width={300}
          />
        </div>
        <CustomAutocomplete
          companies={selectedCompanies}
          setCompanies={setSelectedCompanies}
          company={companyData?.data?.companies || []}
        />
        <Datetype
          classes={classes}
          dateTypes={dateTypes}
          dateType={selectedDateType}
          setDateType={setSelectedDateType}
        />
        <FromDate fromDate={fromDate} setFromDate={setFromDate} />
        <ToDate dateNow={dateNow} setDateNow={setDateNow} isMargin={true} />
        <Qc1All
          qc1done={isQc1Done}
          setQc1done={setIsQc1Done}
          classes={classes}
          qc1Array={qc1Array}
        />
        <Qc1By
          qcUsersData={qcUserData?.data?.qc_users || []}
          qc1by={qc1By}
          setQc1by={setQc1By}
          classes={classes}
          pageType={"print"}
        />
        <Languages
          language={selectedLanguages}
          setLanguage={setSelectedLanguages}
          classes={classes}
        />
        <Continents
          continent={selectedContinents}
          setContinent={setSelectedContinents}
          countriesByContinent={countriesByContinent}
          setFilteredCountries={setFilteredCountries}
          continents={continents}
          classes={classes}
        />
        {/* countries */}
        <Countries
          country={selectedCountries}
          setCountry={setSelectedCountries}
          classes={classes}
          filteredCountries={filteredCountries}
        />
        <div className="flex flex-wrap items-center" style={{ height: 25 }}>
          <CheckboxComp value={isImage} setValue={setIsImage} label={"Image"} />
          <CheckboxComp value={isVideo} setValue={setIsVideo} label={"Video"} />
        </div>

        <Button
          btnText={tableDataLoading ? "searching" : "search"}
          isLoading={tableDataLoading}
          onClick={fetchTableData}
        />
      </Box>
      <Divider sx={{ mt: 1 }} />
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          pageSize={5}
          pageSizeOptions={[
            10,
            100,
            200,
            1000,
            { value: 1000, label: "1,000" },
          ]}
          density="compact"
          columnBufferPx={1000}
          disableColumnSelector
          disableDensitySelector
          disableSelectionOnClick
          hideFooterSelectedRowCount
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <EditDialog
        open={open}
        setOpen={setOpen}
        row={selectedRow}
        rowNumber={articleNumber}
      />
    </Box>
  );
};

export default Online;
