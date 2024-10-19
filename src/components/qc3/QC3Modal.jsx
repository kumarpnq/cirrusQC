import {
  Box,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import CheckIcon from "@mui/icons-material/Check";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import StoreIcon from "@mui/icons-material/Store";
import CompanyModal from "./CompanyModal";

// Sample dummy data
const dummyData = [
  {
    company: "Company A",
    subject: "New Policy",
    prominence: "High",
    tone: "Positive",
    summary: "Company A announced a new policy.",
    remarks: "Reviewed",
    savariety: 1,
    qc3: "p",
    accepted: false,
  },
  {
    company: "Company B",
    subject: "Market News",
    prominence: "Medium",
    tone: "Neutral",
    summary: "Company B's market update.",
    remarks: "Pending",
    savariety: 1,
    qc3: "p",
    accepted: false,
  },
  {
    company: "Company C",
    subject: "New Product Launch",
    prominence: "Low",
    tone: "Negative",
    summary: "Company C faced issues during launch.",
    remarks: "Urgent",
    savariety: 2,
    qc3: "q",
    accepted: false,
  },
  {
    company: "Company D",
    subject: "CEO Change",
    prominence: "High",
    tone: "Positive",
    summary: "CEO change in Company D.",
    remarks: "Reviewed",
    savariety: 3,
    qc3: "e",
    accepted: false,
  },
  {
    company: "Company E",
    subject: "Stock Price Drop",
    prominence: "Low",
    tone: "Negative",
    summary: "Stock price dropped.",
    remarks: "Pending",
    savariety: 3,
    qc3: "e",
    accepted: false,
  },
  {
    company: "Company F",
    subject: "Merger Announcement",
    prominence: "High",
    tone: "Positive",
    summary: "Merger with Company G.",
    remarks: "Reviewed",
    savariety: 3,
    qc3: "e",
    accepted: false,
  },
  {
    company: "Company G",
    subject: "Quarterly Earnings",
    prominence: "Medium",
    tone: "Neutral",
    summary: "Company G's earnings report.",
    remarks: "Pending",
    savariety: 1,
    qc3: "p",
    accepted: false,
  },
  {
    company: "Company H",
    subject: "Product Recall",
    prominence: "Low",
    tone: "Negative",
    summary: "Company H recalls product.",
    remarks: "Urgent",
    savariety: 2,
    qc3: "q",
    accepted: false,
  },
  {
    company: "Company I",
    subject: "New Partnership",
    prominence: "High",
    tone: "Positive",
    summary: "Partnership with Company J.",
    remarks: "Reviewed",
    savariety: 2,
    qc3: "q",
    accepted: false,
  },
  {
    company: "Company J",
    subject: "Layoffs",
    prominence: "Low",
    tone: "Negative",
    summary: "Company J announces layoffs.",
    remarks: "Pending",
    savariety: 1,
    qc3: "p",
    accepted: true,
  },
];

const getRowColor = (savariety) => {
  switch (savariety) {
    case 1:
      return "rgba(198, 255, 221, 0.5)";
    case 2:
      return "rgba(255, 251, 198, 0.5)";
    case 3:
      return "rgba(255, 198, 198, 0.5)";
    default:
      return "white";
  }
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px",
  borderBottom: "2px solid #ddd",
}));

const StyledTableRow = styled(TableRow)(({ savariety }) => ({
  backgroundColor: getRowColor(savariety),
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(135, 206, 235, 0.3)",
  },
}));

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
  p: 4,
  outline: "none",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#FFF",
}));

const LegendBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "20px",
  right: "20px",
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "8px",
  boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
}));

export const QC3Modal = ({ open, handleClose }) => {
  const [showLegend, setShowLegend] = useState(true);
  const [openCompanyModal, setCompanyModal] = useState(false);
  return (
    <div>
      {/* Modal implementation */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="qc3-modal-title"
        aria-describedby="qc3-modal-description"
      >
        <StyledModalBox>
          <Typography
            id="qc3-modal-title"
            variant="h5"
            component="h2"
            gutterBottom
            fontSize={"1em"}
          >
            QC3 Detailed Information
          </Typography>
          <IconButton
            onClick={() => {
              setShowLegend((prev) => !prev);
            }}
          >
            <InfoIcon />
          </IconButton>
          {showLegend && (
            <LegendBox>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Legends
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: "rgba(198, 255, 221, 0.5)",
                    mr: 1,
                  }}
                />
                <Typography variant="body2">
                  Savariety 1: Low Priority (Green)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: "rgba(255, 251, 198, 0.5)",
                    mr: 1,
                  }}
                />
                <Typography variant="body2">
                  Savariety 2: Medium Priority (Yellow)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: "rgba(255, 198, 198, 0.5)",
                    mr: 1,
                  }}
                />
                <Typography variant="body2">
                  Savariety 3: High Priority (Red)
                </Typography>
              </Box>
            </LegendBox>
          )}

          <TableContainer
            component={Paper}
            elevation={4}
            sx={{ borderRadius: "10px" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ color: "#fff" }} className="bg-primary">
                  <StyledTableCell sx={{ color: "#fff" }}>QC3</StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff" }}>
                    Company
                  </StyledTableCell>

                  <StyledTableCell sx={{ color: "#fff" }}>
                    Actions
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff" }}>
                    Subject
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff" }}>
                    Prominence
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff" }}>Tone</StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff" }}>
                    Summary
                  </StyledTableCell>
                  <StyledTableCell sx={{ color: "#fff" }}>
                    Remarks
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyData.map((row, index) => (
                  <StyledTableRow key={index} savariety={row.savariety}>
                    <TableCell>{row.qc3.toUpperCase()}</TableCell>
                    <TableCell>{row.company}</TableCell>
                    <TableCell>
                      {row.qc3 === "e" ? (
                        <IconButton
                          onClick={() => setCompanyModal((prev) => !prev)}
                        >
                          <StoreIcon />
                        </IconButton>
                      ) : row.accepted ? (
                        <DoneAllIcon color="success" />
                      ) : (
                        <CheckIcon />
                      )}
                    </TableCell>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell>{row.prominence}</TableCell>
                    <TableCell>{row.tone}</TableCell>
                    <TableCell>{row.summary}</TableCell>
                    <TableCell>{row.remarks}</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledModalBox>
      </Modal>
      <CompanyModal
        open={openCompanyModal}
        handleClose={() => setCompanyModal(false)}
      />
    </div>
  );
};

export default QC3Modal;
