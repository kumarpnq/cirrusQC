import { useState } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";

// * icons
import { EditAttributesOutlined } from "@mui/icons-material";
import { formattedDate, formattedNextDay } from "../../constants/dates";

// * components
import Client from "../../print-components/dropdowns/Client";
import Category from "../../print-components/dropdowns/Category";
import useFetchData from "../../hooks/useFetchData";
import Company from "../../print-components/dropdowns/Company";
import CustomDebounceDropdown from "../../@core/CustomDebounceDropdown";
import Publication from "../../print-components/dropdowns/Publication";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import PubType from "../../print-components/dropdowns/PubType";
import Qc1All from "../../components/research-dropdowns/Qc1All";
import YesOrNo from "../../@core/YesOrNo";
import Cities from "../../print-components/dropdowns/Cities";
import Languages from "../../components/research-dropdowns/Languages";
import Qc1By from "../../components/research-dropdowns/Qc1By";
import CustomTextField from "../../@core/CutsomTextField";
import Button from "../../components/custom/Button";
import EditDialog from "../../qc1-components/online/EditDialog";

// * constants
import { url } from "../../constants/baseUrl";
import { qc1Array } from "../../constants/dataArray";

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

const dummyData = [
  {
    id: 1,
    headline: "Canada Parl honours Nijjar; India plans Kanishka tribute...",
    articleId: "01DELHI-20240620-TIMES_OF_INDIA-0001-0002.pdf",
    articleDate: "20/06/2024",
    publicationName: "Times Of India - Delhi",
    pages: 1,
    pdfSize: "201 KB",
    journalist: "Dadaji",
    uploadTime: "06:28:11 AM",
    tagTime: "Tagging Detail",
  },
  {
    id: 2,
    headline: "12th pass mantri unable to write Beti Bachao...",
    articleId: "01DELHI-20240620-TIMES_OF_INDIA-0001-0003.pdf",
    articleDate: "20/06/2024",
    publicationName: "Times Of India - Delhi",
    pages: 1,
    pdfSize: "92 KB",
    journalist: "Dadaji",
    uploadTime: "06:27:07 AM",
    tagTime: "Tagging Detail",
  },
  {
    id: 3,
    headline: "IIT-B students fined for Ramayana skit...",
    articleId: "01DELHI-20240620-TIMES_OF_INDIA-0001-0004.pdf",
    articleDate: "20/06/2024",
    publicationName: "Times Of India - Delhi",
    pages: 1,
    pdfSize: "44 KB",
    journalist: "Dadaji",
    uploadTime: "06:27:07 AM",
    tagTime: "Tagging Detail",
  },
  {
    id: 4,
    headline: "Man lynched over theft suspicion in UP...",
    articleId: "01DELHI-20240620-TIMES_OF_INDIA-0001-0005.pdf",
    articleDate: "20/06/2024",
    publicationName: "Times Of India - Delhi",
    pages: 1,
    pdfSize: "43 KB",
    journalist: "Dadaji",
    uploadTime: "06:28:11 AM",
    tagTime: "Tagging Detail",
  },
];

const Print = () => {
  // * state variables for data retrieve
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [withCategory, setWithCategory] = useState(0);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [uploadDate, setUploadDate] = useState(formattedDate);
  const [publicationGroup, setPublicationGroup] = useState("");
  const [publication, setPublication] = useState("");
  const [pubType, setPubType] = useState("");
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [qc1Done, setQc1Done] = useState("2");
  const [qc1By, setQc1By] = useState("");
  const [photo, setPhoto] = useState("");
  const [graph, setGraph] = useState("");
  const [articleType, setArticleType] = useState("");
  const [stitched, setStitched] = useState("");
  const [tv, setTv] = useState("");
  const [articleId, setArticleId] = useState(0);
  const [systemArticleId, setSystemArticleId] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  //   * data hooks
  const { data } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : "",
    selectedClient
  );
  const { data: qcUserData } = useFetchData(`${url}qcuserlist/`, {});

  // * mui classes
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
      field: "edit",
      headerName: "Edit",
      width: 70,
      renderCell: (params) => (
        <IconButton onClick={() => handleRowClick(params.row, params.id)}>
          <EditAttributesOutlined className="text-primary" />
        </IconButton>
      ),
    },
    { field: "headline", headerName: "Headlines", width: 300 },
    { field: "articleId", headerName: "Article ID", width: 300 },
    { field: "articleDate", headerName: "Article Date", width: 150 },
    { field: "publicationName", headerName: "Publication Name", width: 200 },
    { field: "pages", headerName: "Pages", width: 80 },
    { field: "pdfSize", headerName: "PDF Size", width: 100 },
    { field: "journalist", headerName: "Journalist", width: 150 },
    { field: "uploadTime", headerName: "Upload Time", width: 150 },
    {
      field: "tagTime",
      headerName: "Tag Time",
      width: 150,
      renderCell: (params) => <a href="#">{params.value}</a>,
    },
  ];
  return (
    <Box sx={{ px: 1.5 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        className="gap-1"
      >
        <div className="pt-[3px]">
          <Client
            label="Client"
            client={selectedClient}
            setClient={setSelectedClient}
            width={200}
            setCompanies={setSelectedCompanies}
          />
        </div>
        <Company
          companyData={data?.data?.companies || []}
          companies={selectedCompanies}
          setCompanies={setSelectedCompanies}
          isMt={true}
        />
        <Category
          category={withCategory}
          setCategory={setWithCategory}
          classes={classes}
          width={150}
        />
        <FromDate fromDate={fromDate} setFromDate={setFromDate} />
        <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
        {/* upload date */}
        <FromDate fromDate={uploadDate} setFromDate={setUploadDate} />
        <CustomDebounceDropdown
          publicationGroup={publicationGroup}
          setPublicationGroup={setPublicationGroup}
          bg="secondory"
          m="mt-3"
        />
        <Publication
          publicationGroup={publicationGroup}
          publication={publication}
          setPublication={setPublication}
          classes={classes}
          width={150}
        />
        <PubType
          pubType={pubType}
          setPubType={setPubType}
          classes={classes}
          width={150}
        />
        <Qc1All
          qc1done={qc1Done}
          setQc1done={setQc1Done}
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
        <Cities
          classes={classes}
          city={selectedCity}
          setCity={setSelectedCity}
        />
        <Languages
          language={selectedLanguages}
          setLanguage={setSelectedLanguages}
          classes={classes}
        />
        <YesOrNo
          classes={classes}
          mapValue={["Yes", "No", "All"]}
          placeholder="Photo"
          value={photo}
          setValue={setPhoto}
          width={100}
        />
        <YesOrNo
          classes={classes}
          mapValue={["Yes", "No", "All"]}
          placeholder="Graph"
          value={graph}
          setValue={setGraph}
          width={100}
        />
        <YesOrNo
          classes={classes}
          mapValue={["Print", "Internet", "All"]}
          placeholder="ArticleType"
          value={articleType}
          setValue={setArticleType}
          width={100}
        />
        <YesOrNo
          classes={classes}
          mapValue={["Yes", "No", "All"]}
          placeholder="Stitch"
          value={stitched}
          setValue={setStitched}
          width={100}
        />
        <YesOrNo
          classes={classes}
          mapValue={["Yes", "No", "All"]}
          placeholder="TV"
          value={tv}
          setValue={setTv}
          width={100}
        />
        <div className="flex flex-wrap gap-1 pt-3">
          <CustomTextField
            placeholder={"ArticleId"}
            type={"number"}
            width={100}
            value={articleId}
            setValue={setArticleId}
          />
          <CustomTextField
            placeholder={"SystemArticleId"}
            type={"number"}
            width={100}
            value={systemArticleId}
            setValue={setSystemArticleId}
          />
          <CustomTextField
            placeholder={"PageNumber"}
            type={"number"}
            width={100}
            value={pageNumber}
            setValue={setPageNumber}
          />
        </div>

        <Button btnText="Search" onClick={() => {}} />
      </Box>
      <Divider sx={{ mt: 1 }} />
      <Box sx={{ height: 400, width: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Articles
        </Typography>
        <DataGrid
          rows={dummyData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          density="compact"
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

export default Print;
