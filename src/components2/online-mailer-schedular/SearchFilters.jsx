import { Box, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { formattedDate, formattedNextDay } from "../../constants/dates";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import { url } from "../../constants/baseUrl";
import useFetchData from "../../hooks/useFetchData";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import { timeSlots } from "../../constants/dataArray";
import { format } from "date-fns";
import axiosInstance from "../../../axiosConfig";
import { toast } from "react-toastify";
// import CustomSingleSelect from "../../@core/CustomSingleSelect2";
// import CustomDebounceDropdown from "../../@core/CustomDebounceDropdown";
// import Publication from "../../print-components/dropdowns/Publication";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const SearchFilters = () => {
  const classes = useStyle();
  const [clients, setClients] = useState([]);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [fromDateTimeSlot, setFromDateTimeSlot] = useState("00:00");
  const [dateNow, setDateNow] = useState(formattedNextDay);
  const [toDateTimeSlot, setToDateTimeSlot] = useState("00:00");
  const [newsType, setNewsType] = useState([]);

  // const [dateType, setDateType] = useState("");
  // const [qc1, setQc1] = useState("");
  // const [city, setCity] = useState("");
  // const [publicationGroup, setPublicationGroup] = useState("");
  // const [publication, setPublication] = useState("");
  // const [mailType, setMailType] = useState("");
  // const [mailSent, setMailSent] = useState("");
  // const [isPrintOnlineMailer, setIsPrintOnlineMailer] = useState(false);

  const [sendLoading, setSendLoading] = useState(false);

  const { data: clientData } = useFetchData(`${url}clientlist/`, clients);
  // const { data } = useFetchData(`${url}citieslist`);

  const handleFormSubmit = async () => {
    try {
      if (!newsType.length || !clients.length) {
        toast.warning("Please select clients or entity.");
        return;
      }

      const preparedData = clients.flatMap((client) =>
        newsType.map((screen) => ({
          clientId: client,
          entityType: screen,
          fromDate:
            screen === "online" || screen === "both"
              ? fromDate
              : format(fromDate, "yyyy-MM-dd"),
          toDate:
            screen === "online" || screen === "both"
              ? dateNow
              : format(dateNow, "yyyy-MM-dd"),
        }))
      );
      setSendLoading(true);
      const requests = preparedData.map((item) => {
        const { clientId, entityType, fromDate, toDate } = item;
        const requestData = {
          clientId,
          entityType,
          fromDate,
          toDate,
        };
        return axiosInstance.post("manualArchiveLog", requestData);
      });
      const responses = await Promise.all(requests);
      const resp = responses[0];

      if (resp) {
        const message = JSON.parse(resp?.data?.response?.body);
        toast.success(message?.message);
        setClients([]);
        setNewsType([]);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setSendLoading(false);
    }
  };
  return (
    // <form onSubmit={handleFormSubmit}>
    <Box
      sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
      className="gap-1 mt-1"
    >
      <Box>
        <CustomMultiSelect
          dropdownToggleWidth={300}
          dropdownWidth={300}
          keyId="clientid"
          keyName="clientname"
          options={clientData?.data?.clients || []}
          title="clients"
          selectedItems={clients}
          setSelectedItems={setClients}
          isIncreased
        />
      </Box>
      <div className="flex items-center gap-1 border border-gray-300 rounded-sm p-[1px]">
        <FromDate fromDate={fromDate} setFromDate={setFromDate} isNoMargin />
        <YesOrNo
          classes={classes}
          placeholder="00:00"
          mapValue={timeSlots}
          value={fromDateTimeSlot}
          setValue={setFromDateTimeSlot}
          width={120}
        />
      </div>
      <div className="flex items-center gap-1 border border-gray-300 rounded-sm p-[1px]">
        <ToDate dateNow={dateNow} setDateNow={setDateNow} />
        <YesOrNo
          classes={classes}
          placeholder="00:00"
          mapValue={timeSlots}
          value={toDateTimeSlot}
          setValue={setToDateTimeSlot}
          width={120}
        />
      </div>
      <div className="w-[200px]">
        <CustomMultiSelect
          dropdownToggleWidth={200}
          dropdownWidth={200}
          keyId="id"
          keyName="name"
          options={[
            { id: "print", name: "Print" },
            { id: "online", name: "Online" },
            { id: "both", name: "Combine" },
          ]}
          selectedItems={newsType}
          setSelectedItems={setNewsType}
          title="NewsType"
        />
      </div>

      {/* <YesOrNo
          classes={classes}
          placeholder="DateType"
          mapValue={["Article", "Upload"]}
          value={dateType}
          setValue={setDateType}
          width={120}
        />
        <YesOrNo
          classes={classes}
          placeholder="QC1"
          mapValue={["No", "Yes", "All"]}
          value={qc1}
          setValue={setQc1}
          width={120}
        /> */}
      {/* <CustomSingleSelect
          dropdownToggleWidth={200}
          dropdownWidth={200}
          keyId="cityid"
          keyName="cityname"
          title="City"
          options={data?.data?.cities || []}
          isIncreased
          selectedItem={city}
          setSelectedItem={setCity}
        /> */}
      {/* <CustomDebounceDropdown
          publicationGroup={publicationGroup}
          setPublicationGroup={setPublicationGroup}
          bg="secondory"
          m="mt-0"
        />
        <Publication
          publicationGroup={publicationGroup}
          publication={publication}
          setPublication={setPublication}
          classes={classes}
          width={150}
        /> */}
      {/* <YesOrNo
          classes={classes}
          placeholder="MailType"
          mapValue={["Daily", "Magazine"]}
          value={mailType}
          setValue={setMailType}
          width={120}
        />
        <YesOrNo
          classes={classes}
          placeholder="MailSent"
          mapValue={["No", "All"]}
          value={mailSent}
          setValue={setMailSent}
          width={120}
        /> */}
      {/* <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={isPrintOnlineMailer}
              onChange={(e) => {
                setIsPrintOnlineMailer(e.target.checked);
              }}
            />
          }
          label={
            <span className="font-thin text-[0.9em]">Print Online Mailer</span>
          }
        /> */}
      <Button variant="outlined" size="small">
        Search
      </Button>
      <Button
        variant="outlined"
        size="small"
        onClick={handleFormSubmit}
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        {sendLoading && <CircularProgress size={"1em"} />}
        Send Mail
      </Button>
    </Box>
    // </form>
  );
};

export default SearchFilters;
