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
        headline: headerData.headline,
        summary: headerData.summary,
        journalist: headerData.journalist,
        page: headerData.page_number,
        articleSummary: headerData.article_summary,
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
    if (open) {
      fetchHeaderAndTagDetails();
      fetchTagDetails();
    }
  }, [articleId, open]);

  // * updating header data
  const [updateHeaderLoading, setUpdateHeaderLoading] = useState(false);
  const updateHeaderData = async () => {
    try {
      setUpdateHeaderLoading(true);
      const data = {
        ARTICLEID: articleId,
      };
      // Compare each field in formItems with headerData and add to data if modified
      if (formItems.headline !== headerData.headline) {
        data.HEADLINES = formItems.headline;
      }
      if (formItems.summary !== headerData.summary) {
        data.HEADSUMMARY = formItems.summary;
      }
      if (formItems.journalist !== headerData.journalist) {
        data.JOURNALIST = formItems.journalist;
      }
      if (formItems.page !== headerData.page_number) {
        data.PAGENUMBER = Number(formItems.page);
      }
      if (formItems.articleSummary !== headerData.article_summary) {
        data.ARTICLE_SUMMARY = formItems.articleSummary;
      }

      const request_data = {
        data: [data],
        QCTYPE: "QC1",
      };

      const response = await axios.post(
        `${url}updatearticleheader/`,
        request_data,
        {
          headers,
        }
      );
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
    try {
      setAddCompanyLoading(true);
      const dataToSend = selectedCompanies.map((i) => ({
        UPDATETYPE: "I",
        ARTICLEID: articleId,
        COMPANYID: i.value,
        COMPANYNAME: i.label,
      }));
      const request_data = {
        data: dataToSend,
        QCTYPE: "QC1",
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
            UPDATETYPE: "D",
            ARTICLEID: articleId,
            COMPANYID: selectedRow?.companyId,
          },
        ],
        QCTYPE: "QC1",
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
      width: 70,
      renderCell: (params) => (
        <IconButton
          sx={{ color: "red" }}
          onClick={() => handleRemoveCompany(params.row)}
        >
          <CloseIcon />
        </IconButton>
      ),
    },
    { field: "CompanyName", headerName: "Company", width: 300 },
    { field: "keyword", headerName: "Keyword", width: 300 },
  ];

  const rows = articleTagDetails.map((item, index) => ({
    id: index,
    companyId: item.company_id,
    CompanyName: item.company_name,
    keyword: item.keyword,
  }));

  // * save button text
  const buttonText = isMultiple ? "Save & Next" : "save";

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
                    multiline
                    fullWidth
                  />
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, height: 100 }}>
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

          <Grid container spacing={1} mt={1}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box display={"flex"} gap={1} flexWrap={"wrap"}>
                    <Button
                      btnText={updateHeaderLoading ? "saving" : buttonText}
                      onClick={updateHeaderData}
                      isLoading={updateHeaderLoading}
                    />
                    {isMultiple && (
                      <Button btnText="Skip & Next" onClick={handleSkip} />
                    )}
                    <input
                      type="number"
                      value={pageNumber}
                      onChange={(e) => setPageNumber(Number(e.target.value))}
                      placeholder="page"
                      className="h-[23px] outline-none border border-gray-400 mt-3 rounded-[3px] w-28 px-2 text-sm"
                    />
                    <Button btnText="Stitch" onClick={handleStitchOpen} />

                    <Button onClick={handleUnStitchOpen} btnText="unStitch" />
                  </Box>
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
                    <span className="pb-1">
                      <Button
                        onClick={handleAddCompany}
                        isLoading={addCompanyLoading}
                        btnText={addCompanyLoading ? "adding" : "Add"}
                      />
                    </span>
                  </Box>
                  <Box height={500} width={"100%"}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      density="compact"
                      loading={articleTagDetailsLoading && <CircularProgress />}
                      pageSize={5}
                      pageSizeOptions={[10, 100, 200, 1000]}
                      columnBufferPx={1000}
                      hideFooterSelectedRowCount
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      component={"a"}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      fontSize={"0.9em"}
                      // href={"https://marathi.abplive.com/"}
                      href={`/articleview/download-file/${link}`}
                      target="_blank"
                      rel="noreferrer"
                      fontFamily="nunito"
                      className="underline text-primary"
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
                    src={url + defaultLink}
                    frameBorder="0"
                    style={{ width: "100%", height: "540px" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
