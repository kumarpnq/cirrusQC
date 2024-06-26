import { useCallback, useState } from "react";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
import axios from "axios";
import { arrayToString } from "../../utils/arrayToString";
import { addPropertyIfConditionIsTrue } from "../../utils/addProprtyIfConditiontrue";
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
  componentHeight: {
    height: 25,
    display: "flex",
    alignItems: "center",
  },
}));

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
  const [qc1Done, setQc1Done] = useState("");
  const [qc1By, setQc1By] = useState("");
  const [photo, setPhoto] = useState("");
  const [graph, setGraph] = useState("");
  const [articleType, setArticleType] = useState("");
  const [stitched, setStitched] = useState("");
  const [tv, setTv] = useState("");
  const [articleId, setArticleId] = useState(null);
  const [systemArticleId, setSystemArticleId] = useState(null);
  const [pageNumber, setPageNumber] = useState(null);
  const [isNoCompany, setIsNoCompany] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Table data
  const [gridData, setGridData] = useState([]);
  const [gridDataLoading, setGridDataLoading] = useState(false);

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
    { field: "head_summary", headerName: "Summary", width: 300 },
    { field: "article_id", headerName: "Article ID", width: 300 },
    { field: "article_date", headerName: "Article Date", width: 150 },
    { field: "publication_name", headerName: "Publication Name", width: 200 },
    { field: "page_number", headerName: "Pages", width: 80 },
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

  const rows = gridData.map((item, index) => ({
    id: index,
    main_id: item.id,
    headline: item.headline,
    head_summary: item.head_summary,
    article_id: item.article_id,
    article_date: item.article_date,
    publication_name: item.publication_name,
    page_number: item.page_number,
    pdfSize: item.pdfSize,
    journalist: item.journalist,
    uploadTime: item.upload_time,
    defaultLink: item.default_link,
  }));

  const fetchListArticleByQC1Print = useCallback(async () => {
    try {
      setGridDataLoading(true);
      const params = {
        // comp params
        client_id: selectedClient,
        from_date: fromDate,
        to_date: toDate,
        date_type: "ARTICLE",

        // optional params
        // company_id:'',
        // article_id:articleId,
        // qc1_by:qc1By,
        // is_qc1:qc1Done,
        // city:'',
        // search_keyword:'',
        // pagenumber:pageNumber,
        // photo:photo,
        // graph:graph,
        // language:'',
        // category:'',
        // pubgroup_id:'',
        // publication_id:''
        // pubtype:'',
        // no_company:'',
        // count:''
      };
      // eslint-disable-next-line no-inner-declarations

      // Add optional params using the helper function
      addPropertyIfConditionIsTrue(
        params,
        selectedCompanies.length > 0,
        "company_id",
        arrayToString(selectedCompanies),
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        articleId !== null,
        "article_id",
        articleId,
        params
      );
      addPropertyIfConditionIsTrue(params, qc1By, "qc1_by", qc1By, params);
      addPropertyIfConditionIsTrue(params, qc1Done, "is_qc1", qc1Done, params);
      addPropertyIfConditionIsTrue(
        params,
        selectedCity.length > 0,
        "city",
        arrayToString(selectedCity),
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        selectedLanguages.length > 0,
        "language",
        arrayToString(selectedLanguages),
        params
      );
      addPropertyIfConditionIsTrue(params, photo, "photo", photo, params);
      addPropertyIfConditionIsTrue(params, graph, "graph", graph, params);
      addPropertyIfConditionIsTrue(
        params,
        articleType,
        "article_type",
        articleType,
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        stitched,
        "stitched",
        stitched,
        params
      );
      addPropertyIfConditionIsTrue(params, tv, "tv", tv, params);
      addPropertyIfConditionIsTrue(
        params,
        publicationGroup,
        "pubgroup_id",
        publicationGroup,
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        publication,
        "publication_id",
        publication,
        params
      );
      addPropertyIfConditionIsTrue(params, pubType, "pubtype", pubType, params);
      addPropertyIfConditionIsTrue(
        params,
        pageNumber !== null,
        "pagenumber",
        pageNumber,
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        isNoCompany !== false,
        "no_company",
        isNoCompany,
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        searchKeyword !== "",
        "search_keyword",
        searchKeyword,
        params
      );
      const userToken = localStorage.getItem("user");
      const response = await axios.get(`${url}listArticlebyQC1Print/`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params,
      });
      if (response.data.feed_data.length) {
        setGridData(response.data.feed_data || []);
      } else {
        toast.warning("No data found");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setGridDataLoading(false);
    }
  }, [
    selectedClient,
    fromDate,
    toDate,
    // withCategory,
    setGridDataLoading,
    articleId,
    articleType,
    graph,
    pageNumber,
    photo,
    pubType,
    publication,
    publicationGroup,
    qc1By,
    qc1Done,
    selectedCity,
    selectedCompanies,
    selectedLanguages,
    stitched,
    tv,
    isNoCompany,
    searchKeyword,
  ]);

  return (
    <Box sx={{ px: 1.5 }}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          Search Filters
        </AccordionSummary>
        <AccordionDetails>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <Typography
              component={"div"}
              className={classes.componentHeight}
              sx={{ pt: 1 }}
            >
              <Client
                label="Client"
                client={selectedClient}
                setClient={setSelectedClient}
                width={200}
                setCompanies={setSelectedCompanies}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <Company
                companyData={data?.data?.companies || []}
                companies={selectedCompanies}
                setCompanies={setSelectedCompanies}
                isMt={true}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <Category
                category={withCategory}
                setCategory={setWithCategory}
                classes={classes}
                width={150}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <FromDate fromDate={fromDate} setFromDate={setFromDate} />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <FromDate fromDate={uploadDate} setFromDate={setUploadDate} />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <CustomDebounceDropdown
                publicationGroup={publicationGroup}
                setPublicationGroup={setPublicationGroup}
                bg="secondory"
                m="mt-3"
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <Publication
                publicationGroup={publicationGroup}
                publication={publication}
                setPublication={setPublication}
                classes={classes}
                width={150}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <PubType
                pubType={pubType}
                setPubType={setPubType}
                classes={classes}
                width={150}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <Qc1All
                qc1done={qc1Done}
                setQc1done={setQc1Done}
                classes={classes}
                qc1Array={qc1Array}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <Qc1By
                qcUsersData={qcUserData?.data?.qc_users || []}
                qc1by={qc1By}
                setQc1by={setQc1By}
                classes={classes}
                pageType={"print"}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <Cities
                classes={classes}
                city={selectedCity}
                setCity={setSelectedCity}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <Languages
                language={selectedLanguages}
                setLanguage={setSelectedLanguages}
                classes={classes}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <YesOrNo
                classes={classes}
                mapValue={["Yes", "No", "All"]}
                placeholder="Photo"
                value={photo}
                setValue={setPhoto}
                width={100}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <YesOrNo
                classes={classes}
                mapValue={["Yes", "No", "All"]}
                placeholder="Graph"
                value={graph}
                setValue={setGraph}
                width={100}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <YesOrNo
                classes={classes}
                mapValue={["Print", "Internet", "All"]}
                placeholder="ArticleType"
                value={articleType}
                setValue={setArticleType}
                width={100}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <YesOrNo
                classes={classes}
                mapValue={["Yes", "No", "All"]}
                placeholder="Stitch"
                value={stitched}
                setValue={setStitched}
                width={100}
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <YesOrNo
                classes={classes}
                mapValue={["Yes", "No", "All"]}
                placeholder="TV"
                value={tv}
                setValue={setTv}
                width={100}
              />
            </Typography>
            <Typography
              component={"div"}
              className={classes.componentHeight}
              sx={{ pt: 1 }}
            >
              <FormGroup>
                <FormControlLabel
                  label={
                    <Typography variant="h6" fontSize={"0.9em"}>
                      No company
                    </Typography>
                  }
                  control={
                    <Checkbox
                      size="small"
                      checked={isNoCompany}
                      onChange={() => setIsNoCompany((prev) => !prev)}
                    />
                  }
                />
              </FormGroup>
            </Typography>

            <Typography
              component={"div"}
              className={classes.componentHeight}
              sx={{ gap: 1, pt: 1 }}
            >
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
              <CustomTextField
                placeholder={"Search Keyword"}
                type={"text"}
                width={200}
                value={searchKeyword}
                setValue={setSearchKeyword}
              />
            </Typography>

            <Typography component={"div"} className={classes.componentHeight}>
              <Button
                btnText={gridDataLoading ? "Searching" : "Search"}
                onClick={fetchListArticleByQC1Print}
                isLoading={gridDataLoading}
              />
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ mt: 1 }} />
      <Box sx={{ height: 550, width: "100%", mt: 1 }}>
        <DataGrid
          rows={rows}
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
