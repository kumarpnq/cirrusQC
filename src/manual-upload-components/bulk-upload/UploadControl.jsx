import { Box, Button, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../axiosConfigOra";

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

    setCheckLoading(true);
    try {
      const requests = selectedRows.map((row) => {
        const { Link, Date: dateStr, CompanyID } = row;

        return axiosInstance.get(`checkSocialFeedExist/`, {
          params: { url: Link, date: dateStr, companyIds: CompanyID },
        });
      });

      const responses = await Promise.all(requests);
      const responseData = responses.map((i) => i.data);

      const failedRecords = responseData.filter(
        (item) => item.articleExist?.status?.statusCode === -1
      );

      const responseMap = responseData.map((item) => {
        const socialFeedId =
          item.articleExist?.status?.statusCode === -1
            ? ""
            : item.articleExist?.processStatus?.socialFeedId;
        const message =
          item.articleExist?.status?.statusCode === -1
            ? item.articleExist?.status?.message
            : item.articleExist?.processStatus?.message || "";
        const link = item.link;
        const statusFlag =
          item.articleExist?.status?.statusCode === -1
            ? ""
            : item.articleExist?.processStatus?.processStatusCode || "";
        const otherCompanies =
          item.articleExist?.status?.statusCode === -1
            ? []
            : item.articleExist?.processStatus?.otherCompanies || [];
        const newCompanies =
          item.articleExist?.status?.statusCode === -1
            ? []
            : item.articleExist?.processStatus?.newCompanies || [];

        return {
          link,
          socialFeedId,
          message,
          statusFlag,
          otherCompanies,
          newCompanies,
        };
      });

      const finalUpdatedGridData = gridData.map((row) => {
        const responseEntry = responseMap.find(
          (entry) => entry.link === row.Link
        );

        const status = responseEntry ? responseEntry.message : row?.status;
        const statusFlag =
          (responseEntry && responseEntry.statusFlag) || row.statusFlag;
        const otherCompanies =
          (responseEntry && responseEntry.otherCompanies) || row.otherCompanies;
        const newCompanies =
          (responseEntry && responseEntry.newCompanies) || row.newCompanies;

        const socialFeedId = responseEntry
          ? responseEntry.socialFeedId
          : row.socialFeedId;

        return {
          ...row,
          status,
          statusFlag,
          otherCompanies,
          newCompanies,
          ...(socialFeedId && { SocialFeedId: socialFeedId }),
        };
      });

      setGridData(finalUpdatedGridData);
      setSelectedRows([]);
      setSelectionModal([]);
      if (failedRecords.length) {
        toast.error(`${failedRecords[0]?.articleExist?.status?.message}`);
      }
    } catch (error) {
      toast.error("Error checking records:", error.message);
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

      const requests = validRowsForProcess.map((row) => {
        const { Link, Date: dateStr, CompanyID } = row;

        const request_data = {
          url: Link,
          date: dateStr,
          // company_ids: CompanyID,
        };
        if (CompanyID) {
          request_data.company_ids = CompanyID;
        }
        return axiosInstance.post(`processBulkUpload/`, request_data);
      });
      const responses = await Promise.all(requests);
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
            SocialFeedId: matchedProcessData.processStatus.socialFeedId,
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
      toast.error("Error Processing records:", error.message);
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

        const requestData = {
          link: Link,
          date: dateStr,
          headline: Headline,
          summary: summary,
          language: Language,
          companyIds: CompanyID,
        };

        const result = axiosInstance.post(
          `insertUnscrappedSocialFeed/`,
          requestData
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
            SocialFeedId: matchedProcessData.result.processStatus.socialFeedId,
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
      toast.error("Error bypassing records:", error.message);
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
