import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  Switch,
  FormControl,
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";
import { useEffect, useState } from "react";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import { toast } from "react-toastify";
import axiosInstance from "../../../axiosConfig";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";

const StyledItemWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 1,
  marginTop: 4,
});
const StyledText = styled(Typography)({
  color: "GrayText",
  textWrap: "nowrap",
  width: 150,
  fontSize: "1em",
});

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const YesNoSwitchWrapper = styled(Box)(({ _ }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: 120,
  padding: "10px 20px",
  borderRadius: 20,
}));

const CustomSwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase": {
    "&.Mui-checked": {
      color: theme.palette.success.main,
    },
    "& + .MuiSwitch-track": {
      backgroundColor: theme.palette.error.light,
    },
    "&.Mui-checked + .MuiSwitch-track": {
      backgroundColor: theme.palette.success.light,
    },
  },
  "& .MuiSwitch-thumb": {
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 20,
  },
}));

const timeStampData = [
  { id: "00:00", timestamp: "00:00" },
  { id: "00:30", timestamp: "00:30" },
  { id: "01:00", timestamp: "01:00" },
  { id: "01:30", timestamp: "01:30" },
  { id: "02:00", timestamp: "02:00" },
  { id: "02:30", timestamp: "02:30" },
  { id: "03:00", timestamp: "03:00" },
  { id: "03:30", timestamp: "03:30" },
  { id: "04:00", timestamp: "04:00" },
  { id: "04:30", timestamp: "04:30" },
  { id: "05:00", timestamp: "05:00" },
  { id: "05:30", timestamp: "05:30" },
  { id: "06:00", timestamp: "06:00" },
  { id: "06:30", timestamp: "06:30" },
  { id: "07:00", timestamp: "07:00" },
  { id: "07:30", timestamp: "07:30" },
  { id: "08:00", timestamp: "08:00" },
  { id: "08:30", timestamp: "08:30" },
  { id: "09:00", timestamp: "09:00" },
  { id: "09:30", timestamp: "09:30" },
  { id: "10:00", timestamp: "10:00" },
  { id: "10:30", timestamp: "10:30" },
  { id: "11:00", timestamp: "11:00" },
  { id: "11:30", timestamp: "11:30" },
  { id: "12:00", timestamp: "12:00" },
  { id: "12:30", timestamp: "12:30" },
  { id: "13:00", timestamp: "13:00" },
  { id: "13:30", timestamp: "13:30" },
  { id: "14:00", timestamp: "14:00" },
  { id: "14:30", timestamp: "14:30" },
  { id: "15:00", timestamp: "15:00" },
  { id: "15:30", timestamp: "15:30" },
  { id: "16:00", timestamp: "16:00" },
  { id: "16:30", timestamp: "16:30" },
  { id: "17:00", timestamp: "17:00" },
  { id: "17:30", timestamp: "17:30" },
  { id: "18:00", timestamp: "18:00" },
  { id: "18:30", timestamp: "18:30" },
  { id: "19:00", timestamp: "19:00" },
  { id: "19:30", timestamp: "19:30" },
  { id: "20:00", timestamp: "20:00" },
  { id: "20:30", timestamp: "20:30" },
  { id: "21:00", timestamp: "21:00" },
  { id: "21:30", timestamp: "21:30" },
  { id: "22:00", timestamp: "22:00" },
  { id: "22:30", timestamp: "22:30" },
  { id: "23:00", timestamp: "23:00" },
  { id: "23:30", timestamp: "23:30" },
];

const EditDialog = ({
  open,
  handleClose,
  row,
  openedFromWhere,
  handleFetch,
  clientIds,
}) => {
  const classes = useStyle();

  const [screenTypeDD, setScreenTypeDD] = useState("print");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [every, setEvery] = useState("Daily");
  const [timeStamps, setTimeStamps] = useState([]);
  const [report, setReport] = useState({
    sendReport: false,
    lastReport: false,
  });
  const [active, setActive] = useState(true);
  const [initialState, setInitialState] = useState(null);
  const [login, setLogin] = useState("");
  const [loginNames, setLoginNames] = useState([]);
  const [modifiedData, setModifiedData] = useState([]);
  const [insertStatus, setInsertStatus] = useState([
    {
      entityType: "print",
      // companyIds: [],
      // isSendReport: false,
      // isIncludeReport: false,
      slots: [],
      loginName: "",
      frequency: "Daily",
      updateType: "I",
    },
    {
      entityType: "online",
      // companyIds: [],
      // isSendReport: false,
      // isIncludeReport: false,
      slots: [],
      loginName: "",
      frequency: "Daily",
      updateType: "I",
    },
    {
      entityType: "both",
      // companyIds: [],
      // isSendReport: false,
      // isIncludeReport: false,
      slots: [],
      loginName: "",
      frequency: "Daily",
      updateType: "I",
    },
  ]);

  function boolToYesNo(value) {
    return value ? "Yes" : "No";
  }
  function yesNoToBool(value) {
    return value === "Yes";
  }

  useEffect(() => {
    const fetchLoginDetail = async () => {
      try {
        const response = await axiosInstance.get(
          `getusersforclient/?clientId=${row?.id || selectedClient}`
        );

        setLoginNames(response.data.loginNames || []);
      } catch (error) {
        console.log(error.message);
      }
    };
    if (open) {
      fetchLoginDetail();
    }
  }, [open, row?.id, selectedClient]);

  useEffect(() => {
    if (open && openedFromWhere === "edit") {
      const modifiedScreenData = modifiedData?.[screenTypeDD];

      const filteredCompanies =
        row?.scheduledCompanies
          ?.filter((company) => company.isActive)
          .map((company) => company.companyId) || [];

      const timeStamps = modifiedScreenData?.slotUpdates?.length
        ? modifiedScreenData.slotUpdates
            .filter((slot) => slot.isActive)
            .map((slot) => slot.time)
        : row?.schedule
            ?.filter(
              (scheduleItem) =>
                scheduleItem.isActive &&
                scheduleItem.entityType === screenTypeDD &&
                scheduleItem.loginName === login
            )
            .map((scheduleItem) => scheduleItem.time) || [];

      const newInitialData = {
        selectedClient: row?.id,
        selectedCompany: modifiedScreenData?.companyUpdates?.length
          ? modifiedScreenData.companyUpdates.map(
              (company) => company.companyId
            )
          : filteredCompanies,
        active: yesNoToBool(row?.active),
        every: row.schedule[0]?.isDayOrMonth || "Daily",
        loginName: login || row?.schedule[0]?.loginName,
        timeStamps: timeStamps,
        report: {
          sendReport: yesNoToBool(row?.sendReport),
          lastReport: yesNoToBool(row?.lastReport),
        },
      };

      setInitialState(newInitialData);

      const hasChanges =
        JSON.stringify(newInitialData) !== JSON.stringify(initialState);

      if (hasChanges) {
        setSelectedClient(newInitialData.selectedClient);
        setSelectedCompany(newInitialData.selectedCompany);
        setActive(newInitialData.active);
        setEvery(newInitialData.every);
        setTimeStamps(newInitialData.timeStamps);
        setReport(newInitialData.report);
        setLogin(newInitialData.loginName);
      } else {
        if (initialState) {
          setSelectedClient(initialState.selectedClient || row?.id);
          setSelectedCompany(initialState.selectedCompany || filteredCompanies);
          setActive(initialState.active || yesNoToBool(row?.active));
          setEvery(
            initialState.every || row.schedule[0]?.isDayOrMonth || "Daily"
          );
          setTimeStamps(initialState.timeStamps || timeStamps);
          setReport(
            initialState.report || {
              sendReport: yesNoToBool(row?.sendReport),
              lastReport: yesNoToBool(row?.lastReport),
            }
          );
        }
      }
    }
  }, [open, openedFromWhere, row, screenTypeDD, login]);

  // * save the changes in state
  useEffect(() => {
    const detectChanges = () => {
      if (!initialState) return;

      // Filter removed and added companies
      const removedCompanies = initialState.selectedCompany.filter(
        (companyId) => !selectedCompany.includes(companyId)
      );
      const addedCompanies = selectedCompany.filter(
        (companyId) => !initialState.selectedCompany.includes(companyId)
      );

      // Filter removed and added time slots
      const removedSlots = initialState.timeStamps?.filter(
        (stamp) => !timeStamps.includes(stamp)
      );
      const addedSlots = timeStamps.filter(
        (stamp) => !initialState.timeStamps.includes(stamp)
      );

      // Prepare company updates
      const companyUpdates = [
        ...removedCompanies.map((companyId) => ({
          companyId,
          isActive: false,
        })),
        ...addedCompanies.map((companyId) => ({
          companyId,
          isActive: true,
        })),
      ];

      // Prepare slot updates
      const slotUpdates = [
        ...removedSlots.map((time) => ({
          time,
          isActive: false,
        })),
        ...addedSlots.map((time) => ({
          time,
          isActive: true,
        })),
      ];

      const hasCompanyChanges = companyUpdates.length > 0;
      const hasSlotChanges = slotUpdates.length > 0;

      // Update only if there are actual changes
      if (hasCompanyChanges || hasSlotChanges) {
        setModifiedData((prevData) => ({
          ...prevData,
          [screenTypeDD]: {
            ...prevData[screenTypeDD], // Retain any existing data for this screen
            companyUpdates: hasCompanyChanges
              ? companyUpdates
              : prevData[screenTypeDD]?.companyUpdates || [],
            slotUpdates: hasSlotChanges
              ? slotUpdates
              : prevData[screenTypeDD]?.slotUpdates || [],
          },
        }));
      }
    };
    detectChanges();
  }, [selectedCompany, timeStamps, screenTypeDD, initialState]);

  // * insert status
  useEffect(() => {
    if (open && openedFromWhere === "add") {
      setInsertStatus((prevInsertStatus) => {
        let updatedInsertStatus = [...prevInsertStatus];

        const createEntityStatus = (entityType) => ({
          entityType,
          companyIds: selectedCompany,
          isSendReport: report.sendReport,
          isIncludeReport: report.lastReport,
          slots: timeStamps,
          loginName: login,
          frequency: every || "Daily",
          updateType: "I",
        });

        const updateEntityStatus = (entityType) => {
          const existingIndex = updatedInsertStatus.findIndex(
            (status) => status.entityType === entityType
          );
          if (existingIndex !== -1) {
            updatedInsertStatus[existingIndex] = createEntityStatus(entityType);
          } else {
            updatedInsertStatus.push(createEntityStatus(entityType));
          }
        };

        // Handle "print"
        if (screenTypeDD === "print") {
          updateEntityStatus("print");
        }

        // Handle "online"
        if (screenTypeDD === "online") {
          updateEntityStatus("online");
        }

        // Handle "both"
        if (screenTypeDD === "both") {
          updateEntityStatus("both");
        }

        return updatedInsertStatus;
      });
    }
  }, [
    open,
    openedFromWhere,
    screenTypeDD,
    selectedCompany,
    report,
    timeStamps,
    every,
  ]);

  useEffect(() => {
    if (insertStatus.length > 0 && openedFromWhere === "add") {
      const currentEntity = insertStatus.find(
        (status) => status.entityType === screenTypeDD
      );

      if (currentEntity) {
        // if (
        //   selectedCompany.length !== currentEntity.companyIds.length ||
        //   !selectedCompany.every(
        //     (id, index) => id === currentEntity.companyIds[index]
        //   )
        // ) {
        //   setSelectedCompany(currentEntity.companyIds || []);
        // }

        // if (
        //   report.sendReport !== currentEntity.isSendReport ||
        //   report.lastReport !== currentEntity.isIncludeReport
        // ) {
        //   setReport({
        //     sendReport: currentEntity.isSendReport,
        //     lastReport: currentEntity.isIncludeReport,
        //   });
        // }

        if (
          timeStamps.length !== currentEntity.slots.length ||
          !timeStamps.every(
            (time, index) => time === currentEntity.slots[index]
          )
        ) {
          setTimeStamps(currentEntity.slots || []);
        }

        if (every !== currentEntity.frequency) {
          setEvery(currentEntity.frequency || "Daily");
        }

        if (login !== currentEntity.loginName) {
          setLogin(currentEntity.loginName || "");
        }
      }
    }
  }, [screenTypeDD]);

  const handleCheckboxChange = (event) => {
    setActive(event.target.checked);
  };

  const handleChange = (event, newValue) => {
    if (modifiedData?.length || Object.keys(modifiedData)?.length) {
      toast.warn("Please save the changes first.");
      return;
    }
    setScreenTypeDD(newValue);
  };

  // Fetching data
  const { data: clientData } = useFetchData(`${url}clientlist/`);
  const { data: companyData } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : ""
  );

  const [updateLoading, setUpdateLoading] = useState(false);
  const [insertLoading, setInsertLoading] = useState(false);

  const handleSave = async () => {
    try {
      setUpdateLoading(true);

      const removedSlots = initialState?.timeStamps?.filter(
        (stamp) => !timeStamps.includes(stamp)
      );

      const addedSlots = timeStamps.filter(
        (stamp) => !initialState.timeStamps.includes(stamp)
      );

      const hasSlotChanges = removedSlots.length > 0 || addedSlots.length > 0;

      const requestData = {
        clientId: selectedClient,
        // companyIds: [{ companyId: "", isActive: "" }],
        // isSendReport: "",
        // isIncludeReport: "",
        // isActive: "",
        // entityType: "",
        // slots: [{ time: "", isActive: "" }],
        // frequency: "",
        updateType: "U",
      };
      // if (hasCompanyChanges) {
      //   requestData.companyIds = companyUpdates;
      // }
      // if (hasSlotChanges) {
      //   requestData.slots = slotUpdates;
      // }
      if (initialState?.report?.sendReport !== report.sendReport) {
        requestData.isSendReport = boolToYesNo(report.sendReport);
      }
      if (initialState?.report?.lastReport !== report.lastReport) {
        requestData.isIncludeReport = boolToYesNo(report.sendReport);
      }
      if (initialState.active !== active) {
        requestData.isActive = boolToYesNo(active);
      }

      // if (screenTypeDD) {
      //   requestData.entityType = screenTypeDD;
      // }
      if (initialState.every !== every || hasSlotChanges) {
        requestData.frequency = every;
      }

      const data = Object.keys(modifiedData)
        .map((item) => {
          const slotUpdates = modifiedData[item]?.slotUpdates;
          const companyUpdates = modifiedData[item]?.companyUpdates;

          if (slotUpdates && slotUpdates.length > 0) {
            return {
              ...requestData,
              entityType: item,
              loginName: login,
              slots: slotUpdates,
              ...(companyUpdates &&
                companyUpdates.length > 0 && { companyIds: companyUpdates }),
            };
          } else if (companyUpdates && companyUpdates.length > 0) {
            return {
              ...requestData,
              entityType: item,
              loginName: login,
              ...(companyUpdates &&
                companyUpdates.length > 0 && { companyIds: companyUpdates }),
            };
          }

          return null;
        })
        .filter(Boolean);

      const requestDataInDict = {
        data,
      };

      const response = await axiosInstance.post(
        `updateMailerScheduler`,
        requestDataInDict
      );

      if (response.data.scheduleData?.success?.length) {
        setModifiedData([]);
        handleClose();
        handleFetch();
        toast.info(
          ` ${response.data.scheduleData?.success?.length} Schedule updated successfully`
        );
      } else {
        toast.info(
          ` ${response.data.scheduleData?.error?.length} Schedule not updated.`
        );
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInsert = async () => {
    try {
      setInsertLoading(true);
      const client = await clientData.data.clients.find(
        (client) => client.clientid === selectedClient
      );

      if (!client) {
        toast.error("Selected client not found.");
        setInsertLoading(false);
        return;
      }

      // Filter out objects that have any missing fields
      const preparedData = insertStatus
        .map((item) => ({
          ...item,
          clientId: client.clientid,
          clientName: client.clientname,
        }))
        .filter((item) => {
          const isValid =
            item.entityType &&
            item.companyIds?.length > 0 &&
            item.slots?.length > 0 &&
            item.loginName &&
            item.frequency &&
            item.updateType &&
            item.clientId &&
            item.clientName;

          // Warn for any invalid item being removed
          if (!isValid) {
            console.log(`Removed an entry due to missing fields.`);
          }

          return isValid;
        });

      if (!preparedData.length) {
        toast.error(
          "No valid entries to insert. All were removed due to missing fields."
        );
        setInsertLoading(false);
        return;
      }

      const requestData = {
        data: preparedData,
      };

      const response = await axiosInstance.post(
        `updateMailerScheduler/`,
        requestData
      );

      if (response.data.scheduleData?.success?.length) {
        setInsertStatus([
          [
            {
              entityType: "print",
              // companyIds: [],
              // isSendReport: false,
              // isIncludeReport: false,
              slots: [],
              loginName: "",
              frequency: "Daily",
              updateType: "I",
            },
            {
              entityType: "online",
              // companyIds: [],
              // isSendReport: false,
              // isIncludeReport: false,
              slots: [],
              loginName: "",
              frequency: "Daily",
              updateType: "I",
            },
            {
              entityType: "both",
              // companyIds: [],
              // isSendReport: false,
              // isIncludeReport: false,
              slots: [],
              loginName: "",
              frequency: "Daily",
              updateType: "I",
            },
          ],
        ]);
        setScreenTypeDD("print");
        setSelectedClient("");
        setSelectedCompany([]);
        setEvery("Daily");
        setTimeStamps([]);
        setReport({
          sendReport: false,
          lastReport: false,
        });
        setLogin("");

        handleClose();
        handleFetch();
        toast.info(`${response.data.scheduleData?.success?.[0]?.status}`);
      } else {
        toast.info(`${response.data.scheduleData?.error?.[0]?.status}`);
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong.");
    } finally {
      setInsertLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
        setModifiedData([]);
      }}
      maxWidth="md"
      sx={{ "& .MuiDialog-paper": { height: "90vh" } }}
    >
      <DialogTitle fontSize={"1em"}>
        {openedFromWhere === "add" ? "Add" : "Edit"} Item
      </DialogTitle>
      <DialogContent
        sx={{ border: "1px solid #D3D3D3", margin: 2, borderRadius: "3px" }}
      >
        {openedFromWhere === "add" && (
          <Typography
            variant="body2"
            color={"GrayText"}
            fontSize={"0.7em"}
            textAlign={"right"}
          >
            *All fields are required.
          </Typography>
        )}

        <StyledItemWrapper>
          <StyledText>Client:</StyledText>
          <FormControl>
            <Select
              disabled={openedFromWhere === "edit"}
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className={`${classes.dropDowns} w-[278px]`}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{ fontSize: "0.8em" }}
            >
              <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
                <em>Client</em>
              </MenuItem>
              {clientData?.data?.clients?.map((client) => (
                <MenuItem
                  key={client.clientid}
                  value={client.clientid}
                  sx={{ fontSize: "0.8em", opacity: 0.7 }}
                  disabled={
                    openedFromWhere === "add" &&
                    clientIds.includes(client.clientid)
                  }
                >
                  {client.clientname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </StyledItemWrapper>
        <StyledItemWrapper>
          <StyledText>Company:</StyledText>
          <CustomMultiSelect
            title="Company"
            dropdownWidth={278}
            dropdownToggleWidth={278}
            keyId="companyid"
            keyName="companyname"
            options={companyData?.data?.companies || []}
            selectedItems={selectedCompany}
            setSelectedItems={setSelectedCompany}
            isIncreased={false}
          />
        </StyledItemWrapper>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography width={150}>
            Send report even if no new results were found:
          </Typography>
          <YesNoSwitchWrapper>
            {/* Yes/No labels */}
            <CustomSwitch
              checked={report.sendReport}
              onChange={(e) =>
                setReport((prev) => ({ ...prev, sendReport: e.target.checked }))
              }
            />
          </YesNoSwitchWrapper>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography width={150}>
            Only include new results since last report:
          </Typography>
          <YesNoSwitchWrapper>
            <CustomSwitch
              checked={report.lastReport}
              onChange={(e) =>
                setReport((prev) => ({ ...prev, lastReport: e.target.checked }))
              }
            />
          </YesNoSwitchWrapper>
        </Box>

        <Box sx={{ width: "100%" }}>
          <Tabs
            value={screenTypeDD}
            onChange={handleChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            aria-label="small tabs"
            sx={{ minHeight: "32px" }}
          >
            <Tab
              label="Print"
              value="print"
              sx={{ minHeight: "32px", fontSize: "0.8rem" }}
            />
            <Tab
              label="Online"
              value="online"
              sx={{ minHeight: "32px", fontSize: "0.8rem" }}
            />
            <Tab
              label="Both"
              value="both"
              sx={{ minHeight: "32px", fontSize: "0.8rem" }}
            />
          </Tabs>
        </Box>
        <StyledItemWrapper>
          <StyledText>Login : </StyledText>
          <CustomSingleSelect
            dropdownToggleWidth={278}
            dropdownWidth={278}
            keyId="loginName"
            keyName="loginName"
            options={loginNames}
            selectedItem={login}
            setSelectedItem={setLogin}
            title="Login"
          />
        </StyledItemWrapper>
        <StyledItemWrapper>
          <StyledText>Send Report Every:</StyledText>
          <Box>
            <YesOrNo
              classes={classes}
              mapValue={["Daily"]}
              placeholder="Every"
              value={every}
              setValue={setEvery}
              width={278}
            />
            <div className="mt-1">
              <CustomMultiSelect
                title="Time stamp"
                dropdownWidth={278}
                dropdownToggleWidth={278}
                keyId="id"
                keyName="timestamp"
                options={timeStampData}
                selectedItems={timeStamps}
                setSelectedItems={setTimeStamps}
                isIncreased={false}
              />
            </div>
          </Box>
        </StyledItemWrapper>

        <Divider sx={{ my: 1 }} />
        {openedFromWhere === "edit" && (
          <StyledItemWrapper>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={active}
                    onChange={handleCheckboxChange}
                    color="primary"
                  />
                }
                label="Active"
              />
            </FormControl>
          </StyledItemWrapper>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
            setModifiedData([]);
          }}
          size="small"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={openedFromWhere === "edit" ? handleSave : handleInsert}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {insertLoading ||
            (updateLoading && <CircularProgress size={"1em"} />)}{" "}
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  openedFromWhere: PropTypes.string.isRequired,
  row: PropTypes.object,
  handleFetch: PropTypes.func,
  clientIds: PropTypes.array,
};

export default EditDialog;
