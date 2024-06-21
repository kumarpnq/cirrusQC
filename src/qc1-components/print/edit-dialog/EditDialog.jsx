import { useState } from "react";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// *icons
import CloseIcon from "@mui/icons-material/Close";
import { CloseOutlined } from "@mui/icons-material";
import { FaExternalLinkAlt } from "react-icons/fa";

// * component imports
import CustomTextField from "../../../@core/TextFieldWithLabel";
import DebounceSearchCompany from "../../../@core/DebounceSearchCompany";

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

const EditDialog = ({ row, rowNumber, open, setOpen }) => {
  const [formItems, setFormItems] = useState({
    headline: "test headline",
    summary: "test Summary",
    journalist: "Sidd S",
    tag: "test tag",
  });
  const [selectedCompanies, setSelectedCompanies] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormItems({
      ...formItems,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted: ", formItems);
    handleClose();
  };

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: 70,
      renderCell: () => (
        <IconButton
          sx={{ color: "red" }}
          onClick={() => alert("Yeah You Clicked!")}
        >
          <CloseIcon />
        </IconButton>
      ),
    },
    { field: "CompanyName", headerName: "CompanyName", width: 300 },
  ];

  const rows = [
    {
      id: 1,
      Action: (
        <IconButton color="red">
          <CloseIcon />
        </IconButton>
      ),
      CompanyName: "American Express",
    },
    {
      id: 2,
      Action: (
        <IconButton color="red">
          <CloseIcon />
        </IconButton>
      ),
      CompanyName: "BMW India",
    },
    {
      id: 3,
      Action: (
        <IconButton color="red">
          <CloseIcon />
        </IconButton>
      ),
      CompanyName: "Tata Motors",
    },
    {
      id: 4,
      Action: (
        <IconButton color="red">
          <CloseIcon />
        </IconButton>
      ),
      CompanyName: "Volkswagen",
    },
  ];

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
          <Typography id="edit-dialog-description" component={"div"}>
            <Button variant="outlined">Save & Next</Button>
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
            <Box component="form" onSubmit={handleSubmit}>
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
                  <Button>Add</Button>
                </Box>
                <Box height={500} width={"100%"}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    density="compact"
                    hideFooterSelectedRowCount
                    pageSizeOptions={[5, 10]}
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
                    href={"https://marathi.abplive.com/"}
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
                  src="https://marathi.abplive.com/"
                  frameBorder="0"
                  style={{ width: "100%", height: "540px" }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

EditDialog.propTypes = {
  row: PropTypes.object.isRequired,
  rowNumber: PropTypes.number.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default EditDialog;
