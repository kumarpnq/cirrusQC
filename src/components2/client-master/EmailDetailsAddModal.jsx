import { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Divider,
  IconButton,
  CircularProgress,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { format, addYears, parse, isValid } from "date-fns";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles } from "@mui/styles";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";
import { read, utils } from "xlsx";

const useStyles = makeStyles((theme) => ({
  modalBox: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "95vw",
    height: "90vh",
    backgroundColor: "white",
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    overflow: "scroll",
  },
  table: {
    marginTop: theme.spacing(2),
    overflow: "scroll",
    borderRadius: "3px",
  },
  hoverRow: {
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  stripedRow: {
    backgroundColor: theme.palette.action.selected,
  },
  addRowContainer: {
    marginTop: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  addButton: {
    marginTop: theme.spacing(2),
  },
}));

const EmailDetailsAddModal = ({
  open,
  handleClose,
  clientId,
  fetchMainData,
}) => {
  const classes = useStyles();
  const [saveLoading, setSaveLoading] = useState(false);

  const MAX_ROWS = 15;
  const INITIAL_ROWS = 5;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const dateFormat = "yyyy-MM-dd";

  const [rowCount, setRowCount] = useState(INITIAL_ROWS);
  const [rows, setRows] = useState(
    new Array(rowCount).fill(null).map((_, index) => ({
      id: index + 1,
      emailId: "",
      name: "",
      phone: "",
      designation: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addYears(new Date(), 2), "yyyy-MM-dd"),
      sortOrder: "",
    }))
  );

  console.log(rows);

  const handleAddRows = () => {
    if (rows.length > MAX_ROWS) {
      return;
    }
    const rowsToAdd = Math.min(parseInt(rowCount, 10), MAX_ROWS - rows.length);

    if (rowsToAdd <= 0) return;

    const nextId = rows.length ? rows[rows.length - 1].id + 1 : 1;
    const newRows = new Array(rowsToAdd).fill(null).map((_, index) => ({
      id: nextId + index,
      emailId: "",
      name: "",
      phone: "",
      designation: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addYears(new Date(), 2), "yyyy-MM-dd"),
      sortOrder: "",
    }));

    setRows((prevRows) => [...prevRows, ...newRows]);
  };

  const handleInputChange = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = utils.sheet_to_json(sheet);

        const formattedRows = parsedData.map((row, index) => {
          // Ensure email exists and trim any extra spaces
          const emailId = (row.email || "").trim();
          const startDate = row.startDate || "";
          const endDate = row.endDate || "";

          // Validate email format
          if (emailId && !emailRegex.test(emailId)) {
            toast.error(`Invalid email format at row ${index + 1}: ${emailId}`);
          }

          // Convert Excel serial date number to JavaScript Date
          const convertExcelDate = (serial) => {
            if (typeof serial === "number") {
              const utc_days = Math.floor(serial - 25569);
              const utc_value = utc_days * 86400;
              const date = new Date(utc_value * 1000);
              return date;
            }
            return new Date(0); // Return a default date for invalid values
          };

          // Validate start date format using date-fns
          let parsedStartDate = "";
          if (startDate) {
            parsedStartDate = convertExcelDate(startDate);
            if (!isValid(parsedStartDate)) {
              toast.error(
                `Invalid start date format at row ${index + 1}: ${startDate}`
              );
            }
          }

          // Validate end date format using date-fns
          let parsedEndDate = "";
          if (endDate) {
            parsedEndDate = convertExcelDate(endDate);
            if (!isValid(parsedEndDate)) {
              toast.error(
                `Invalid end date format at row ${index + 1}: ${endDate}`
              );
            }
          }

          return {
            id: index + 1,
            emailId,
            name: row.name || "",
            phone: row.phone || "",
            designation: row.designation || "",
            startDate: parsedStartDate
              ? parsedStartDate.toISOString().split("T")[0]
              : "",
            endDate: parsedEndDate
              ? parsedEndDate.toISOString().split("T")[0]
              : "",
            sortOrder: row.sortOrder || "",
          };
        });

        setRows(formattedRows);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("No file selected.");
    }
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const validRows = rows
        .filter((row) => row.emailId && emailRegex.test(row.emailId))
        .map((item) => ({
          email: item.emailId,
          name: item.name,
          phone: Number(item.phone),
          designation: item.designation,
          startDate: item.startDate,
          endDate: item.endDate,
          sortOrder: item.sortOrder,
          updateType: "I",
        }));
      const requestData = {
        clientId,
        emailDetails: validRows,
      };
      if (validRows.length > 0) {
        const response = await axiosInstance.post(
          "updateEmailDetails",
          requestData
        );

        if (response.data.data.data.success.length) {
          toast.success(response.data.data.data.success[0]?.status);
          setRows(
            new Array(INITIAL_ROWS).fill(null).map((_, index) => ({
              id: index + 1,
              emailId: "",
              name: "",
              phone: "",
              designation: "",
              startDate: format(new Date(), "yyyy-MM-dd"),
              endDate: format(addYears(new Date(), 2), "yyyy-MM-dd"),
              sortOrder: "",
            }))
          );
          handleClose();
          fetchMainData();
        } else {
          toast.error(response.data.data.data.error[0]?.status);
        }
      } else {
        console.log("No valid rows to save.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/emailDetails.xlsx";
    link.download = "emailDetails.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClear = () => {
    // Clear the file input
    document.getElementById("file").value = "";
  };

  const handleCloseAll = () => {
    handleClose();
    handleClear();
    setRowCount(5);
    setRows(
      new Array(rowCount).fill(null).map((_, index) => ({
        id: index + 1,
        emailId: "",
        name: "",
        phone: "",
        designation: "",
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(addYears(new Date(), 2), "yyyy-MM-dd"),
        sortOrder: "",
      }))
    );
  };

  return (
    <Modal open={open} onClose={handleCloseAll}>
      <Box className={classes.modalBox}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="h2" fontSize={"1em"}>
            Add Email Details
          </Typography>
          <IconButton onClick={handleCloseAll}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography
          component={"div"}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box className={classes.addRowContainer}>
            <TextField
              label="Number of Rows"
              variant="outlined"
              size="small"
              type="number"
              fullWidth
              inputProps={{ min: 1 }}
              id="rowsToAdd"
              value={rowCount}
              onChange={(e) => setRowCount(e.target.value)}
              InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
            />
            <Button variant="outlined" size="small" onClick={handleAddRows}>
              Add
            </Button>
            <span>Or</span>
            <TextField
              type="file"
              id="file"
              size="small"
              fullWidth
              onChange={handleFileUpload}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClear} color="error">
                      <CloseIcon />
                    </IconButton>
                    <Tooltip title="Download excel book.">
                      <IconButton onClick={handleDownload} color="primary">
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Button variant="outlined" size="small" onClick={handleSave}>
            {saveLoading && <CircularProgress size={"1em"} />}
            Save
          </Button>
        </Typography>
        <Divider sx={{ my: 1 }} />
        <TableContainer className={classes.table}>
          <Table sx={{ overflowY: "scroll" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: "4px 8px" }}>Email ID</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>Name</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>Phone</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>Designation</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>Start Date</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>End Date</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>Sort Order</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  className={
                    index % 2 === 0 ? classes.stripedRow : classes.hoverRow
                  }
                >
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <TextField
                      fullWidth
                      value={row.emailId}
                      onChange={(e) =>
                        handleInputChange(row.id, "emailId", e.target.value)
                      }
                      InputProps={{
                        style: {
                          width: 250,
                          height: 25,
                          fontSize: "0.9em",
                        },
                      }}
                      variant="outlined"
                      size="small"
                      type="email"
                      placeholder="my@gmail.com"
                      required
                      error={
                        !emailRegex.test(row.emailId) && row.emailId !== ""
                      }
                      helperText={
                        !emailRegex.test(row.emailId) && row.emailId !== ""
                          ? "Please enter a valid email"
                          : ""
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <TextField
                      fullWidth
                      value={row.name}
                      onChange={(e) =>
                        handleInputChange(row.id, "name", e.target.value)
                      }
                      type="text"
                      variant="outlined"
                      size="small"
                      placeholder="Name"
                      InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <TextField
                      fullWidth
                      value={row.phone}
                      onChange={(e) =>
                        handleInputChange(row.id, "phone", e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      type="number"
                      placeholder="1234567890"
                      InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <TextField
                      fullWidth
                      value={row.designation}
                      onChange={(e) =>
                        handleInputChange(row.id, "designation", e.target.value)
                      }
                      variant="outlined"
                      size="small"
                      placeholder="role"
                      InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <TextField
                      fullWidth
                      value={row.startDate}
                      onChange={(e) =>
                        handleInputChange(row.id, "startDate", e.target.value)
                      }
                      type="date"
                      variant="outlined"
                      size="small"
                      InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <TextField
                      fullWidth
                      value={row.endDate}
                      onChange={(e) =>
                        handleInputChange(row.id, "endDate", e.target.value)
                      }
                      type="date"
                      variant="outlined"
                      size="small"
                      InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <TextField
                      fullWidth
                      value={row.sortOrder}
                      onChange={(e) =>
                        handleInputChange(row.id, "sortOrder", e.target.value)
                      }
                      placeholder="0"
                      variant="outlined"
                      size="small"
                      InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

EmailDetailsAddModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default EmailDetailsAddModal;
