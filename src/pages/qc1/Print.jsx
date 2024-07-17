// * print component is inside the qc1-components/components/online

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Box, Divider } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  useGridApiRef,
} from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";

// * icons
import { formattedDate, formattedNextDay } from "../../constants/dates";

// * components
import useFetchData from "../../hooks/useFetchData";
import EditDialog from "../../qc1-components/online/EditDialog";
import SearchFilters from "../../qc1-components/online/components/SearchFilters";

// * constants
import { url } from "../../constants/baseUrl";
import { qc1Array } from "../../constants/dataArray";
import { arrayToString } from "../../utils/arrayToString";
import { addPropertyIfConditionIsTrue } from "../../utils/addProprtyIfConditiontrue";

import { convertDateFormat } from "../../utils/convertDateFormat";
import AddCompaniesModal from "../../qc1-components/components/AddCompanyModal";
import GroupModal from "../../qc1-components/online/components/GroupModal";
import MainTable from "../../qc1-components/online/MainTable";
import DeleteConfirmationDialog from "../../@core/DeleteDialog";
import GroupUnGroupAccordion from "../../qc1-components/online/GroupUngroup";
import { extractDate } from "../../utils/extractDate";

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
  const [uploadFromDate, setUploadFromDate] = useState(null);
  const [uploadToDate, setUploadToDate] = useState(null);
  const [publicationGroup, setPublicationGroup] = useState("");
  const [publication, setPublication] = useState("");
  const [pubType, setPubType] = useState("");
  const [selectedCity, setSelectedCity] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [qc1Done, setQc1Done] = useState("0");
  const [qc1By, setQc1By] = useState("");
  const [photo, setPhoto] = useState("");
  const [graph, setGraph] = useState("");
  const [stitched, setStitched] = useState("");
  const [tv, setTv] = useState("");
  const [articleId, setArticleId] = useState("");
  const [systemArticleId, setSystemArticleId] = useState("");
  const [pageNumber, setPageNumber] = useState("");
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
          from_date: extractDate(fromDate),
          to_date: extractDate(toDate),
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
  function mapBinaryToYesNoAll(value) {
    switch (value) {
      case 1:
        return "Y";
      case "0":
        return "N";
      case 2:
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
        from_date: convertDateFormat(fromDate),
        to_date: convertDateFormat(toDate),
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
        articleId !== "",
        "article_id",
        articleId,
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        systemArticleId !== "",
        "system_article_id",
        systemArticleId,
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
        mapBinaryToYesNoAll(qc1Done),
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
        uploadFromDate !== null,
        "upload_from_date",
        convertDateFormat(uploadFromDate),
        params
      );
      addPropertyIfConditionIsTrue(
        params,
        uploadToDate !== null,
        "upload_to_date",
        convertDateFormat(uploadToDate),
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
        pageNumber !== "",
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
      unsavedChangesRef.current.unsavedRows = {};
      unsavedChangesRef.current.rowsBeforeChange = {};
    }
  }, [
    selectedClient,
    fromDate,
    toDate,
    withCategory,
    setGridDataLoading,
    articleId,
    systemArticleId,
    uploadFromDate,
    uploadToDate,
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
  const [openGroupModal, setGroupModal] = useState(false);
  const handleGroupModalOpen = () => {
    setGroupModal(true);
  };
  const [groupLoading, setGroupLoading] = useState(false);
  const [selectionModalForGroup, setSelectionModalForGroup] = useState([]);

  const handleClickGroupItems = async () => {
    if (selectedItems.length === 1) {
      toast.warning("Select more than one article.");
      return;
    }

    const bulkChildrenIds = selectedItems.map((item) => item.id);

    try {
      setGroupLoading(true);
      const request_data = {
        article_ids: bulkChildrenIds,
      };
      const response = await axios.post(
        `${url}groupsimilararticles/`,
        request_data,
        { headers }
      );
      if (response.data.status?.success?.length) {
        toast.success("Articles grouped successfully.");
        fetchListArticleByQC1Print();
        setGroupModal(false);
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
  const fetchSimilarArticles = async (articleId) => {
    const urlFetchSimilarArticles = `${url}similararticles/?article_id=${articleId}`;

    try {
      const response = await axios.get(urlFetchSimilarArticles, { headers });
      return response.data.child_articles;
    } catch (error) {
      console.error("Error fetching similar articles:", error);
      return [];
    }
  };

  const handleClickUnGroupItems = async () => {
    if (selectedItems.length !== 1)
      return toast.warning("Please select only one item.");
    const parentId = selectedItems[0].id;
    const similarArticles = await fetchSimilarArticles(parentId);
    if (!similarArticles.length)
      return toast.warning("No similar articles found.");
    const childrenIds = similarArticles.map((item) => item.article);

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
        fetchListArticleByQC1Print();

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
  const [saveLoading, setSaveLoading] = useState(false);

  // * custom toolbar
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <GridToolbarFilterButton />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  //* inline editing
  const apiRef = useGridApiRef();

  const [hasUnsavedRows, setHasUnsavedRows] = useState(false);
  const unsavedChangesRef = useRef({
    unsavedRows: {},
    rowsBeforeChange: {},
  });

  const processRowUpdate = useCallback((newRow, oldRow) => {
    const rowId = newRow.main_id;

    // Update unsaved rows
    unsavedChangesRef.current.unsavedRows[rowId] = newRow;

    // Store initial state before any changes are made
    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }

    setHasUnsavedRows(true);

    return newRow;
  }, []);

  const handleSaveManualEditedCells = async () => {
    const changedRows = unsavedChangesRef.current.unsavedRows;
    const rowsBeforeChange = unsavedChangesRef.current.rowsBeforeChange;

    if (Object.keys(changedRows).length === 0) {
      toast.warning("No changes found.");
      return;
    }

    try {
      setSaveLoading(true);

      const requestData = Object.keys(changedRows).map((rowId) => {
        const newRow = changedRows[rowId];
        const oldRow = rowsBeforeChange[rowId];
        const request_data = {
          ARTICLEID: newRow.main_id,
        };

        if (oldRow.headline !== newRow.headline) {
          request_data.HEADLINES = newRow.headline;
        }
        if (oldRow.head_summary !== newRow.head_summary) {
          request_data.HEADSUMMARY = newRow.head_summary;
        }
        if (oldRow.journalist !== newRow.journalist) {
          request_data.JOURNALIST = newRow.journalist;
        }

        return request_data;
      });

      const response = await axios.post(
        `${url}updateqc1printheader/`,
        requestData,
        {
          headers,
        }
      );

      if (response.data.result?.success?.length) {
        toast.success("Data updated.");
        unsavedChangesRef.current.unsavedRows = {};
        unsavedChangesRef.current.rowsBeforeChange = {};
        setHasUnsavedRows(false);
        fetchListArticleByQC1Print();
      } else {
        toast.warning("Something went wrong, please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setSaveLoading(false);
    }
  };
  // * highlight edit rows
  const getRowClassName = (params) => {
    return unsavedChangesRef.current.unsavedRows[params.row.main_id]
      ? "highlight-row"
      : "";
  };

  // * add companies
  const [openAddCompanies, setOpenAddCompanies] = useState(false);

  // * buttons permission
  const [buttonsPermission, setButtonsPermission] = useState(null);
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const response = await axios.get(
          `${url}buttonspermissions/?screen=online`,
          { headers }
        );
        setButtonsPermission(response.data.permission_data[0]);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchPermission();
  }, []);

  // * stitch modal
  const [stitchModalOpen, setStitchModalOpen] = useState(false);
  const [stitchLoading, setStitchLoading] = useState(false);
  const handleStitchItems = () => {};

  const isShowSecondAccordion =
    selectedItems.length > 0 ||
    Object.keys(unsavedChangesRef.current.unsavedRows).length > 0;

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
          <SearchFilters
            classes={classes}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            setSelectedCompanies={setSelectedCompanies}
            companyData={data?.data?.companies || []}
            selectedCompanies={selectedCompanies}
            withCategory={withCategory}
            setWithCategory={setWithCategory}
            category={category}
            setCategory={setCategory}
            fromDate={fromDate}
            setFromDate={setFromDate}
            toDate={toDate}
            setToDate={setToDate}
            uploadFromDate={uploadFromDate}
            setUploadFromDate={setUploadFromDate}
            uploadToDate={uploadToDate}
            setUploadToDate={setUploadToDate}
            publicationGroup={publicationGroup}
            setPublicationGroup={setPublicationGroup}
            publication={publication}
            setPublication={setPublication}
            pubType={pubType}
            setPubType={setPubType}
            qc1Done={qc1Done}
            setQc1Done={setQc1Done}
            qc1Array={qc1Array}
            qcUserData={userList}
            qc1By={qc1By}
            setQc1By={setQc1By}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            selectedLanguages={selectedLanguages}
            setSelectedLanguages={setSelectedLanguages}
            photo={photo}
            setPhoto={setPhoto}
            graph={graph}
            setGraph={setGraph}
            stitched={stitched}
            setStitched={setStitched}
            tv={tv}
            setTv={setTv}
            isNoCompany={isNoCompany}
            setIsNoCompany={setIsNoCompany}
            articleId={articleId}
            setArticleId={setArticleId}
            systemArticleId={systemArticleId}
            setSystemArticleId={setSystemArticleId}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            gridDataLoading={gridDataLoading}
            fetchListArticleByQC1Print={fetchListArticleByQC1Print}
          />
        </AccordionDetails>
      </Accordion>
      <GroupUnGroupAccordion
        isShowSecondAccordion={isShowSecondAccordion}
        buttonsPermission={buttonsPermission}
        groupLoading={groupLoading}
        handleGroupModalOpen={handleGroupModalOpen}
        unGroupLoading={unGroupLoading}
        handleClickUnGroupItems={handleClickUnGroupItems}
        setOpenAddCompanies={setOpenAddCompanies}
        saveLoading={saveLoading}
        handleSaveManualEditedCells={handleSaveManualEditedCells}
        stitchLoading={stitchLoading}
        setStitchModalOpen={setStitchModalOpen}
        handleClickGroupItems={handleClickGroupItems}
      />

      <Divider sx={{ mt: 1 }} />
      {/* Main table */}
      <MainTable
        gridData={gridData}
        apiRef={apiRef}
        selectionModal={selectionModal}
        setSelectionModal={setSelectionModal}
        handleSelectionChange={handleSelectionChange}
        handleRowClick={handleRowClick}
        handleSimilarClick={handleSimilarClick}
        handleClickAway={handleClickAway}
        anchorEls={anchorEls}
        similarLoading={similarLoading}
        childArticles={childArticles}
        processRowUpdate={processRowUpdate}
        gridDataLoading={gridDataLoading}
        CustomToolbar={CustomToolbar}
        getRowClassName={getRowClassName}
      />

      <EditDialog
        open={open}
        setOpen={setOpen}
        row={selectedRow}
        rowNumber={articleNumber}
      />
      <GroupModal
        openGroupModal={stitchModalOpen}
        setOpenGroupModal={setStitchModalOpen}
        selectedItems={selectedItems}
        screen="print"
        selectionModelForGroup={selectionModalForGroup}
        setSelectionModelForGroup={setSelectionModalForGroup}
        handleSave={handleStitchItems}
        groupLoading={stitchLoading}
      />
      <GroupModal
        openGroupModal={openGroupModal}
        setOpenGroupModal={setGroupModal}
        selectedItems={selectedItems}
        screen="print"
        selectionModelForGroup={selectionModalForGroup}
        setSelectionModelForGroup={setSelectionModalForGroup}
        handleSave={handleClickGroupItems}
        groupLoading={groupLoading}
      />
      <AddCompaniesModal
        open={openAddCompanies}
        setOpen={setOpenAddCompanies}
        selectedRows={selectedItems}
      />
      <DeleteConfirmationDialog
        open={openDelete}
        handleClose={handleCloseDelete}
        password={password}
        setPassword={setPassword}
        verificationLoading={verificationLoading}
        handleClickRemove={handleClickRemoveCompanies}
      />
    </Box>
  );
};

export default Print;
