import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
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
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import CustomDebounceDropdown from "../../@core/CustomDebounceDropdown";
import Publication from "../../print-components/dropdowns/Publication";

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
  const [dateType, setDateType] = useState("");
  const [qc1, setQc1] = useState("");
  const [city, setCity] = useState("");
  const [publicationGroup, setPublicationGroup] = useState("");
  const [publication, setPublication] = useState("");
  const [mailType, setMailType] = useState("");
  const [mailSent, setMailSent] = useState("");
  const [isPrintOnlineMailer, setIsPrintOnlineMailer] = useState(false);

  const { data: clientData } = useFetchData(`${url}clientlist/`, clients);
  const { data } = useFetchData(`${url}citieslist`);

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <Box
        sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        className="gap-1"
      >
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
        <YesOrNo
          classes={classes}
          placeholder="dateType"
          mapValue={["Article", "Upload"]}
          value={dateType}
          setValue={setDateType}
          width={120}
        />
        <YesOrNo
          classes={classes}
          placeholder="qc1"
          mapValue={["No", "Yes", "All"]}
          value={qc1}
          setValue={setQc1}
          width={120}
        />
        <CustomSingleSelect
          dropdownToggleWidth={200}
          dropdownWidth={200}
          keyId="cityid"
          keyName="cityname"
          title="city"
          options={data?.data?.cities || []}
          isIncreased
          selectedItem={city}
          setSelectedItem={setCity}
        />
        <CustomDebounceDropdown
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
        />
        <YesOrNo
          classes={classes}
          placeholder="mailType"
          mapValue={["Daily", "Magazine"]}
          value={mailType}
          setValue={setMailType}
          width={120}
        />
        <YesOrNo
          classes={classes}
          placeholder="mailSent"
          mapValue={["No", "All"]}
          value={mailSent}
          setValue={setMailSent}
          width={120}
        />
        <FormControlLabel
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
        />
        <Button variant="outlined" size="small" type="submit">
          Search
        </Button>
        <Button variant="outlined" size="small">
          Send Mail
        </Button>
      </Box>
    </form>
  );
};

export default SearchFilters;
