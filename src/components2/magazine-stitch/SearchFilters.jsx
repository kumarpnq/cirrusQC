import { Box, Button, Paper } from "@mui/material";
import { useState } from "react";
import { formattedDate, formattedNextDay } from "../../constants/dates";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import CustomSingleSelect from "../../@core/CustomSingleSelect2";
import YesOrNo from "../../@core/YesOrNo";
import { styled } from "@mui/system";

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  padding: 3,
});

const SearchFilters = () => {
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [publication, setPublication] = useState("");
  const [company, setCompany] = useState("");
  const [stitchedArticles, setStitchedArticles] = useState("");
  const [publications, setPublications] = useState([
    {
      id: "1",
      name: "Publication 1",
    },
    {
      id: "2",
      name: "Publication 2",
    },
    {
      id: "3",
      name: "Publication 3",
    },
  ]);
  return (
    <StyledBox component={Paper} className="gap-1">
      <FromDate fromDate={fromDate} setFromDate={setFromDate} isNoMargin />
      <ToDate dateNow={toDate} setDateNow={setToDate} />
      <CustomSingleSelect
        dropdownWidth={250}
        dropdownToggleWidth={250}
        keyId="id"
        keyName="name"
        options={publications}
        selectedItem={publication}
        setSelectedItem={setPublication}
        title="Publication"
      />
      <YesOrNo
        mapValue={["All", "Yes", "No"]}
        placeholder="Company"
        width={250}
        value={company}
        setValue={setCompany}
      />
      <YesOrNo
        mapValue={["One", "Two", "Three"]}
        placeholder="Articles"
        width={250}
        value={stitchedArticles}
        setValue={setStitchedArticles}
      />
      <Button variant="outlined" size="small">
        Fill
      </Button>
      <Button variant="outlined" size="small">
        Search
      </Button>
      <Button variant="outlined" size="small">
        Save
      </Button>
    </StyledBox>
  );
};

export default SearchFilters;
