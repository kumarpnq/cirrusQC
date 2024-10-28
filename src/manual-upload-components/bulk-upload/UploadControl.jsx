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

      const responseMap = responseData.map((item) => {
        const socialFeedId = item.articleExist.processStatus.socialFeedId;
        const link = item.link;

        return {
          link,
          socialFeedId,
          message:
            socialFeedId === null
              ? "Article Not Uploaded."
              : "Article Already Exist.",
        };
      });

      const updatedGridData = gridData.map((row) => {
        const responseEntry = responseMap.find(
          (entry) => entry.link === row.Link
        );

        const status = responseEntry ? responseEntry.message : row.status;
        const socialFeedId = responseEntry
          ? responseEntry.socialFeedId
          : row.socialFeedId;

        return {
          ...row,
          status,
          ...(socialFeedId && { SocialFeedId: socialFeedId }),
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
        (i) => i.status === "Article Not Uploaded."
      );

      const inValidRecords = validRowsForProcess.filter((record, index) => {
        if (!record.CompanyID) {
          toast.error(`${index + 1} records is missing a CompanyID`);
          return true;
        }
        return false;
      });
      if (inValidRecords.length > 0) {
        return;
      }

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

      const processResponseData = responses.map((i) => i.data.response);

      const processedLinks = processResponseData
        .filter(
          (item) =>
            item.processStatus.message !== "Already uploaded" &&
            item.processStatus.message !== "Invalid URL"
        )
        .map((item) => item.processStatus.link);

      const processedFailedLinks = processResponseData
        .filter((item) => item.processStatus.message === "Already uploaded")
        .map((item) => item.processStatus.link);
      const processedFailedLinks2 = processResponseData
        .filter((item) => item.processStatus.message === "Invalid URL")
        .map((item) => ({
          link: item.processStatus.link,
          msg: item.processStatus.message,
        }));

      const toastMessage = `Articles Updated: ${
        processedLinks.length || 0
      }, Articles Not Updated: ${
        processedFailedLinks.length || 0
      }, Invalid Links: ${processedFailedLinks2.length || 0}`;

      let updatedGridData = gridData.map((row) => {
        if (processedLinks.includes(row.Link)) {
          console.log("Updating row:", row);
          return {
            ...row,
            status: "Updated Successfully",
          };
        } else if (processedFailedLinks.includes(row.Link)) {
          return {
            ...row,
            status: "Article Already Uploaded.",
          };
        } else {
          const invalidLink = processedFailedLinks2.find(
            (item) => item.link === row.Link
          );

          if (invalidLink) {
            return {
              ...row,
              status: invalidLink.msg,
            };
          }
        }

        return row;
      });
      setGridData(updatedGridData);
      if (processedLinks.length) {
        toast.info(toastMessage, { autoClose: 5000 });
        setSelectedRows([]);
        setSelectionModal([]);
      } else {
        toast.info(toastMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProcessLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 0.8, mb: 1, ml: 1 }}>
      <div className="flex gap-1 p-2 border border-gray-300 rounded-sm">
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
      </div>
      <div className="flex gap-1 p-2 ml-1 border border-gray-300 rounded-sm">
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
      </div>
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
