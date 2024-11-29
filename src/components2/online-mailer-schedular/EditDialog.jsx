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
import { useEffect, useLayoutEffect, useState } from "react";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import { toast } from "react-toastify";
import axiosInstance from "../../../axiosConfig";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import { weeklyDays } from "../../constants/dataArray";
const StyledItemWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5), // Using theme spacing for gap
  marginTop: theme.spacing(0.5), // Using theme spacing for margin top
  padding: theme.spacing(0.5), // Adding padding for better spacing
  border: `1px solid ${theme.palette.primary.main}`, // Adding a border using theme primary color
  borderRadius: theme.shape.borderRadius, // Adding border-radius from theme

  // Adding hover styles
  "&:hover": {
    backgroundColor: "#ddd", // Change background on hover
    borderColor: theme.palette.primary.dark, // Darken the border color on hover
    cursor: "pointer", // Change the cursor to pointer
  },
}));
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
  { id: "08:45", timestamp: "08:45" },
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
  const [weekly, setWeekly] = useState([]);
  const [every, setEvery] = useState("Daily");
  const [timeStamps, setTimeStamps] = useState([]);
  const [report, setReport] = useState({
    sendReport: "",
    lastReport: "",
  });

  const [active, setActive] = useState("");
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
  const [insertStatus2, setInsertStatus2] = useState([
    {
      entityType: "print",
      login: "",
      weekly: "",
    },
    {
      entityType: "online",
      login: "",
      weekly: "",
    },
    {
      entityType: "both",
      login: "",
      weekly: "",
    },
  ]);

  useLayoutEffect(() => {
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
      const filteredWeekly =
        row?.excludeHolidays
          ?.filter(
            (weekly) =>
              weekly.loginName === login && weekly.screenType === screenTypeDD
          )
          .map((weekly) => weekly.excludeHolidays)[0] || "";

      const newInitialData = {
        selectedClient: row?.id,
        selectedCompany: modifiedScreenData?.companyUpdates?.length
          ? modifiedScreenData.companyUpdates.map(
              (company) => company.companyId
            )
          : filteredCompanies,
        active: row.active,
        every: row.schedule[0]?.isDayOrMonth || "Daily",
        loginName: login || row?.schedule[0]?.loginName,
        timeStamps: timeStamps,
        report: {
          sendReport: report.sendReport ? report.sendReport : row?.sendReport,
          lastReport: report.lastReport ? report.lastReport : row?.lastReport,
        },
        weekly:
          (filteredWeekly === "Y" && "Yes") ||
          (filteredWeekly === "N" && "No") ||
          "",
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
        setWeekly(newInitialData.weekly);
      } else {
        if (initialState) {
          setSelectedClient(initialState.selectedClient || row?.id);
          setSelectedCompany(initialState.selectedCompany || filteredCompanies);
          setActive(initialState.active || row?.active);
          setEvery(
            initialState.every || row.schedule[0]?.isDayOrMonth || "Daily"
          );
          setTimeStamps(initialState.timeStamps || timeStamps);
          setReport(
            initialState.report || {
              sendReport: row?.sendReport || report.sendReport,
              lastReport: row?.lastReport || report.lastReport,
            }
          );
          setWeekly(initialState?.weekly);
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

      // Filter removed and added time slots

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
            ...prevData[screenTypeDD],
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
  }, [selectedCompany, timeStamps, screenTypeDD, initialState, report]);

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

  useEffect(() => {
    if (openedFromWhere === "add") {
      setInsertStatus2((prev) =>
        prev.map((item) =>
          item.entityType === screenTypeDD
            ? {
                ...item,
                entityType: screenTypeDD,
                login: login,
                weekly: weekly,
              }
            : item
        )
      );
    }
  }, [screenTypeDD, login, weekly, openedFromWhere]);

  const handleCheckboxChange = (event) => {
    setActive(event.target.checked ? "Yes" : "No");
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

  // * combine function for include holidays

  const handleInsertOrAddHolidays = async () => {
    try {
      const data = {
        clientId: selectedClient,
        loginName: login,
        screenType: screenTypeDD,
        excludeHolidays: weekly === "Yes" ? "Y" : "N",
      };
      const filteredRecords = insertStatus2.filter((item) => item.login !== "");
      const dataForAdd = filteredRecords.map((item) => ({
        clientId: selectedClient,
        loginName: item.login,
        screenType: item.entityType,
        excludeHolidays: item.weekly === "Yes" ? "Y" : "N",
      }));
      const response = await axiosInstance.post(
        "updateholidayflag/",
        openedFromWhere === "edit" ? [data] : dataForAdd
      );
      if (response.status === 200) {
        handleClose();
        handleFetch();
        console.log(response.data?.success[0]);
        toast.success(response.data?.success[0]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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

      // Check if there are any changes
      const hasReportChanges =
        row?.sendReport !== report.sendReport ||
        row?.lastReport !== report.lastReport;

      const hasActiveChanges = row?.active !== active;

      const hasFrequencyChanges = initialState.every !== every;

      const hasAnyChanges =
        hasSlotChanges ||
        hasReportChanges ||
        hasActiveChanges ||
        hasFrequencyChanges;

      // Return early if no changes
      if (!hasAnyChanges && Object.keys(modifiedData).length === 0) {
        setUpdateLoading(false);
        return;
      }

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

        loginName: login,
      };
      // if (hasCompanyChanges) {
      //   requestData.companyIds = companyUpdates;
      // }
      // if (hasSlotChanges) {
      //   requestData.slots = slotUpdates;
      // }

      if (row?.sendReport !== report.sendReport) {
        requestData.isSendReport = report.sendReport;
      }
      if (row?.lastReport !== report.lastReport) {
        requestData.isIncludeReport = report.sendReport;
      }
      if (row?.active !== active) {
        requestData.isActive = active;
      }

      if (screenTypeDD) {
        requestData.entityType = screenTypeDD;
      }
      if (initialState.every !== every || hasSlotChanges) {
        requestData.frequency = every;
      }

      const data = Object.keys(modifiedData)
        .map((item) => {
          const { slotUpdates, companyUpdates, weeklyUpdates } =
            modifiedData[item];

          let update = {
            //  ...requestData,
            entityType: item,
          };

          if (slotUpdates && slotUpdates.length > 0) {
            update.slots = slotUpdates;
          }

          if (companyUpdates && companyUpdates.length > 0) {
            update.companyIds = companyUpdates;
          }

          if (weeklyUpdates && weeklyUpdates.length > 0) {
            update.weeklyUpdates = weeklyUpdates;
          }

          return Object.keys(update).length > 0 ? update : null;
        })
        .filter(Boolean);

      const SlotOrCompanyObj = data.length ? data[0] : {};

      const dataToSave = [
        {
          ...requestData,
          ...SlotOrCompanyObj,
        },
      ];

      const requestDataInDict = {
        data: dataToSave,
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
          <Box sx={{ width: 277 }}>
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
          </Box>
        </StyledItemWrapper>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography width={150}>
            Send report even if no new results were found:
          </Typography>
          <YesNoSwitchWrapper>
            {/* Yes/No labels */}
            <CustomSwitch
              checked={report.sendReport === "Yes"}
              onChange={(e) =>
                setReport((prev) => ({
                  ...prev,
                  sendReport: e.target.checked ? "Yes" : "No",
                }))
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
              checked={report.lastReport === "Yes"}
              onChange={(e) =>
                setReport((prev) => ({
                  ...prev,
                  lastReport: e.target.checked ? "Yes" : "No",
                }))
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
          <Box width={277}>
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
          </Box>
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
        <StyledItemWrapper>
          <StyledText>Exclude Days:</StyledText>
          <div className="mt-1">
            <CustomMultiSelect
              dropdownToggleWidth={278}
              dropdownWidth={278}
              keyId="id"
              keyName="name"
              options={weeklyDays}
              selectedItems={weekly}
              setSelectedItems={setWeekly}
              title="Exclude"
            />
          </div>
        </StyledItemWrapper>

        <Divider sx={{ my: 1 }} />
        {openedFromWhere === "edit" && (
          <StyledItemWrapper>
            <FormControl component="fieldset">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={active === "Yes"}
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
          onClick={async () => {
            if (openedFromWhere === "edit") {
              await handleSave();
              if (initialState?.weekly !== (weekly === "Yes" ? "Y" : "N")) {
                await handleInsertOrAddHolidays();
              }
            } else {
              await handleInsert();
              await handleInsertOrAddHolidays();
            }
          }}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {(insertLoading || updateLoading) && <CircularProgress size="1em" />}
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
