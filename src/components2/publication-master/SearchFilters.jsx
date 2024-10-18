import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomTextField from "../../@core/CutsomTextField";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import { formattedDate, formattedNextDay } from "../../constants/dates";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import CustomMultiSelect from "../../@core/CustomMultiSelect";
import useFetchData from "../../hooks/useFetchData";
import { styled } from "@mui/system";
import { url } from "../../constants/baseUrl";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const FilterWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 1.7,
  flexWrap: "wrap",
});

const SearchFilters = () => {
  const classes = useStyle();
  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  const [display, setDisplay] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [publicationType, setPublicationType] = useState("");
  const [pubType, setPubType] = useState("");
  const [temporary, setTemporary] = useState("");
  const [type, setType] = useState("");
  const [populate, setPopulate] = useState("");
  const [edition, setEdition] = useState("");
  const [selectedCity, setSelectedCity] = useState([]);

  // * city data fetch
  const { data } = useFetchData(`${url}citieslist`);
  const cityData = data?.data?.cities || [];

  const handleSubmit = async (event) => {
    event.preventDefault();
  };
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        Search
      </AccordionSummary>
      <AccordionDetails>
        <form action="" onSubmit={handleSubmit}>
          <FilterWrapper>
            <div className="mb-3">
              <FromDate fromDate={fromDate} setFromDate={setFromDate} />
            </div>
            <ToDate dateNow={dateNow} setDateNow={setDateNow} />

            <CustomTextField
              value={searchText}
              setValue={setSearchText}
              width={200}
              placeholder={"Search text"}
              type={"text"}
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
            <CustomTextField
              value={display}
              setValue={setDisplay}
              width={120}
              placeholder={"Display"}
              type={"number"}
            />
            <YesOrNo
              classes={classes}
              placeholder="Publication Type"
              mapValue={["Print", "All", "Internet"]}
              value={publicationType}
              setValue={setPublicationType}
              width={120}
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
              placeholder="Temporary"
              mapValue={["Yes", "No", "All"]}
              value={temporary}
              setValue={setTemporary}
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
            <YesOrNo
              classes={classes}
              placeholder="Subscription"
              mapValue={["Vendor", "Courier", "Post"]}
              value={type}
              setValue={setType}
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
            <Button variant="outlined" size="small" type="submit">
              Search
            </Button>
            <Button variant="outlined" size="small">
              Add
            </Button>
            <Button variant="outlined" color="error" size="small">
              Delete
            </Button>
          </FilterWrapper>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export default SearchFilters;
