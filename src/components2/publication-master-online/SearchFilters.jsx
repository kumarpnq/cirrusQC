import { Box, Button, Paper, Typography } from "@mui/material";
import CustomTextField from "../../@core/CutsomTextField";
import { useState } from "react";
import { formattedDate, formattedNextDay } from "../../constants/dates";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const SearchFilters = () => {
  const classes = useStyle();
  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  const [display, setDisplay] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [pubType, setPubType] = useState("");
  const [type, setType] = useState("");
  const [selectedCity, setSelectedCity] = useState([]);
  const [subscriptionType, setSubscriptionType] = useState("");
  const [populate, setPopulate] = useState("");
  const [edition, setEdition] = useState("");

  // * city data fetch
  const { data } = useFetchData(`${url}citieslist`);
  const cityData = data?.data?.cities || [];

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  //   "DISPLAYNAME" VARCHAR2(256 CHAR),
  // 	"MONTHLY_TRAFFIC" NUMBER(14,2),
  // 	"ARTICLE_REACH" NUMBER(14,2),
  // 	"MONTHLY_UNIQUE_VISITORS" NUMBER(14,2),
  // 	"MEDIA_TYPE" VARCHAR2(500 CHAR),
  // 	"DEVICE_VIEW_SPLIT" VARCHAR2(100 CHAR),
  // 	"RANKING_INDIA" NUMBER(14,2),
  // 	"RANKING_INDUSTRY" NUMBER(14,2),
  // 	"BOUNCE_RATE" NUMBER(14,10),
  // 	"DURATION" NUMBER(14,10),
  // 	"PAGE_VIEWS" NUMBER(14,10),

  return (
    <Box component={Paper}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center gap-1"
      >
        <div className="mb-3">
          <FromDate fromDate={fromDate} setFromDate={setFromDate} />
        </div>
        <ToDate dateNow={dateNow} setDateNow={setDateNow} />
        <CustomTextField
          value={display}
          setValue={setDisplay}
          width={100}
          type={"number"}
          placeholder={"display"}
        />
        <CustomTextField
          value={searchText}
          setValue={setSearchText}
          width={100}
          type={"number"}
          placeholder={"search text"}
        />
        <YesOrNo
          classes={classes}
          placeholder="Pub Type"
          mapValue={["Daily", "Weekly", "Fortnightly", "Monthly", "Others"]}
          value={pubType}
          setValue={setPubType}
          width={120}
        />
        <YesOrNo
          classes={classes}
          placeholder="Type"
          mapValue={["YPT", "TPT", "POST"]}
          value={type}
          setValue={setType}
          width={120}
        />
        <Typography component={"div"} width={200}>
          <CustomMultiSelect
            dropdownToggleWidth={200}
            dropdownWidth={250}
            keyId="cityid"
            keyName="cityname"
            options={cityData}
            selectedItems={selectedCity}
            setSelectedItems={setSelectedCity}
            title="Cities"
          />
        </Typography>
        <YesOrNo
          classes={classes}
          placeholder="Subscription"
          mapValue={["Vendor", "Courier", "Post"]}
          value={subscriptionType}
          setValue={setSubscriptionType}
          width={120}
        />
        <YesOrNo
          classes={classes}
          placeholder="Populate"
          mapValue={["Yes", "No"]}
          value={populate}
          setValue={setPopulate}
          width={120}
        />
        <YesOrNo
          classes={classes}
          placeholder="Edition"
          mapValue={["BD", "ND", "RD", "TAB", "PIM", "BIM", "TM", "WP"]}
          value={edition}
          setValue={setEdition}
          width={120}
        />
        <Button size="small" variant="outlined" type="submit">
          Search
        </Button>
      </form>
    </Box>
  );
};

export default SearchFilters;
