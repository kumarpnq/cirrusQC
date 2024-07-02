import { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Grid,
  CircularProgress,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Dialog,
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
import CustomButton from "../../../@core/CustomButton";
import { toast } from "react-toastify";

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

const EditDialog = ({ rowData, rowNumber, setRowNumber, open, setOpen }) => {
  const [row, setRow] = useState(null);

  // * api material
  const userToken = localStorage.getItem("user");
  const header = {
    Authorization: `Bearer ${userToken}`,
  };

  useEffect(() => {
    const data = rowData[rowNumber] || null;
    setRow(data);
  }, [rowData, rowNumber, setRow]);

  const socialFeedId = row?.social_feed_id;
  const iframeURI = row?.link;
  const [formItems, setFormItems] = useState({
    headline: "",
    summary: "",
    journalist: "",
    tag: "",
  });

  const [selectedCompanies, setSelectedCompanies] = useState(null);
  const [socialFeedTagDetails, setSocialFeedTagDetails] = useState([]);
  const [socialFeedTagDetailsLoading, setSocialFeedTagDetailsLoading] =
    useState(false);
  const [selectRowForDelete, setSelectRowForDelete] = useState({});
  const [verificationLoading, setVerificationLoading] = useState(false);

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
      setFormItems({
        headline: headerData.headline,
        summary: headerData.headsummary,
        journalist: headerData.author_name,
        tag: "",
      });

      const tagDetailsResponse = await axios.get(
        `${url}qc1onlinetagdetails/?socialfeed_id=${socialFeedId}`,
        { headers }
      );

      setSocialFeedTagDetails(tagDetailsResponse.data.socialfeed_details || []);
    } catch (error) {
      // toast.error("Error While fetching data.");
      console.log(error.message);
    } finally {
      setSocialFeedTagDetailsLoading(false);
    }
  };
  useEffect(() => {
    fetchHeaderAndTagDetails();
  }, [socialFeedId]);

  const handleClose = () => {
    setRowNumber(0);
    setRow(null);
    setSocialFeedTagDetails([]);
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormItems({
      ...formItems,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const requestData = {
        data: [
          {
            UPDATETYPE: "U",
            SOCIALFEEDID: socialFeedId,
            HEADLINE: formItems.headline,
            SUMMARY: formItems.summary,
            AUTHOR: formItems.journalist,
            TAG: formItems.tag,
          },
        ],
        qcflag: 1,
      };
      const response = await axios.post(
        `${url}updatesocialfeedheader/`,
        requestData,
        {
          headers: header,
        }
      );
      if (response.data?.result?.success?.length) {
        if (rowNumber < rowData.length - 1) {
          setRowNumber((prev) => prev + 1);
        } else {
          toast.success("This is the last article.");
          handleClose();
        }
      } else {
        const errorMSG = response.data?.result?.errors[0] || {};
        toast.warning(errorMSG.warning);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCompany = async () => {
    try {
      const requestData = {
        data: [
          {
            UPDATETYPE: "I",
            SOCIALFEEDID: socialFeedId,
            COMPANYID: selectedCompanies.value,
            COMPANYNAME: selectedCompanies.label,
          },
        ],
        qcflag: 1,
      };
      const response = await axios.post(
        `${url}updatesocialfeedtagdetails/`,
        requestData,
        {
          headers: header,
        }
      );
      if (response.status === 200) {
        fetchHeaderAndTagDetails();
        toast.success("Company added.");
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };

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
      console.log("Error:", error.message);
      setVerificationLoading(false);
    }
  };

  // * delete dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [password, setPassword] = useState("");

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDeleteClick = (rowData) => {
    setSelectRowForDelete(rowData);
    setOpenDelete(true);
  };

  const handleDeleteCompany = async () => {
    const isValid = await userVerification();
    if (!isValid) {
      return toast.error("Password not match with records");
    }
    const selectedRow = socialFeedTagDetails.find(
      (i) => i.company_name === selectRowForDelete.CompanyName
    );

    if (!selectedRow) {
      return toast.warning("No Company match");
    }
    try {
      const requestData = {
        data: [
          {
            UPDATETYPE: "D",
            SOCIALFEEDID: socialFeedId,
            COMPANYID: selectedRow.company_id,
            COMPANYNAME: selectedRow.company_name,
          },
        ],
        qcflag: 1,
      };
      const response = await axios.post(
        `${url}updatesocialfeedtagdetails/`,
        requestData,
        {
          headers: header,
        }
      );

      if (response.data?.result?.success?.length) {
        fetchHeaderAndTagDetails();
        toast.success("Company removed");
        setPassword("");
        setOpenDelete(false);
      } else {
        const errorMSG = response.data?.result?.error[0] || {};
        toast.warning(errorMSG.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: 70,
      renderCell: (params) => (
        <IconButton
          sx={{ color: "red" }}
          onClick={() => handleDeleteClick(params.row)}
        >
          <CloseIcon />
        </IconButton>
      ),
    },
    { field: "CompanyName", headerName: "CompanyName", width: 300 },
    { field: "Keyword", headerName: "Keyword", width: 300 },
  ];

  const rows = socialFeedTagDetails.map((detail, index) => ({
    id: index,
    CompanyName: detail.company_name,
    Keyword: detail.keyword,
  }));

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
              Edit
            </Typography>
            <Typography id="edit-dialog-description" component={"div"}>
              <Button variant="outlined" onClick={handleSubmit}>
                Save & Next
              </Button>
              <IconButton onClick={handleClose}>
                <CloseOutlined />
              </IconButton>
            </Typography>
          </Box>

          <Card>
            {" "}
            <CardHeader
              title={<Typography component={"span"}>Basic Details</Typography>}
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
          </Card>
          <Grid container spacing={1} mt={1}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader
                  title={
                    <Typography component={"span"}>Tagged Companies</Typography>
                  }
                />
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <DebounceSearchCompany
                      setSelectedCompany={setSelectedCompanies}
                    />
                    <Button onClick={handleAddCompany}>Add</Button>
                  </Box>
                  <Box height={500} width={"100%"}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      density="compact"
                      loading={
                        socialFeedTagDetailsLoading && <CircularProgress />
                      }
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
                      href={iframeURI}
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
                    src={iframeURI}
                    frameBorder="0"
                    style={{ width: "100%", height: "540px" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Modal>
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
            <Box width={100}>
              <CircularProgress />
            </Box>
          ) : (
            <CustomButton
              btnText="Delete"
              onClick={handleDeleteCompany}
              bg={"bg-red-500"}
            />
          )}
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

EditDialog.propTypes = {
  rowData: PropTypes.array.isRequired,
  rowNumber: PropTypes.number.isRequired,
  setRowNumber: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default EditDialog;
