import { useState } from "react";
import { Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

// * components
import { formattedDate, formattedNextDay } from "../../../constants/dates";
import Client from "../../../print-components/dropdowns/Client";
import Company from "../../../print-components/dropdowns/Company";
import useFetchData from "../../../hooks/useFetchData";
import { url } from "../../../constants/baseUrl";
import FromDate from "../../../components/research-dropdowns/FromDate";
import ToDate from "../../../components/research-dropdowns/ToDate";
import CustomTextField from "../../../@core/CutsomTextField";
import YesOrNo from "../../../@core/YesOrNo";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
    marginTop: "1em",
  },
  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    background: "#d4c8c7",
  },
  componentHeight: {
    height: 25,
    display: "flex",
    alignItems: "center",
  },
}));
const FilterComponents = () => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [selectedFetchedHeadline, setSelectedFetchedHeadline] = useState("");
  const [headlineSummary, setHeadlineSummary] = useState("");
  const [allGroupedUnGrouped, setAllGroupedUnGrouped] = useState("");

  //   * data hooks
  const { data } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : "",
    selectedClient
  );

  //   * mui style classes
  const classes = useStyle();
  return (
    <Box>
      <Client
        label="Client"
        client={selectedClient}
        setClient={setSelectedClient}
        width={300}
        setCompanies={setSelectedCompanies}
      />
      <Company
        companyData={data?.data?.companies || []}
        companies={selectedCompanies}
        setCompanies={setSelectedCompanies}
        isMt={true}
      />
      <FromDate fromDate={fromDate} setFromDate={setFromDate} />
      <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
      <CustomTextField
        width={200}
        placeholder="Summary/Headline"
        type="text"
        value={headlineSummary}
        setValue={setHeadlineSummary}
      />
      <YesOrNo
        classes={classes}
        mapValue={["Grouped", "Un-grouped", "All"]}
        placeholder="AllGrouped/UnGrouped"
        value={allGroupedUnGrouped}
        setValue={setAllGroupedUnGrouped}
        width={120}
      />
    </Box>
  );
};

export default FilterComponents;
