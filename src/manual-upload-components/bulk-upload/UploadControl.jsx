import { Box, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { url } from "../../constants/baseUrl";
import { parse, format } from "date-fns";
import { toast } from "react-toastify";
import { arrayToString } from "../../utils/arrayToString";

const UploadControl = ({
  onParse,
  onAdd,
  selectedRows,
  setSelectedRows,
  setSelectionModal,
  gridData,
  setGridData,
}) => {
  const [checkLoading, setCheckLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);

  const handleSampleBookDownload = () => {
    const link = document.createElement("a");
    link.href = "/samplebook.xlsx";
    link.download = "samplebook.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCheckRecord = async () => {
    if (selectedRows.length === 0) {
      toast.warning("No Articles found.");
      return;
    }

    setCheckLoading(true);
    try {
      const userToken = localStorage.getItem("user");

      const requests = selectedRows.map((row) => {
        const { Link, Date: dateStr } = row;
        const parsedDate = parse(dateStr, "dd-MMM-yy", new Date());
        const formattedDate = format(parsedDate, "yyyy-MM-dd");
        return axios.get(`${url}checkSocialFeedExist/`, {
          params: { url: Link, date: formattedDate },
          headers: { Authorization: `Bearer ${userToken}` },
        });
      });

      const responses = await Promise.all(requests);
      const responseData = responses.map((i) => i.data);

      const responseMap = responseData.reduce((map, item) => {
        map[item.link] = item.articleExist ? "exist" : "not exist";
        return map;
      }, {});

      const updatedGridData = gridData.map((row) => {
        const status = responseMap[row.Link] || row.status;
        return {
          ...row,
          status,
        };
      });

      setGridData(updatedGridData);
      setSelectedRows([]);
      setSelectionModal([]);
    } catch (error) {
      console.error("Error checking records:", error.message);
    } finally {
      setCheckLoading(false);
    }
  };

  const handleProcess = async () => {
    try {
      setProcessLoading(true);
      const validRowsForProcess = selectedRows.filter(
        (i) => i.status === "not exist"
      );

      if (!validRowsForProcess.length) {
        toast.warning("No rows found for process.");
        return;
      }
      const userToken = localStorage.getItem("user");
      const requests = validRowsForProcess.map((row) => {
        const { Link, Date: dateStr, CompanyID } = row;
        const parsedDate = parse(dateStr, "dd-MMM-yy", new Date());
        const formattedDate = format(parsedDate, "yyyy-MM-dd");
        const request_data = {
          url: Link,
          date: formattedDate,
          company_ids: arrayToString([CompanyID]),
        };
        return axios.post(`${url}processBulkUpload/`, request_data, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
      });
      const responses = await Promise.all(requests);
      const processResponseData = responses.map((i) => i.data);
      const processedLinks = processResponseData
        .filter((item) => item.message.update_status)
        .map((item) => item.message.link);

      const updatedGridData = gridData.filter(
        (row) => !processedLinks.includes(row.Link)
      );
      setGridData(updatedGridData);
      if (processedLinks.length) {
        toast.success("Data inserted.");
        setSelectedRows([]);
        setSelectionModal([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProcessLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 0.8 }}>
      <Button variant="outlined" onClick={handleSampleBookDownload}>
        Sample Book
      </Button>
      <Button
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          if (onParse) onParse();
        }}
        size="small"
      >
        Upload
      </Button>

      <Button
        variant="outlined"
        onClick={(e) => {
          e.stopPropagation();
          if (onAdd) onAdd();
        }}
        size="small"
      >
        Add
      </Button>
      <Button
        variant={checkLoading ? "outlined" : "contained"}
        size="small"
        onClick={handleCheckRecord}
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        Check
        {checkLoading && <CircularProgress size={"1em"} />}
      </Button>
      <Button
        variant={processLoading ? "outlined" : "contained"}
        color="primary"
        size="small"
        onClick={handleProcess}
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        Process
        {processLoading && <CircularProgress size={"1em"} />}
      </Button>
    </Box>
  );
};

UploadControl.propTypes = {
  onParse: PropTypes.func,
  onAdd: PropTypes.func,
  selectedRows: PropTypes.array,
  setSelectedRows: PropTypes.func,
  gridData: PropTypes.array,
  setGridData: PropTypes.func,
  setSelectionModal: PropTypes.func,
};

export default UploadControl;
