import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  CircularProgress,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Popper from "@mui/material/Popper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachmentIcon from "@mui/icons-material/Attachment";
import {
  DataGrid,
  GridToolbar,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";

// * icons
import {
  AttachFileOutlined,
  CloseOutlined,
  ControlCameraOutlined,
  EditAttributesOutlined,
} from "@mui/icons-material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import HtmlIcon from "@mui/icons-material/Html";
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
import { Link } from "react-router-dom";
import SearchFilters from "../../qc1-components/online/components/SearchFilters";
import CustomButton from "../../@core/CustomButton";
import SearchableCategory from "../../components/research-dropdowns/table-dropdowns/SearchableCategory";

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

const iconCellStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
};

const Print = () => {
  // * token and headers
  const userToken = localStorage.getItem("user");
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };
  // * state variables for data retrieve
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [withCategory, setWithCategory] = useState("");
  const [category, setCategory] = useState("");
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [uploadDate, setUploadDate] = useState(null);
  const [publicationGroup, setPublicationGroup] = useState("");
  const [publication, setPublication] = useState("");
  const [pubType, setPubType] = useState("");
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [qc1Done, setQc1Done] = useState("");
  const [qc1By, setQc1By] = useState("");
  const [photo, setPhoto] = useState("");
  const [graph, setGraph] = useState("");
  // const [articleType, setArticleType] = useState("");
  const [stitched, setStitched] = useState("");
  const [tv, setTv] = useState("");
  const [articleId, setArticleId] = useState(null);
  const [systemArticleId, setSystemArticleId] = useState(null);
  const [pageNumber, setPageNumber] = useState(null);
  const [isNoCompany, setIsNoCompany] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  //* Table data
  const [gridData, setGridData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [gridDataLoading, setGridDataLoading] = useState(false);

  //   * data hooks
  const { data } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : "",
    selectedClient
  );

  // * fetching user list
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const params = {
          from_date: fromDate.split(" ")[0],
          to_date: toDate.split(" ")[0],
        };
        const response = await axios.get(`${url}qc1userlistprint/`, {
          headers,
          params,
        });
        setUserList(response.data.qc_users);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUserList();
  }, [fromDate, toDate]);

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

  // * similar articles popper
  const [anchorEls, setAnchorEls] = useState({});
  const [similarLoading, setSimilarLoading] = useState(false);
  const [childArticles, setChildArticles] = useState([]);
  const handleSimilarClick = async (event, params) => {
    const articleId = params.row.main_id;
    const index = params.id;
    setAnchorEls((prev) => ({
      ...prev,
      [index]: prev[index] ? null : event.currentTarget,
    }));
    setSimilarLoading(false);
    try {
      setSimilarLoading(true);
      const response = await axios.get(
        `${url}similararticles/?article_id=${articleId}`,
        { headers }
      );
      setChildArticles(response.data.child_articles);
    } catch (error) {
      console.log(error.message);
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleClickAway = (index) => {
    setAnchorEls((prev) => ({
      ...prev,
      [index]: null,
    }));
    setSimilarLoading(false);
  };

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: 160,
      renderCell: (params) => (
        <div style={iconCellStyle}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <Grid container spacing={1} justifyContent="center">
              {/* Top Row */}
              <Grid item>
                <Tooltip title="View PDF">
                  <IconButton>
                    <Link
                      to={`/articleview/download-file/${params.row.link}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <PictureAsPdfIcon className="text-primary" />
                    </Link>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="View JPG">
                  <IconButton>
                    <Link
                      to={`/articleview/download-file/${params.row.link}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ImageIcon className="text-primary" />
                    </Link>
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid container spacing={1} justifyContent="center">
              {/* Bottom Row */}
              <Grid item>
                <Tooltip title="View HTML">
                  <IconButton>
                    <Link
                      to={`/articleview/download-file/${params.row.link}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <HtmlIcon className="text-primary" />
                    </Link>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Edit article">
                  <IconButton
                    onClick={() => handleRowClick(params.row, params.id)}
                  >
                    <EditAttributesOutlined className="text-primary" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
          {params.row.similar_articles === "Yes" && (
            <>
              <Tooltip title="View similar articles">
                <IconButton
                  onClick={(event) => handleSimilarClick(event, params)}
                  aria-describedby={params.id}
                >
                  <AttachmentIcon className="text-primary" />
                </IconButton>
              </Tooltip>
              <ClickAwayListener onClickAway={() => handleClickAway(params.id)}>
                <Popper
                  id={params.id}
                  open={Boolean(anchorEls[params.id])}
                  anchorEl={anchorEls[params.id]}
                  popperOptions={{
                    placement: "right-end",
                    strategy: "absolute",
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: "background.paper",
                      // height: 400,
                      maxWidth: 500,
                      maxHeight: 400,
                      overflow: "scroll",
                    }}
                  >
                    <TableContainer component={Paper}>
                      <Table
                        sx={{
                          color: "white",
                        }}
                        className="bg-[#5AACCA]"
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: "#ffff" }}>
                              Publication
                            </TableCell>
                            <TableCell sx={{ color: "#ffff" }}>
                              Headline
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {similarLoading ? (
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <CircularProgress />
                            </Box>
                          ) : (
                            <>
                              {" "}
                              {childArticles.length ? (
                                childArticles.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell sx={{ color: "#ffff" }}>
                                      {row.publication_name}
                                    </TableCell>
                                    <TableCell sx={{ color: "#ffff" }}>
                                      {row.headline}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableCell sx={{ color: "#ffff" }}>
                                  No Data found
                                </TableCell>
                              )}
                            </>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Popper>
              </ClickAwayListener>
            </>
          )}
        </div>
      ),
    },

    {
      field: "Thumbnail",
      headerName: "Thumbnail",
      width: 70,
      renderCell: (params) => (
        <div style={iconCellStyle}>
          <Tooltip
            title={
              <img
                src={
                  "https://cirrus.co.in/cirrus/JPGViewID.action?ai=03GURGAON-20240705-TIMES_OF_INDIA-0010-0002.pdf&loginreq=N"
                }
              />
            }
            placement="right"
            arrow
          >
            <img
              src={`https://cirrus.co.in/cirrus/JPGViewID.action?ai=03GURGAON-20240705-TIMES_OF_INDIA-0010-0002.pdf&loginreq=N`}
              style={{ width: "70", height: "80" }}
              title="PDF"
              className="p-1 border rounded-lg"
            />
          </Tooltip>
        </div>
      ),
    },
    { field: "headline", headerName: "Headlines", width: 300, editable: true },
    {
      field: "head_summary",
      headerName: "Summary",
      width: 450,
      editable: true,
    },
    { field: "article_id", headerName: "Article ID", width: 160 },
    { field: "article_date", headerName: "Article Date", width: 150 },
    { field: "publication_name", headerName: "Publication Name", width: 200 },
    { field: "page_number", headerName: "Pages", width: 80 },
    { field: "pdfSize", headerName: "PDF Size", width: 100 },
    {
      field: "journalist",
      headerName: "Journalist",
      width: 150,
      editable: true,
    },
    { field: "uploadTime", headerName: "Upload Time", width: 150 },
    { field: "main_id", headerName: "System Id", width: 150 },
    {
      field: "tagTime",
      headerName: "Tag Time",
      width: 150,
      renderCell: (params) => <a href="#">{params.value}</a>,
    },
  ];

  const rows = gridData?.map((item, index) => ({
    id: index,
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
    main_id: item.id,
    similar_articles: item.similar_articles,
    link: item.link,
  }));

  function mapYesNoAllToBinary(value) {
    switch (value) {
      case "Yes":
        return "Y";
      case "No":
        return "N";
      case "All":
        return "ALL";
      default:
        return value;
    }
  }

  const fetchListArticleByQC1Print = useCallback(async () => {
    const with_category = withCategory === 0 ? "N" : "Y";
    try {
      setGridDataLoading(true);
      const params = {
        // comp params
        client_id: selectedClient,
        from_date: fromDate,
        to_date: toDate,
        // with_category: withCategory,
        // date_type: "ARTICLE",
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
      addPropertyIfConditionIsTrue(
        params,
        withCategory !== "",
        "with_category",
        with_category,
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        category !== "",
        "category",
        category,
        params
      );
      addPropertyIfConditionIsTrue(params, qc1By, "qc1_by", qc1By, params);
      addPropertyIfConditionIsTrue(
        params,
        qc1Done,
        "is_qc1",
        mapYesNoAllToBinary(qc1Done),
        params
      );
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
      addPropertyIfConditionIsTrue(
        params,
        uploadDate !== null,
        "upload_date",
        uploadDate,
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        photo,
        "photo",
        mapYesNoAllToBinary(photo),
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        graph,
        "graph",
        mapYesNoAllToBinary(graph),
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        tv,
        "tv",
        mapYesNoAllToBinary(tv),
        params
      );

      addPropertyIfConditionIsTrue(
        params,
        stitched,
        "stitched",
        mapYesNoAllToBinary(stitched),
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

      if (response.data?.feed_data.length) {
        setGridData(response.data.feed_data || []);
      } else {
        setGridData([]);
        toast.warning("No data found");
      }
    } catch (error) {
      toast.error("Error while fetching.");
    } finally {
      setGridDataLoading(false);
    }
  }, [
    selectedClient,
    fromDate,
    toDate,
    withCategory,
    setGridDataLoading,
    articleId,
    // articleType,
    uploadDate,
    category,
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

  useEffect(() => {
    fetchListArticleByQC1Print();
  }, []);

  // * group & un-group articles
  const [selectionModal, setSelectionModal] = useState([]);
  const handleSelectionChange = (ids) => {
    const selectedItem = ids.map((index) => gridData[index]);
    setSelectedItems(selectedItem);
    setSelectionModal(ids);
  };

  // * group selected articles
  const [groupLoading, setGroupLoading] = useState(false);
  const handleClickGroupItems = async () => {
    if (selectedItems.length === 1) {
      toast.warning("Select more than one article.");
      return;
    }
    const parentId = selectedItems[0].id;
    const childrenIds = selectedItems.slice(1).map((item) => item.id);

    try {
      setGroupLoading(true);
      const request_data = {
        parent_id: parentId,
        child_id: arrayToString(childrenIds),
      };
      const response = await axios.post(
        `${url}groupsimilararticles/`,
        request_data,
        { headers }
      );
      if (response.data.status?.success?.length) {
        toast.success("Articles grouped successfully.");
        setSelectionModal([]);
        setSelectedItems([]);
      } else {
        toast.warning("Something went wrong.");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setGroupLoading(false);
    }
  };

  // * un-group selected items
  const [unGroupLoading, setUnGroupLoading] = useState(false);
  const handleClickUnGroupItems = async () => {
    if (selectedItems.length === 1) {
      toast.warning("Select more than one article.");
      return;
    }
    const parentId = selectedItems[0].id;
    const childrenIds = selectedItems.slice(1).map((item) => item.id);

    try {
      setUnGroupLoading(true);
      const request_data = {
        parent_id: parentId,
        child_id: arrayToString(childrenIds),
      };
      const response = await axios.post(
        `${url}ungroupsimilararticles/`,
        request_data,
        { headers }
      );
      if (response.data.status?.success?.length) {
        setSelectionModal([]);
        setSelectedItems([]);
        toast.success("Articles ungrouped successfully.");
      } else {
        toast.warning("Ids not found.");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setUnGroupLoading(false);
    }
  };

  // * remove companies from selected items
  const [openDelete, setOpenDelete] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const userVerification = async () => {
    try {
      setVerificationLoading(true);
      const headers = { Authorization: `Bearer ${userToken}` };
      const data = { password };
      const response = await axios.post(`${url}isValidUser/`, data, {
        headers,
      });
      setVerificationLoading(false);
      return response.data.valid_user;
    } catch (error) {
      toast.error(error.message);
      setVerificationLoading(false);
    }
  };
  const handleClickOpen = () => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleClickRemoveCompanies = async () => {
    const isValid = await userVerification();
    if (!isValid) {
      return toast.warning("User not valid.");
    }
    const articleIds = selectedItems.map((i) => i.id);

    try {
      setRemoveLoading(true);
      const request_data = {
        client_id: selectedClient,
        article_ids: arrayToString(articleIds),
        company_ids: arrayToString(selectedCompanies),
      };
      if (selectedCompanies.length) {
        request_data.company_ids = arrayToString(selectedCompanies);
      }
      const response = await axios.delete(`${url}removecompanyprint/`, {
        headers,
        params: request_data,
      });
      if (response) {
        toast.success("Companies removed.");
        setSelectionModal([]);
        setSelectedItems([]);
        setOpenDelete(false);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setRemoveLoading(false);
    }
  };

  // * saving the edited cells
  const [oldRows, setOldRows] = useState(null);
  const [newRows, setNewRows] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const handleSaveManualEditedCells = async () => {
    if (!newRows) {
      toast.warning("No changes found.");
      return;
    }
    try {
      setSaveLoading(true);
      const request_data = {
        ARTICLEID: newRows?.main_id,
      };
      if (oldRows.headline !== newRows.headline) {
        request_data.HEADLINES = newRows.headline;
      }
      if (oldRows.head_summary !== newRows.head_summary) {
        request_data.HEADSUMMARY = newRows.head_summary;
      }
      if (oldRows.journalist !== newRows.journalist) {
        request_data.JOURNALIST = newRows.journalist;
      }
      const data = {
        data: [request_data],
        qcflag: 1,
      };
      const response = await axios.post(`${url}updatearticleheader/`, data, {
        headers,
      });
      if (response.data.result?.success?.length) {
        toast.success("Data updated.");
        setNewRows(null);
        setOldRows(null);
        fetchListArticleByQC1Print();
      } else {
        toast.warning("Something wrong try again.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setSaveLoading(false);
    }
  };

  // * highlight edit rows
  const getRowClassName = (params) => {
    return newRows?.main_id === params.row.main_id ? "highlight-row" : "";
  };
  const isShowSecondAccordion = selectedItems.length || Boolean(newRows);

  // * custom toolbar
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarQuickFilter />
        {/* Export button is not included */}
      </GridToolbarContainer>
    );
  }
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
            <Typography
              component={"div"}
              className={classes.componentHeight}
              sx={{ pt: 0.7 }}
            >
              <SearchableCategory
                label="Category"
                setCategory={setCategory}
                category={category}
                width={150}
                endpoint="categorylist"
              />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <FromDate fromDate={fromDate} setFromDate={setFromDate} />
            </Typography>
            <Typography component={"div"} className={classes.componentHeight}>
              <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
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
                qcUsersData={userList}
                qc1by={qc1By}
                setQc1by={setQc1By}
                classes={classes}
                pageType={"print"}
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
            {/* <Typography component={"div"} className={classes.componentHeight}>
              <YesOrNo
                classes={classes}
                mapValue={["Print", "Internet", "All"]}
                placeholder="ArticleType"
                value={articleType}
                setValue={setArticleType}
                width={100}
              />
            </Typography> */}
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
                // type={"number"}
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
          {/* <SearchFilters
            classes={classes}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            setSelectedCompanies={setSelectedCompanies}
            companyData={data?.data?.companies || []}
            selectedCompanies={selectedCompanies}
            withCategory={withCategory}
            setWithCategory={setWithCategory}
            fromDate={fromDate}
            toDate={toDate}
            setToDate={setToDate}
            uploadDate={uploadDate}
            setUploadDate={setUploadDate}
            publicationGroup={publicationGroup}
            setPublicationGroup={setPublicationGroup}
          /> */}
        </AccordionDetails>
      </Accordion>
      {!!isShowSecondAccordion && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            Group & Un-Group Articles
          </AccordionSummary>
          <AccordionDetails sx={{ display: "flex", gap: 1 }}>
            <Button
              btnText={groupLoading ? "Loading" : "group"}
              icon={<AttachFileOutlined />}
              onClick={handleClickGroupItems}
              isLoading={groupLoading}
            />
            <Button
              btnText={unGroupLoading ? "ungrouping" : "ungroup"}
              icon={<ControlCameraOutlined />}
              onClick={handleClickUnGroupItems}
              isLoading={unGroupLoading}
            />
            <Button
              btnText={removeLoading ? "Removing" : "Remove Companies"}
              icon={<CloseOutlined />}
              onClick={handleClickOpen}
              isLoading={removeLoading}
              isDanger
            />
            <Button
              btnText={saveLoading ? "Saving" : "Save"}
              // icon={<ControlCameraOutlined />}
              onClick={handleSaveManualEditedCells}
              isLoading={saveLoading}
            />
          </AccordionDetails>
        </Accordion>
      )}

      <Divider sx={{ mt: 1 }} />
      <Box sx={{ height: 600, width: "100%", mt: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          density="compact"
          getRowHeight={() => "auto"}
          checkboxSelection
          rowSelectionModel={selectionModal}
          onRowSelectionModelChange={(ids) => {
            setSelectionModal(ids);
            handleSelectionChange(ids);
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.9em",
            },
          }}
          processRowUpdate={(newRow, oldRow) => {
            if (newRows) {
              toast.warning("Please save the changes first.");
              return;
            }
            if (JSON.stringify(newRow) !== JSON.stringify(oldRow)) {
              setNewRows(newRow);
              setOldRows(oldRow);
            }
          }}
          loading={gridDataLoading && <CircularProgress />}
          disableDensitySelector
          disableColumnSelector
          disableRowSelectionOnClick
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowClassName={getRowClassName}
        />
      </Box>
      <EditDialog
        open={open}
        setOpen={setOpen}
        row={selectedRow}
        rowNumber={articleNumber}
      />
      <div>
        <Dialog open={openDelete} onClose={handleCloseDelete}>
          <DialogTitle fontSize={"1em"}>
            Enter Password For Confirmation.
          </DialogTitle>
          <DialogContent>
            <TextField
              type="password"
              sx={{ outline: "none" }}
              size="small"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <CustomButton
              btnText="Cancel"
              onClick={handleCloseDelete}
              bg={"bg-primary"}
            />
            {verificationLoading ? (
              <Box width={130} display={"flex"} justifyContent={"center"}>
                <CircularProgress size={20} />
              </Box>
            ) : (
              <CustomButton
                btnText="Delete"
                onClick={handleClickRemoveCompanies}
                bg={"bg-red-500"}
              />
            )}
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
};

export default Print;
