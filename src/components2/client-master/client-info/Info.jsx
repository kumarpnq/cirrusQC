import { Box, Divider, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import YesOrNo from "../../../@core/YesOrNo";
import PropTypes from "prop-types";
import axiosInstance from "../../../../axiosConfig";
import toast from "react-hot-toast";
import ComponentsHeader from "../ComponentsHeader";

const Info = ({
  StyledWrapper,
  StyledText,
  classes,
  clientId,
  setGlobalTabValue,
}) => {
  const [bulkMailer, setBulkMailer] = useState("");
  const [summary, setSummary] = useState("");
  const [allowTagging, setAllowTagging] = useState("");
  const [allowTonality, setAllowTonality] = useState("");
  const [onlineRefresh, setOnlineRefresh] = useState("");
  const [allPermissionOnline, setAllPermissionOnline] = useState("");
  const [mailerMissingAlert, setMailerMissingAlert] = useState("");
  const [AllowSearchablePDF, setAllowSearchablePDF] = useState("");
  const [excelExport, setExcelExport] = useState("");
  const [active, setActive] = useState("");
  const [screenPermission, setScreenPermission] = useState([]);

  // * comparison states
  const [clientInfo, setClientInfo] = useState(null);
  const [mailerInfo, setMailerInfo] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchInfo = async () => {
    try {
      const response = await axiosInstance.get(
        `clientPermissions/?clientId=${clientId}`
      );
      const localClientInfo = response.data.data.data.clientInfo;
      const localMailerInfo = response.data.data.data.mailerInfo;
      setClientInfo(localClientInfo);
      setActive(localClientInfo?.isActive);
      setMailerInfo(localMailerInfo);
      setAllowTagging(localMailerInfo?.allowTags);
      setBulkMailer(localMailerInfo?.bulkMailer);
      setSummary(localMailerInfo?.hasSummary);
      setOnlineRefresh(localMailerInfo?.allowRefresh);
      setAllPermissionOnline(localMailerInfo?.allPermissionOnline);
      setMailerMissingAlert(localMailerInfo?.mailerMissingAlert);
      setAllowSearchablePDF(localMailerInfo?.searchablePdf);
      setExcelExport(localMailerInfo?.allowExport);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  useEffect(() => {
    fetchInfo();
  }, []);

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      const requestData = {
        clientId,
      };
      const clientInfoLocal = {};
      if (clientInfo?.isActive !== active) clientInfoLocal.isActive = active;
      if (Object.keys(clientInfoLocal).length) {
        requestData.clientInfo = clientInfoLocal;
      }
      const mailerInfoLocal = {};
      if (mailerInfo?.allowTags !== allowTagging)
        mailerInfoLocal.allowTags = allowTagging;
      if (mailerInfo?.bulkMailer !== bulkMailer)
        mailerInfoLocal.bulkMailer = bulkMailer;
      if (mailerInfo?.hasSummary !== summary)
        mailerInfoLocal.hasSummary = summary;
      if (mailerInfo?.allowRefresh !== onlineRefresh)
        mailerInfoLocal.allowRefresh = onlineRefresh;
      if (mailerInfo?.allPermissionOnline !== allPermissionOnline)
        mailerInfoLocal.allPermissionOnline = allPermissionOnline;
      if (mailerInfo?.mailerMissingAlert !== mailerMissingAlert)
        mailerInfoLocal.mailerMissingAlert = mailerMissingAlert;
      if (mailerInfo?.searchablePdf !== AllowSearchablePDF)
        mailerInfoLocal.searchablePdf = AllowSearchablePDF;
      if (mailerInfo?.allowExport !== excelExport)
        mailerInfoLocal.allowExport = excelExport;
      if (Object.keys(mailerInfoLocal).length) {
        requestData.mailerInfo = mailerInfoLocal;
      }
      const response = await axiosInstance.post(
        `updateClientSettings/`,
        requestData
      );
      if (response.status === 200) {
        toast.success(response.data.status.message);
        setGlobalTabValue(1);
        fetchInfo();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid #ddd",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box sx={{ width: 600 }}>
        <ComponentsHeader
          title="Mailer Settings"
          loading={updateLoading}
          onSave={handleUpdate}
        />
      </Box>

      <Box sx={{ border: "1px solid #DDD", width: 600 }}>
        <StyledWrapper>
          <StyledText>Bulk Mailer : </StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              { id: "Y", name: "Yes" },
              { id: "N", name: "No" },
            ]}
            isYN
            keyId={"id"}
            keyName={"name"}
            placeholder="Bulk Mailer"
            value={bulkMailer}
            setValue={setBulkMailer}
            // width={150}
          />
        </StyledWrapper>
        <Divider />
        <StyledWrapper>
          <StyledText>Summary : </StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              { id: "H", name: "Normal" },
              { id: "C", name: "CompanyWise" },
              { id: "N", name: "No" },
            ]}
            isYN
            keyId={"id"}
            keyName={"name"}
            placeholder="Summary"
            value={summary}
            setValue={setSummary}
            // width={150}
          />
        </StyledWrapper>
        <Divider />
        <StyledWrapper>
          <StyledText>Allow Tagging : </StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              { id: "Y", name: "Yes" },
              { id: "N", name: "No" },
            ]}
            isYN
            keyId={"id"}
            keyName={"name"}
            placeholder="Tagging"
            value={allowTagging}
            setValue={setAllowTagging}
            // width={150}
          />
        </StyledWrapper>
        <Divider />
        <StyledWrapper>
          <StyledText>Allow Tonality : </StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              { id: "Y", name: "Yes" },
              { id: "N", name: "No" },
            ]}
            isYN
            keyId={"id"}
            keyName={"name"}
            placeholder="Tonality"
            value={allowTonality}
            setValue={setAllowTonality}
            // width={150}
          />
        </StyledWrapper>
        <Divider />
        <StyledWrapper>
          <StyledText>Online Refresh : </StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              { id: "Y", name: "Yes" },
              { id: "N", name: "No" },
            ]}
            isYN
            keyId={"id"}
            keyName={"name"}
            placeholder="Refresh"
            value={onlineRefresh}
            setValue={setOnlineRefresh}
            // width={150}
          />
        </StyledWrapper>
        <Divider />
        <StyledWrapper>
          <StyledText>All Permission Online :</StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              { id: "Y", name: "Yes" },
              { id: "N", name: "No" },
            ]}
            isYN
            keyId={"id"}
            keyName={"name"}
            placeholder="Permission"
            value={allPermissionOnline}
            setValue={setAllPermissionOnline}
            // width={150}
          />
        </StyledWrapper>
        <Divider />
        <StyledWrapper>
          <StyledText>Mailer Missing Alert :</StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              { id: "Y", name: "Yes" },
              { id: "N", name: "No" },
            ]}
            isYN
            keyId={"id"}
            keyName={"name"}
            placeholder="Alert"
            value={mailerMissingAlert}
            setValue={setMailerMissingAlert}
            // width={150}
          />
        </StyledWrapper>
        <Divider />
        <StyledWrapper>
          <StyledText>Allow Searchable PDF :</StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              { id: "Y", name: "Yes" },
              { id: "N", name: "No" },
            ]}
            isYN
            keyId={"id"}
            keyName={"name"}
            placeholder="PDF"
            value={AllowSearchablePDF}
            setValue={setAllowSearchablePDF}
            // width={150}
          />
        </StyledWrapper>
        <Divider />
        <StyledWrapper>
          <StyledText>Excel Export :</StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              { id: "D", name: "Default" },
              { id: "N", name: "No Access" },
              { id: "F", name: "Full Access" },
            ]}
            isYN
            keyId={"id"}
            keyName={"name"}
            placeholder="Export"
            value={excelExport}
            setValue={setExcelExport}
            // width={150}
          />
        </StyledWrapper>
        <Divider />
        <StyledWrapper>
          <StyledText>Active :</StyledText>
          <YesOrNo
            classes={classes}
            mapValue={[
              { id: "Y", name: "Yes" },
              { id: "N", name: "No" },
            ]}
            isYN
            keyId={"id"}
            keyName={"name"}
            placeholder="Active"
            value={active}
            setValue={setActive}
            // width={150}
          />
        </StyledWrapper>
        <StyledWrapper>
          <StyledText>Screen Permission :</StyledText>
          <Select
            value={screenPermission}
            onChange={(e) => setScreenPermission(e.target.value)}
            multiple
            fullWidth
            sx={{ height: 25, fontSize: "0.9em" }}
          >
            <MenuItem value="online" sx={{ fontSize: "0.9em" }}>
              Online
            </MenuItem>
            <MenuItem value="print" sx={{ fontSize: "0.9em" }}>
              Print
            </MenuItem>
            <MenuItem value="both" sx={{ fontSize: "0.9em" }}>
              Both
            </MenuItem>
          </Select>
        </StyledWrapper>
      </Box>
    </Box>
  );
};

Info.propTypes = {
  StyledWrapper: PropTypes.elementType.isRequired,
  StyledText: PropTypes.elementType.isRequired,
  classes: PropTypes.object.isRequired,
  setGlobalTabValue: PropTypes.func,
};
export default Info;
