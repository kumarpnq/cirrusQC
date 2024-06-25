import { useCallback, useState } from "react";
import { Box, CircularProgress, Divider, IconButton } from "@mui/material";
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
import CustomTextField from "../../@core/CutsomTextField";
import { arrayToString } from "../../utils/arrayToString";
import { EditAttributesOutlined } from "@mui/icons-material";

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
  const [headOrSummary, setHeadOrSummary] = useState("");
  const [link, setLink] = useState("");
  const [socialFeedId, setSocialFeedId] = useState("");

  // * data hooks
  const { data: clientData } = useFetchData(`${url}clientlist/`);
  const { data: companyData } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : ""
  );
  const { data: qcUserData } = useFetchData(`${url}qcuserlist/`);

  // * table data
  const [tableData, setTableData] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const fetchTableData = useCallback(async () => {
    try {
      setTableDataLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      const params = {
        client_id: selectedClient,
        from_date: fromDate,
        to_date: dateNow,
        date_type: selectedDateType,

        //* optional params
        // company_ids: "",
        // search_text: "",
        // link: "",
        // is_qc1: "",
        // qc_1by: "",
        // language: "",
        // continent: "",
        // country: "",
        // has_image: "",
        // has_video: "",
        // socialfeed_id: "",
        // count: "",
      };

      // eslint-disable-next-line no-inner-declarations
      function addPropertyIfConditionIsTrue(condition, property, value) {
        if (condition) {
          params[property] = value;
        }
      }
      addPropertyIfConditionIsTrue(
        selectedCompanies.length > 0,
        "company_ids",
        arrayToString(selectedCompanies)
      );
      addPropertyIfConditionIsTrue(
        headOrSummary !== "",
        "search_text",
        headOrSummary
      );
      addPropertyIfConditionIsTrue(qc1By !== "", "qc_1by", qc1By);
      addPropertyIfConditionIsTrue(link !== "", "link", link);
      addPropertyIfConditionIsTrue(isQc1Done !== 0, "is_qc1", isQc1Done);
      addPropertyIfConditionIsTrue(
        selectedLanguages.length > 0,
        "language",
        arrayToString(selectedLanguages)
      );
      addPropertyIfConditionIsTrue(
        selectedContinents.length > 0,
        "continent",
        arrayToString(selectedContinents)
      );
      addPropertyIfConditionIsTrue(
        selectedCountries.length > 0,
        "country",
        arrayToString(selectedCountries)
      );
      addPropertyIfConditionIsTrue(isImage !== 0, "has_image", isImage);
      addPropertyIfConditionIsTrue(isVideo !== 0, "has_video", isVideo);
      addPropertyIfConditionIsTrue(
        socialFeedId !== "",
        "socialfeed_id",
        socialFeedId
      );
      const response = await axios.get(`${url}listArticlebyQC1/`, {
        headers,
        params,
      });
      setTableData(response.data.feed_data || []);
    } catch (error) {
      toast.error(error);
    } finally {
      setTableDataLoading(false);
    }
  }, [
    dateNow,
    fromDate,
    headOrSummary,
    isImage,
    isQc1Done,
    isVideo,
    link,
    qc1By,
    selectedClient,
    selectedCompanies,
    selectedContinents,
    selectedCountries,
    selectedDateType,
    selectedLanguages,
    socialFeedId,
  ]);
  // *  mui style
  const classes = useStyle();

  //  * edit dialog
  const [open, setOpen] = useState(false);
  const [articleNumber, setArticleNumber] = useState(0);

  const handleRowClick = (row, rowNumber) => {
    setOpen((prev) => !prev);
    setArticleNumber(rowNumber);
  };

  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleRowClick(params.row, params.id)}>
          <EditAttributesOutlined className="text-primary" />
        </IconButton>
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
    { field: "socialFeedId", headerName: "socialFeedId", width: 150 },
  ];

  const rows = tableData.map((item, index) => ({
    id: index,
    action: "#",
    headline: item.headline,
    summary: item.detail_summary,
    journalist: item.journalist,
    publication: item.publication,
    url: item.link,
    qcDone: item.qc1_done,
    articleDate: item.feed_date_time,
    socialFeedId: item.social_feed_id,
  }));
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
        <div
          className="flex flex-wrap items-center gap-2 pt-2"
          style={{ height: 25 }}
        >
          <CustomTextField
            width={200}
            placeholder="Summary/Headline"
            type="text"
            value={headOrSummary}
            setValue={setHeadOrSummary}
          />
          <CustomTextField
            width={200}
            placeholder="Link"
            type="text"
            value={link}
            setValue={setLink}
          />
          <CustomTextField
            width={200}
            placeholder={"socialFeedId"}
            type={"number"}
            value={socialFeedId}
            setValue={setSocialFeedId}
          />
        </div>
        <Button
          btnText={tableDataLoading ? "searching" : "search"}
          isLoading={tableDataLoading}
          onClick={fetchTableData}
        />
      </Box>
      <Divider sx={{ mt: 1 }} />
      <Box sx={{ height: 500, width: "100%", mt: 1 }}>
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
          loading={tableDataLoading && <CircularProgress />}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
      <EditDialog
        open={open}
        setOpen={setOpen}
        rowData={tableData}
        rowNumber={articleNumber}
        setRowNumber={setArticleNumber}
      />
    </Box>
  );
};

export default Online;
