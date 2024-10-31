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
  buttonPermission,
}) => {
  const [checkLoading, setCheckLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [bypassScrapLoading, setBypassScrapLoading] = useState(false);

  const handleCheckRecord = async () => {
    if (selectedRows.length === 0) {
      toast.warning("No Articles found.");
      return;
    }

    const updatedGridData = gridData.map((row) => {
      const selectedRow = selectedRows.find(
        (selected) => selected.Link === row.Link
      );

      if (selectedRow && !selectedRow.CompanyID) {
        return {
          ...row,
          status: "Invalid Company ID(s)",
        };
      }

      return row;
    });

    setGridData(updatedGridData);

    const validRecords = selectedRows.filter((record) => record.CompanyID);
    const updatedSelectedArticles = selectedRows.filter((article) => {
      return validRecords.some(
        (validRecord) => validRecord.Link === article.Link
      );
    });

    setSelectedRows(updatedSelectedArticles);

    setCheckLoading(true);
    try {
      const userToken = localStorage.getItem("user");

      const requests = validRecords.map((row) => {
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

      const failedRecords = responseData.filter(
        (item) => item.articleExist.status.statusCode === -1
      );

      const responseMap = responseData.map((item) => {
        const socialFeedId = item.articleExist.processStatus.socialFeedId;
        const message = item.articleExist.processStatus.message;
        const link = item.link;
        const statusFlag = item.articleExist.processStatus.processStatusCode;

        return {
          link,
          socialFeedId,
          message,
          statusFlag,
        };
      });

      const finalUpdatedGridData = updatedGridData.map((row) => {
        const responseEntry = responseMap.find(
          (entry) => entry.link === row.Link
        );

        const status = responseEntry ? responseEntry.message : row.status;
        const statusFlag = responseEntry && responseEntry.statusFlag;

        const socialFeedId = responseEntry
          ? responseEntry.socialFeedId
          : row.socialFeedId;

        return {
          ...row,
          status,
          statusFlag,
          ...(socialFeedId && { SocialFeedId: socialFeedId }),
        };
      });

      setGridData(finalUpdatedGridData);
      setSelectedRows([]);
      setSelectionModal([]);
      if (failedRecords.length) {
        toast.info(`${failedRecords.length} record are getting error.`);
      }
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
        (i) => i.statusFlag === "NU"
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
      4;
      const processResponseData = responses.map((i) => i.data.response);

      const failedRecords = processResponseData.filter(
        (item) => item.status.statusCode === -1
      );

      let updatedGridData = gridData.map((row) => {
        const matchedProcessData = processResponseData.find(
          (item) => item.processStatus.link === row.Link
        );

        if (matchedProcessData) {
          return {
            ...row,
            status: matchedProcessData.processStatus.message,
            socialFeedId: matchedProcessData.processStatus.socialFeedId,
            statusFlag: matchedProcessData.processStatus.processStatusCode,
          };
        }

        return row;
      });

      setGridData(updatedGridData);
      if (failedRecords.length) {
        toast.info(`${failedRecords.length} record are getting error.`);
      }
      if (processResponseData.length) {
        toast.info("Success", { autoClose: 5000 });
        setSelectedRows([]);
        setSelectionModal([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setProcessLoading(false);
    }
  };

  const handleBypassScrapping = async () => {
    try {
      setBypassScrapLoading(true);
      const validRowsForBypass =
        selectedRows.filter((item) => item.statusFlag === "SE") || [];
      if (!validRowsForBypass.length) {
        toast.warning("No rows found to bypass");
        return;
      }
      const requests = validRowsForBypass.map((row) => {
        const {
          Link,
          Date: dateStr,
          Headline,
          summary,
          Language,
          CompanyID,
        } = row;
        const parsedDate = parse(dateStr, "dd-MMM-yy", new Date());
        const formattedDate = format(parsedDate, "yyyy-MM-dd");
        const requestData = {
          link: Link,
          date: formattedDate,
          headline: Headline,
          summary: summary,
          language: Language,
          companyId: CompanyID,
        };
        const userToken = localStorage.getItem("user");
        const result = axios.post(
          `${url}insertUnscrappedSocialFeed/`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        return result;
      });
      const responses = await Promise.all(requests);
      const processResponseData = responses.map((item) => item.data);
      const failedRecords = processResponseData.filter(
        (item) => item.result.status.statusCode === -1
      );

      let updatedGridData = gridData.map((row) => {
        const matchedProcessData = processResponseData.find(
          (item) => item.result.processStatus.link === row.Link
        );

        if (matchedProcessData) {
          return {
            ...row,
            status: matchedProcessData.result.processStatus.message,
            socialFeedId: matchedProcessData.result.processStatus.socialFeedId,
            statusFlag:
              matchedProcessData.result.processStatus.processStatusCode,
          };
        }

        return row;
      });

      setGridData(updatedGridData);

      if (failedRecords.length) {
        toast.info(`${failedRecords.length} record are getting error.`);
      } else {
        setSelectedRows([]);
        setSelectionModal([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBypassScrapLoading(false);
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
        {buttonPermission.bypassScrap === "Yes" && (
          <Button
            size="small"
            variant="outlined"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
            onClick={handleBypassScrapping}
          >
            {bypassScrapLoading && <CircularProgress size={"1em"} />}
            Bypass Scrapping
          </Button>
        )}
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
  buttonPermission: PropTypes.object,
};

export default UploadControl;
