import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "../../@core/TextFieldWithLabel";

import { DataGrid } from "@mui/x-data-grid";
import DebounceSearchCompany from "../../@core/DebounceSearchCompany";
import { FaExternalLinkAlt } from "react-icons/fa";
import StitchModal from "./components/StitchModal";
import axios from "axios";
import { url } from "../../constants/baseUrl";
import { toast } from "react-toastify";
import Button from "../../components/custom/Button";
import ScrollNavigator from "./components/ScrollNavigator";
import { arrayToString } from "../../utils/arrayToString";
import { saveTableSettings } from "../../constants/saveTableSetting";
import useUserSettings from "../../hooks/useUserSettings";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "99vw",
  height: "99vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "scroll",
  p: 1,
};

const titleStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const EditDialog = ({
  open,
  setOpen,
  row,
  selectedItems,
  setSelectedItems,
  setSelectionModal,
  isMultiple,
}) => {
  // * user settings
  const userColumnSettings = useUserSettings("print", "EditMain");

  // * headers
  const userToken = localStorage.getItem("user");
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };

  // * multiple articles edit
  const [activeArticle, setActiveArticle] = useState(null);

  const articleId = isMultiple ? activeArticle?.id : row?.main_id;
  const defaultLink = isMultiple
    ? activeArticle?.default_link
    : row?.defaultLink;
  const link = isMultiple ? activeArticle?.link : row?.link;
  const [articleTagDetails, setArticleTagDetails] = useState([]);
  const [articleTagDetailsLoading, setArticleTagDetailsLoading] =
    useState(false);
  const [headerData, setHeaderData] = useState(null);
  const [formItems, setFormItems] = useState({
    headline: "",
    summary: "",
    journalist: "",
    page: "",
    articleSummary: "",
  });

  // * set first articles when user land first time
  useEffect(() => {
    if (isMultiple && open) {
      setActiveArticle(selectedItems[0]);
    }
  }, [isMultiple, open, setActiveArticle, selectedItems]);

  // * page for filter articles
  const [pageNumber, setPageNumber] = useState(null);

  const handleClose = () => {
    setFormItems({
      headline: "",
      summary: "",
      journalist: "",
      page: "",
      articleSummary: "",
    });
    setOpen(false);
    setPageNumber(null);
    setArticleTagDetails([]);
    setSelectedItems([]);
    setSelectionModal([]);
    setActiveArticle(null);
  };

  // * fetch data
  const fetchHeaderAndTagDetails = async () => {
    try {
      setArticleTagDetailsLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };

      const headerResponse = await axios.get(
        `${url}qc1printheader/?article_id=${articleId}`,
        { headers }
      );
      const headerData = headerResponse.data.article[0] || {};
      setHeaderData(headerData);
      setFormItems({
        headline: headerData.headline || "",
        summary: headerData.summary || "",
        journalist: headerData.journalist || "",
        page: headerData.page_number || "",
        articleSummary: headerData.article_summary || "",
      });
    } catch (error) {
      // toast.error("Error While fetching data.");
      console.log(error.message);
    } finally {
      setArticleTagDetailsLoading(false);
    }
  };

  const fetchTagDetails = async () => {
    try {
      setArticleTagDetailsLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      const tagDetailsResponse = await axios.get(
        `${url}qc1printtagdetails/?article_id=${articleId}`,
        { headers }
      );

      setArticleTagDetails(tagDetailsResponse.data.article_details || []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setArticleTagDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (open && articleId !== undefined) {
      fetchHeaderAndTagDetails();
      fetchTagDetails();
    }
  }, [articleId, open]);

  // * updating header data
  const [updateHeaderLoading, setUpdateHeaderLoading] = useState(false);
  const updateHeaderData = async (isPartial) => {
    try {
      setUpdateHeaderLoading(true);
      const data = {
        articleId,
      };
      // Compare each field in formItems with headerData and add to data if modified
      if (formItems.headline !== headerData.headline) {
        data.headlines = formItems.headline;
      }
      if (formItems.summary !== headerData.summary) {
        data.headSummary = formItems.summary;
      }
      if (formItems.journalist !== headerData.journalist) {
        data.journalist = formItems.journalist;
      }
      if (formItems.page !== headerData.page_number) {
        data.pageNumber = Number(formItems.page);
      }
      if (formItems.articleSummary !== headerData.article_summary) {
        data.articleSummary = formItems.articleSummary;
      }

      const request_data = {
        data: [data],
        qcType: "QC1",
      };

      if (!isPartial) {
        request_data.QCTYPE = "QC1";
      }
      const dataToSend = isPartial ? [data] : request_data;

      const endpoint = isPartial
        ? "updateqc1printheader/"
        : "updatearticleheader/";

      const response = await axios.post(`${url + endpoint}`, dataToSend, {
        headers,
      });
      if (response.data.result?.success?.length) {
        if (isMultiple) {
          const filteredItems = selectedItems.filter((i) => i.id !== articleId);
          setSelectedItems(filteredItems || []);
          setFormItems({
            headline: "",
            summary: "",
            journalist: "",
            page: "",
            articleSummary: "",
          });
          toast.success("Data updated.", {
            position: "bottom-right",
          });
          if (filteredItems.length > 0) {
            const currentIndex = selectedItems.findIndex(
              (i) => i.id === articleId
            );
            const nextArticle = filteredItems[currentIndex] || filteredItems[0];
            setActiveArticle(nextArticle);
          } else {
            setActiveArticle(null);
            setSelectionModal([]);
          }
        } else {
          toast.success("Data updated.", {
            position: "bottom-right",
          });
          setOpen(false);
        }
      }
    } catch (error) {
      toast.error("Something went wrong.", {
        position: "bottom-right",
      });
    } finally {
      setUpdateHeaderLoading(false);
    }
  };

  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormItems({
      ...formItems,
      [name]: value,
    });
  };

  // * add new company
  const [addCompanyLoading, setAddCompanyLoading] = useState(false);

  const handleAddCompany = async () => {
    if (!selectedCompanies.length) {
      toast.warning("No company selected.", {
        position: "bottom-right",
      });
      return;
    }
    const existingCompany = selectedCompanies.find((selectedCompany) =>
      articleTagDetails.some(
        (tagDetail) => tagDetail.company_id === selectedCompany.value
      )
    );

    if (existingCompany) {
      toast.warning(`Company "${existingCompany.label}" is already present.`, {
        position: "bottom-right",
      });
      return;
    }
    try {
      setAddCompanyLoading(true);
      const dataToSend = selectedCompanies.map((i) => ({
        updateType: "I",
        articleId,
        companyId: i.value,
        companyName: i.label,
      }));
      const request_data = {
        data: dataToSend,
        qcType: "QC1",
      };
      const response = await axios.post(
        `${url}updatearticletagdetails/`,
        request_data,
        { headers }
      );
      if (response.data.result?.success?.length) {
        setSelectedCompanies([]);
        fetchTagDetails();
        toast.success("Company added.", {
          position: "bottom-right",
        });
      } else {
        toast.warning("Something wrong try again.", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("Something went wrong.", {
        position: "bottom-right",
      });
    } finally {
      setAddCompanyLoading(false);
    }
  };

  // * remove company
  const handleRemoveCompany = async (selectedRow) => {
    try {
      const request_data = {
        data: [
          {
            updateType: "D",
            articleId,
            companyId: selectedRow?.companyId,
          },
        ],
        qcType: "QC1",
      };
      const response = await axios.post(
        `${url}updatearticletagdetails/`,
        request_data,
        { headers }
      );
      if (response.data.result.success.length) {
        toast.success("Company removed", {
          position: "bottom-right",
        });
        fetchTagDetails();
      } else {
        toast.warning("Something wrong try again.", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("Something went wrong.", {
        position: "bottom-right",
      });
    }
  };

  // * stitch modal
  const [modalOpen, setModalOpen] = useState(false);
  const [stitchUnStitch, setStitchUnStitch] = useState({
    stitch: false,
    unStitch: false,
  });
  const handleStitchOpen = () => {
    setStitchUnStitch({
      stitch: true,
      unStitch: false,
    });
    setModalOpen(true);
  };
  const handleUnStitchOpen = () => {
    setStitchUnStitch({
      stitch: false,
      unStitch: true,
    });
    setModalOpen(true);
  };

  // * skip the article if user don`t want
  const handleSkip = () => {
    const unSkippedArticles = selectedItems.filter(
      (i) => i.id !== activeArticle?.id
    );
    if (!unSkippedArticles.length) {
      setSelectedItems([]);
      setSelectionModal([]);
      setOpen(false);
    } else {
      setSelectedItems(unSkippedArticles);
    }
  };

  // * grid rows and columns
  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: userColumnSettings?.Action || 70,
      renderCell: (params) => (
        <IconButton
          sx={{ color: "red" }}
          onClick={() => handleRemoveCompany(params.row)}
        >
          <CloseIcon />
        </IconButton>
      ),
    },
    {
      field: "CompanyName",
      headerName: "Company",
      width: userColumnSettings?.CompanyName || 300,
    },
    {
      field: "keyword",
      headerName: "Keyword",
      width: userColumnSettings?.Keyword || 300,
    },
  ];

  const rows = articleTagDetails.map((item) => ({
    id: item.company_id,
    companyId: item.company_id,
    CompanyName: item.company_name,
    keyword: item.keyword,
  }));

  const [selectionModel, setSelectionModel] = useState([]);
  const [removeMultipleLoading, setRemoveMultipleLoading] = useState(false);

  // Handle row selection change
  const handleRowSelection = (newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };

  // handle delete multiple companies
  const removeSelectedCompanies = async () => {
    const userToken = localStorage.getItem("user");
    const url3 = `${url}removecompanyprint`;

    try {
      setRemoveMultipleLoading(true);
      const params = {
        article_ids: articleId,
        company_ids: arrayToString(selectionModel),
        qcType: "QC1",
      };
      const response = await axios.delete(url3, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params,
      });
      if (response.data.result.status) {
        toast.success("Companies removed successfully.");
        setSelectionModal([]);
        fetchTagDetails();
      }
    } catch (error) {
      toast.error("Error removing companies:", error.message);
    } finally {
      setRemoveMultipleLoading(false);
    }
  };
  // * save button text
  const buttonText = isMultiple ? "Save & Next" : "save";

  // * resize columns
  const handleColumnResize = (params) => {
    let field = params.colDef.field;
    let width = params.width;
    saveTableSettings("print", "EditMain", field, width);
  };

  const [summaryAuto, setSummaryAuto] = useState({
    isAutoHeight: false,
    isMultiline: false,
  });

  return (
    <Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-description"
      >
        <Box sx={style}>
          <Box sx={titleStyle}>
            <Typography
              id="edit-dialog-title"
              variant="h6"
              component="h6"
              fontSize={"1em"}
            >
              Edit Article
            </Typography>
            <Typography id="edit-dialog-description" component={"div"}>
              <IconButton onClick={handleClose}>
                <CloseOutlined />
              </IconButton>
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Box>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      id="headline"
                      name="headline"
                      label="Headline"
                      value={formItems.headline}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      id="summary"
                      name="summary"
                      label="Summary"
                      value={formItems.summary}
                      onChange={handleChange}
                      onFocus={() => {
                        setSummaryAuto({
                          isAutoHeight: true,
                          isMultiline: true,
                        });
                      }}
                      onBlur={() => {
                        setSummaryAuto({
                          isAutoHeight: false,
                          isMultiline: false,
                        });
                      }}
                      isAutoHeight={summaryAuto.isAutoHeight}
                      isMultiline={summaryAuto.isMultiline}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      id="journalist"
                      name="journalist"
                      label="Journalist"
                      value={formItems.journalist}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <CustomTextField
                      id="page"
                      name="page"
                      label="Page"
                      type="number"
                      value={formItems.page}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ width: "100%" }}>
                      <CustomTextField
                        id="articleSummary"
                        name="articleSummary"
                        label="Article Summary"
                        value={formItems.articleSummary}
                        onChange={handleChange}
                        onFocus={() => {
                          setSummaryAuto({
                            isAutoHeight: true,
                            isMultiline: true,
                          });
                        }}
                        onBlur={() => {
                          setSummaryAuto({
                            isAutoHeight: false,
                            isMultiline: false,
                          });
                        }}
                        isAutoHeight={summaryAuto.isAutoHeight}
                        isMultiline={summaryAuto.isMultiline}
                        fullWidth
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Box sx={{ mt: 0, height: 100 }}>
                  {isMultiple && (
                    <ScrollNavigator
                      selectedItems={selectedItems}
                      activeArticle={activeArticle}
                      setActiveArticle={setActiveArticle}
                      setSelectedItems={setSelectedItems}
                      setOpen={setOpen}
                      setSelectionModal={setSelectionModal}
                    />
                  )}
                </Box>
              </Box>

              <Box width={"100%"}>
                <>
                  <Card>
                    <CardContent>
                      <>
                        {isMultiple ? (
                          <>
                            <Typography
                              component={"div"}
                              display={"flex"}
                              gap={0.5}
                            >
                              {" "}
                              <Button
                                btnText={
                                  updateHeaderLoading
                                    ? "saving"
                                    : "Save partial"
                                }
                                onClick={() => updateHeaderData(true)}
                                isLoading={updateHeaderLoading}
                              />
                              <Button
                                btnText={
                                  updateHeaderLoading ? "saving" : buttonText
                                }
                                onClick={() => updateHeaderData(false)}
                                isLoading={updateHeaderLoading}
                              />
                              {isMultiple && (
                                <Button
                                  btnText="Skip & Next"
                                  onClick={handleSkip}
                                />
                              )}
                            </Typography>
                            <Typography
                              component={"div"}
                              display={"flex"}
                              gap={0.5}
                            >
                              <input
                                type="number"
                                value={pageNumber}
                                onChange={(e) =>
                                  setPageNumber(Number(e.target.value))
                                }
                                placeholder="page"
                                className="h-[23px] outline-none border border-gray-400 mt-3 rounded-[3px] w-28 px-2 text-sm"
                              />
                              <Button
                                btnText="Stitch"
                                onClick={handleStitchOpen}
                              />

                              <Button
                                onClick={handleUnStitchOpen}
                                btnText="unStitch"
                              />
                            </Typography>
                          </>
                        ) : (
                          <Box display={"flex"} gap={1} flexWrap={"wrap"}>
                            {" "}
                            <Button
                              btnText={
                                updateHeaderLoading ? "saving" : "Save partial"
                              }
                              onClick={() => updateHeaderData(true)}
                              isLoading={updateHeaderLoading}
                            />
                            <Button
                              btnText={
                                updateHeaderLoading ? "saving" : buttonText
                              }
                              onClick={() => updateHeaderData(false)}
                              isLoading={updateHeaderLoading}
                            />
                            {isMultiple && (
                              <Button
                                btnText="Skip & Next"
                                onClick={handleSkip}
                              />
                            )}
                            <input
                              type="number"
                              value={pageNumber}
                              onChange={(e) =>
                                setPageNumber(Number(e.target.value))
                              }
                              placeholder="page"
                              className="h-[23px] outline-none border border-gray-400 mt-3 rounded-[3px] w-28 px-2 text-sm"
                            />
                            <Button
                              btnText="Stitch"
                              onClick={handleStitchOpen}
                            />
                            <Button
                              onClick={handleUnStitchOpen}
                              btnText="unStitch"
                            />
                          </Box>
                        )}
                      </>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <DebounceSearchCompany
                          setSelectedCompany={setSelectedCompanies}
                          selectedCompany={selectedCompanies}
                          isMultiple
                        />
                        <div className="flex gap-1 pb-1">
                          <Button
                            onClick={handleAddCompany}
                            isLoading={addCompanyLoading}
                            btnText={addCompanyLoading ? "adding" : "Add"}
                          />
                          {!!selectionModel.length && (
                            <Button
                              btnText={
                                removeMultipleLoading ? "Removing" : "Remove"
                              }
                              onClick={removeSelectedCompanies}
                              isLoading={removeMultipleLoading}
                              isDanger
                            />
                          )}
                        </div>
                      </Box>
                      <Box height={500} width={"100%"}>
                        <DataGrid
                          rows={rows}
                          columns={columns}
                          density="compact"
                          checkboxSelection
                          onColumnResize={handleColumnResize}
                          onRowSelectionModelChange={handleRowSelection}
                          loading={
                            articleTagDetailsLoading && <CircularProgress />
                          }
                          pageSize={5}
                          pageSizeOptions={[10, 100, 200, 1000]}
                          columnBufferPx={1000}
                          hideFooterSelectedRowCount
                          disableRowSelectionOnClick
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </>
                <Box></Box>
              </Box>
            </Box>
            <Box width={"100%"}>
              <Card>
                <CardHeader
                  sx={{ height: 3 }}
                  title={
                    <Typography
                      variant="h6"
                      component={"a"}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      fontSize={"0.9em"}
                      href={`/articleview/download-file/${link}`}
                      target="_blank"
                      rel="noreferrer"
                      fontFamily="nunito"
                      className="underline text-primary"
                      height={3}
                    >
                      Article View
                      <FaExternalLinkAlt
                        style={{
                          fontSize: "1.2em",
                          fontFamily: "nunito",
                        }}
                      />
                    </Typography>
                  }
                />
                <CardContent>
                  <iframe
                    src={url + (defaultLink || row?.default_link)}
                    frameBorder="0"
                    style={{ width: "100%", height: "100vh" }}
                  />
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Modal>
      <StitchModal
        open={modalOpen}
        setOpen={setModalOpen}
        articleId={articleId}
        isStitch={stitchUnStitch.stitch}
        isUnStitch={stitchUnStitch.unStitch}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        fetchTagDetails={fetchTagDetails}
      />
    </Fragment>
  );
};

EditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  row: PropTypes.shape({
    main_id: PropTypes.number,
    defaultLink: PropTypes.string,
    link: PropTypes.string,
  }).isRequired,
  selectedItems: PropTypes.array,
  setSelectedItems: PropTypes.func,
  setSelectionModal: PropTypes.func,
  isMultiple: PropTypes.bool,
};
export default EditDialog;
