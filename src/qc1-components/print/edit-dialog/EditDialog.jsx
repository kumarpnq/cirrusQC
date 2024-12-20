import { Fragment, useEffect, useLayoutEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// *icons
import CloseIcon from "@mui/icons-material/Close";
import { CloseOutlined } from "@mui/icons-material";
import { FaExternalLinkAlt } from "react-icons/fa";

// * component imports
import CustomTextField from "../../../@core/TextFieldWithLabel";
import DebounceSearchCompany from "../../../@core/DebounceSearchCompany";
import axios from "axios";
import { url } from "../../../constants/baseUrl";
import { toast } from "react-toastify";
import Button from "../../../components/custom/Button";
import { arrayToString } from "../../../utils/arrayToString";
import { saveTableSettings } from "../../../constants/saveTableSetting";
import useUserSettings from "../../../hooks/useUserSettings";

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
  position: "sticky",
  top: 0,
  background: "white",
  zIndex: 999,
};

const EditDialog = ({
  rowData,
  setSelectedItems,
  setSelectionModal,
  rowNumber,
  setRowNumber,
  open,
  setOpen,
  isFiltered,
  isSimilar,
  isMultipleArticles,
}) => {
  // * user setting

  const userColumnSettings = useUserSettings(
    "printSimilarArticles",
    "EditMain"
  );

  const [row, setRow] = useState(null);
  const articleIds = rowData.map((i) => i.id);

  useLayoutEffect(() => {
    if (isFiltered) {
      setRowNumber(articleIds[0]);
    }
  }, [isFiltered, open]);

  // * api material
  const userToken = localStorage.getItem("user");
  const header = {
    Authorization: `Bearer ${userToken}`,
  };

  const handleClose = () => {
    setFormItems({
      headline: "",
      summary: "",
      journalist: "",
      tag: "",
    });
    setRowNumber(0);
    setRow(null);
    setSocialFeedTagDetails([]);
    if (isMultipleArticles) {
      setSelectedItems([]);
      setSelectionModal([]);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      let data;
      if (isFiltered) {
        data = rowData.find((item) => item.id === rowNumber);
      } else {
        data = rowData[rowNumber || 0];
      }
      setRow(data);
    }
  }, [rowData, rowNumber, setRow, open]);

  const socialFeedId = isFiltered ? row?.socialFeedId : row?.social_feed_id;
  const iframeURI = isFiltered ? row?.url : row?.link;
  const [formItems, setFormItems] = useState({
    headline: "",
    summary: "",
    journalist: "",
    tag: "",
  });

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [socialFeedTagDetails, setSocialFeedTagDetails] = useState([]);
  const [socialFeedTagDetailsLoading, setSocialFeedTagDetailsLoading] =
    useState(false);
  const [headerData, setHeaderData] = useState(null);

  // * fetching header & tag details
  const fetchHeaderAndTagDetails = async () => {
    try {
      setSocialFeedTagDetailsLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };

      const headerResponse = await axios.get(
        `${url}qc1onlineheader/?socialfeed_id=${socialFeedId}`,
        { headers }
      );
      const headerData = headerResponse.data.socialfeed[0] || {};
      setHeaderData(headerData);
      setFormItems({
        headline: headerData.headline,
        summary: headerData.headsummary,
        journalist: headerData.author_name,
        tag: headerData.tags,
      });
    } catch (error) {
      console.log(error.message);
    } finally {
      setSocialFeedTagDetailsLoading(false);
    }
  };

  const fetchTagDetails = async () => {
    try {
      setSocialFeedTagDetailsLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      const tagDetailsResponse = await axios.get(
        `${url}qc1onlinetagdetails/?socialfeed_id=${socialFeedId}`,
        { headers }
      );
      const tagDetails = tagDetailsResponse.data.socialfeed_details || [];

      setSocialFeedTagDetails(Array.isArray(tagDetails) ? tagDetails : []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setSocialFeedTagDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (open && socialFeedId !== undefined) {
      fetchHeaderAndTagDetails();
      fetchTagDetails();
    }
  }, [socialFeedId, open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormItems({
      ...formItems,
      [name]: value,
    });
  };

  const handleSubmit = async (isSkip, isPartial) => {
    try {
      const data = { updateType: "U", socialFeedId };

      if (formItems.headline !== headerData?.headline) {
        data.headline = formItems.headline;
      }
      if (formItems.summary !== headerData?.headsummary) {
        data.summary = formItems.summary;
      }
      if (formItems.journalist !== headerData?.author_name) {
        data.author = formItems.journalist;
      }

      if (formItems.tag !== headerData?.tag && !null) {
        data.tag = formItems.tag;
      }

      const requestData = {
        data: [
          {
            updateType: "U",
            socialFeedId,
            headline: formItems.headline,
            summary: formItems.summary,
            author: formItems.journalist,
            tag: formItems.tag,
          },
        ],
        qcType: isPartial ? "QCP" : "QC1",
      };
      const response = await axios.post(
        `${url}updatesocialfeedheader/`,
        requestData,
        {
          headers: header,
        }
      );
      if (response.data?.result?.success?.length) {
        toast.success("Data saved.", {
          position: "bottom-right",
        });
        if (isMultipleArticles) {
          if ((rowNumber || 0) === rowData.length - 1) {
            setOpen(false);
            setFormItems({
              headline: "",
              summary: "",
              journalist: "",
              tag: "",
            });
            setSelectedItems([]);
            setSelectionModal([]);
            setRowNumber(0);
            setRow(null);
          }

          setRowNumber((prev) => prev + 1);
          return;
        }
        if (!isFiltered) {
          setFormItems({
            headline: "",
            summary: "",
            journalist: "",
            tag: "",
          });
          setRowNumber((prev) => prev + 1);
          return;
        }

        if (isPartial) {
          handleClose();
        }
        isSkip && handleClose();

        if (isFiltered) {
          setFormItems({
            headline: "",
            summary: "",
            journalist: "",
            tag: "",
          });
          setRowNumber((prevRowNumber) => {
            const currentIndex = articleIds.indexOf(prevRowNumber);

            // Ensure we get the next valid index, wrapping around when needed
            const nextIndex = (currentIndex + 1) % articleIds.length;
            const nextArticleId = articleIds[nextIndex];

            return nextArticleId;
          });
        } else if (isMultipleArticles) {
          if ((Number(rowNumber) || 0) === rowData.length - 1) {
            setOpen(false);
          }

          setRowNumber((prev) => prev + 1);
          return;
        } else {
          if (rowNumber < rowData.length - 1) {
            setFormItems({
              headline: "",
              summary: "",
              journalist: "",
              tag: "",
            });

            setSelectedCompanies([]);
          } else {
            toast.success("This is the last article.", {
              position: "bottom-right",
            });
            handleClose();
          }
        }
      } else {
        const errorMSG = response.data?.result?.errors[0] || {};
        toast.warning(errorMSG.warning);
      }
    } catch (error) {
      toast.error("Something went wrong.", {
        position: "bottom-right",
      });
    }
  };

  const [addLoading, setAddLoading] = useState(false);
  const handleAddCompany = async () => {
    if (!selectedCompanies.length) {
      toast.warning("No company selected.", {
        position: "bottom-right",
      });
      return;
    }
    const existingCompany = selectedCompanies.find((selectedCompany) =>
      socialFeedTagDetails.some(
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
      setAddLoading(true);
      const dataToSend = selectedCompanies.map((i) => ({
        updateType: "I",
        socialFeedId,
        companyId: i.value,
        companyName: i.label,
      }));
      const requestData = {
        data: dataToSend,
        qcType: "QC1",
      };
      const response = await axios.post(
        `${url}updatesocialfeedtagdetails/`,
        requestData,
        {
          headers: header,
        }
      );
      if (response.status === 200) {
        setSelectedCompanies([]);
        fetchTagDetails();
        toast.success("Company added.", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("Something went wrong", {
        position: "bottom-right",
      });
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteCompany = async (selectedRow) => {
    try {
      const requestData = {
        data: [
          {
            updateType: "D",
            socialFeedId,
            companyId: selectedRow.companyId,
            companyName: selectedRow.CompanyName,
          },
        ],
        qcType: "QC1",
      };
      const response = await axios.post(
        `${url}updatesocialfeedtagdetails/`,
        requestData,
        {
          headers: header,
        }
      );

      if (response.data?.result?.success?.length) {
        await fetchTagDetails();
        toast.success("Company removed", {
          position: "bottom-right",
        });
      } else {
        const errorMSG = response.data?.result?.error[0] || {};
        toast.warning(errorMSG.error);
      }
    } catch (error) {
      toast.error("Getting error.", {
        position: "bottom-right",
      });
    }
  };

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: userColumnSettings?.action || 70,
      renderCell: (params) => (
        <IconButton
          sx={{ color: "red" }}
          onClick={() => handleDeleteCompany(params.row)}
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
      field: "Keyword",
      headerName: "Keyword",
      width: userColumnSettings?.KeyWord || 300,
    },
  ];

  const rows = (socialFeedTagDetails || []).map((detail) => ({
    id: detail.company_id,
    CompanyName: detail.company_name,
    Keyword: detail.keyword,
    companyId: detail.company_id,
  }));

  const handleColumnResize = (params) => {
    let field = params.colDef.field;
    let width = params.width;
    saveTableSettings("printSimilarArticles", "EditMain", field, width);
  };

  const [selectionModel, setSelectionModel] = useState([]);
  const [removeMultipleLoading, setRemoveMultipleLoading] = useState(false);

  // Handle row selection change
  const handleRowSelection = (newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };

  // handle delete multiple companies
  const removeSelectedCompanies = async () => {
    const userToken = localStorage.getItem("user");
    const url3 = `${url}removecompanyonline`;

    try {
      setRemoveMultipleLoading(true);
      const params = {
        socialfeed_ids: arrayToString([socialFeedId]),
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
        toast.success("Companies removed successfully", {
          position: "bottom-right",
        });
        fetchTagDetails();
      }
    } catch (error) {
      toast.error("Error removing companies:", error.message);
    } finally {
      setRemoveMultipleLoading(false);
    }
  };

  const handleSkipAndNext = () => {
    if (isMultipleArticles) {
      if ((Number(rowNumber) || 0) === rowData.length - 1) {
        setOpen(false);
        setSelectionModal([]);
        setSelectedItems([]);
        setRowNumber(0);
        setRow(null);
        alert("yes");

        setFormItems({
          headline: "",
          summary: "",
          journalist: "",
          tag: "",
        });
      }
      setRowNumber((prev) => prev + 1);
      return;
    }
    if (!isFiltered) {
      setFormItems({
        headline: "",
        summary: "",
        journalist: "",
        tag: "",
      });
      setRowNumber((prev) => prev + 1);
    } else {
      setFormItems({
        headline: "",
        summary: "",
        journalist: "",
        tag: "",
      });
      setRowNumber((prevRowNumber) => {
        const currentIndex = articleIds.indexOf(prevRowNumber);

        const nextIndex = (currentIndex + 1) % articleIds.length;
        const nextArticleId = articleIds[nextIndex];

        return nextArticleId;
      });
    }
  };

  // * auto height for summary
  const [summaryAuto, setSummaryAuto] = useState({
    isAutoHeight: false,
    isMultiline: false,
  });

  const handleSaveAndClose = async (isPartial) => {
    try {
      const requestData = {
        data: [
          {
            updateType: "U",
            socialFeedId,
            headline: formItems.headline,
            summary: formItems.summary,
            author: formItems.journalist,
            tag: formItems.tag,
          },
        ],
        qcType: isPartial ? "QCP" : "QC1",
      };
      const response = await axios.post(
        `${url}updatesocialfeedheader/`,
        requestData,
        {
          headers: header,
        }
      );
      if (response.data?.result?.success?.length) {
        toast.success("Data saved.", {
          position: "bottom-right",
        });
        setOpen(false);
        setRowNumber(0);
        setRow(null);
        handleClose();
      } else {
        const errorMSG = response.data?.result?.errors[0] || {};
        toast.warning(errorMSG.warning);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
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
            Edit
          </Typography>
          <Typography
            id="edit-dialog-description"
            component={"div"}
            display={"flex"}
          >
            <Button
              btnText={`Save Partial & ${"Next"}`}
              onClick={() => {
                handleSubmit(false, true);
              }}
            />
            {!isSimilar && (
              <>
                <Button btnText="Skip & Next" onClick={handleSkipAndNext} />
                <Button
                  btnText="Save & Next"
                  onClick={() => handleSubmit(false, false)}
                />
              </>
            )}

            <Button
              btnText="Save & Close"
              onClick={() => handleSaveAndClose(false)}
            />
            <IconButton onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Typography>
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box>
            <Card>
              {" "}
              <CardHeader
                sx={{ height: 3 }}
                title={
                  <Typography component={"span"}>Basic Details</Typography>
                }
              />
              <CardContent>
                <Box component="form">
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
                        id="tag"
                        name="tag"
                        label="Tag"
                        value={formItems.tag}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
              <Box sx={{ px: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
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
                      btnText={addLoading ? "adding" : "Add"}
                      isLoading={addLoading}
                    />
                    {!!selectionModel.length && (
                      <Button
                        btnText={removeMultipleLoading ? "Removing" : "Remove"}
                        onClick={removeSelectedCompanies}
                        isLoading={removeMultipleLoading}
                        isDanger
                      />
                    )}
                  </div>
                </Box>
                <Box height={570} width={"100%"}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    density="compact"
                    checkboxSelection
                    onColumnResize={handleColumnResize}
                    onRowSelectionModelChange={handleRowSelection}
                    loading={
                      socialFeedTagDetailsLoading && <CircularProgress />
                    }
                    pageSize={5}
                    pageSizeOptions={[10, 100, 200, 1000]}
                    columnBufferPx={1000}
                    hideFooterSelectedRowCount
                    disableRowSelectionOnClick
                  />
                </Box>
              </Box>
            </Card>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Card>
              <CardHeader
                sx={{ height: 5 }}
                title={
                  <Typography
                    variant="h6"
                    component={"a"}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    fontSize={"0.9em"}
                    href={iframeURI || row?.link}
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
                  src={iframeURI || row?.link}
                  frameBorder="0"
                  style={{ width: "100%", height: "100vh" }}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

EditDialog.propTypes = {
  rowData: PropTypes.array.isRequired,
  rowNumber: PropTypes.number.isRequired,
  setRowNumber: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  isFiltered: PropTypes.bool,
  isSimilar: PropTypes.bool,
  isMultipleArticles: PropTypes.bool,
  setSelectedItems: PropTypes.func,
  setSelectionModal: PropTypes.func,
};

export default EditDialog;
