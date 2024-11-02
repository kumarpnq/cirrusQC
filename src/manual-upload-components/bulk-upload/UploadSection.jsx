import {
  Box,
  Button,
  Typography,
  Divider,
  useMediaQuery,
  Tooltip,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import PropTypes from "prop-types";
import { FaFileExcel } from "react-icons/fa";

const UploadSection = ({ setData, setDataForGrid }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:600px)");
  const readExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
        raw: false,
        defval: "",
      });

      const parsedData = jsonData
        .map((row) => {
          Object.keys(row).forEach((key) => {
            if (key.toLowerCase() === "date") {
              row[key] = ensureCorrectDateFormat(row[key]);
            }
          });
          return row;
        })
        .filter((row) => {
          const datePattern = /^\d{4}-\d{2}-\d{2}$/;
          const isLinkPresent = row["Link"];
          const isDateValid = row["Date"] && datePattern.test(row["Date"]);
          return isLinkPresent && isDateValid;
        });

      setData(parsedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const ensureCorrectDateFormat = (dateValue) => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (datePattern.test(dateValue)) {
      return dateValue;
    }

    if (typeof dateValue === "string" && dateValue.includes("/")) {
      const [year, month, day] = dateValue.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }

    if (typeof dateValue === "number") {
      const parsedDate = XLSX.SSF.parse_date_code(dateValue);
      const day = String(parsedDate.d).padStart(2, "0");
      const month = String(parsedDate.m).padStart(2, "0");
      const year = parsedDate.y;
      return `${year}-${month}-${day}`;
    }

    return "";
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      readExcelFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      readExcelFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleClear = () => {
    setFile(null);
    setData([]);
    setDataForGrid([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSampleBookDownload = () => {
    const link = document.createElement("a");
    link.href = "/samplebook.xlsx";
    link.download = "samplebook.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-1 py-1">
      <Box
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        sx={{
          border: `1px ${isDragging ? "solid" : "dotted"} gray`,
          padding: "16px",
          borderRadius: "8px",
          width: !isMobile ? "600px" : "350px",
          margin: "auto",
          textAlign: "center",
          position: "relative",
          height: 100,
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          style={{
            position: "absolute",
            width: !isMobile ? "600px" : "350px",
            height: "100%",
            left: 0,
            opacity: 0,
            cursor: "pointer",
          }}
        />
        <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
          {isDragging ? "Drop Here" : "Browse... or Drop File Here"}
        </Typography>
        <UploadFileIcon sx={{ fontSize: 40 }} style={{ color: "gray" }} />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Tooltip title="Download sample excel sheet.">
          <IconButton onClick={handleSampleBookDownload}>
            <FaFileExcel className="text-primary" />
          </IconButton>
        </Tooltip>
        <Button variant="outlined" size="small" onClick={handleClear}>
          Clear
        </Button>
        {file && (
          <>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body3" color="GrayText" fontSize={"1em"}>
              {file.name}
            </Typography>
          </>
        )}
      </Box>
    </div>
  );
};

UploadSection.propTypes = {
  setData: PropTypes.func.isRequired,
  setDataForGrid: PropTypes.func.isRequired,
};

export default UploadSection;
