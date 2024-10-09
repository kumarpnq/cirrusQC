import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/system";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

// * components
import { formattedDate, formattedNextDay } from "../../../constants/dates";
import Client from "../../../print-components/dropdowns/Client";
import useFetchData from "../../../hooks/useFetchData";
import { url } from "../../../constants/baseUrl";
import FromDate from "../../../components/research-dropdowns/FromDate";
import ToDate from "../../../components/research-dropdowns/ToDate";
import CustomTextField from "../../../@core/CutsomTextField";
import YesOrNo from "../../../@core/YesOrNo";
import Button from "../../../components/custom/Button";
import DebounceSearchHeadline from "./DebounceSearchHeadline";

import { addPropertyIfConditionIsTrue } from "../../../utils/addProprtyIfConditiontrue";
import CustomMultiSelect from "../../../@core/CustomMultiSelect";

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
const FilterComponents = ({
  setTableData,
  tableLoading,
  setTableLoading,
  fetchAfterGroup,
  setFetchAfterGroup,
}) => {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [selectedFetchedHeadline, setSelectedFetchedHeadline] = useState(null);
  const [headlineSummary, setHeadlineSummary] = useState("");
  const [allGroupedUnGrouped, setAllGroupedUnGrouped] = useState("");

  //   * data hooks
  const { data } = useFetchData(
    selectedClient ? `${url}companylist/${selectedClient}` : "",
    selectedClient
  );

  function mapYesNoAllToBinary(value) {
    switch (value) {
      case "Grouped":
        return "Y";
      case "Un-grouped":
        return "N";
      case "All":
        return "ALL";
      default:
        return value;
    }
  }
  // * fetch table data
  const fetchTableData = useCallback(async () => {
    try {
      setTableLoading(true);
      const params = {
        from_date: fromDate,
        to_date: toDate,
      };
      addPropertyIfConditionIsTrue(
        params,
        selectedClient,
        "client_id",
        selectedClient
      );
      addPropertyIfConditionIsTrue(
        params,
        selectedCompanies.length > 0,
        "company_id",
        selectedCompanies.join(",")
      );
      addPropertyIfConditionIsTrue(
        params,
        selectedFetchedHeadline,
        " headline",
        selectedFetchedHeadline
      );
      addPropertyIfConditionIsTrue(
        params,
        headlineSummary,
        "headline_summary",
        headlineSummary
      );
      addPropertyIfConditionIsTrue(
        params,
        allGroupedUnGrouped,
        "grouped",
        mapYesNoAllToBinary(allGroupedUnGrouped)
      );
      const userToken = localStorage.getItem("user");
      const response = await axios.get(`${url}printonlinegroupedarticles/`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params: params,
      });
      if (response.data.feed_data.length) {
        setTableData(response.data.feed_data || []);
      } else {
        toast.warning("No data found.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setTableLoading(false);
      setFetchAfterGroup(false);
    }
  }, [
    setTableLoading,
    allGroupedUnGrouped,
    fromDate,
    toDate,
    headlineSummary,
    selectedClient,
    selectedCompanies,
    setTableData,
    setFetchAfterGroup,
    selectedFetchedHeadline,
  ]);

  useEffect(() => {
    if (fetchAfterGroup) {
      fetchTableData();
    }
  }, [fetchAfterGroup]);

  // * clear dd filters
  const handleClear = () => {
    setSelectedClient("");
    setSelectedCompanies([]);
    setFromDate(formattedDate);
    setToDate(formattedNextDay);
    setSelectedFetchedHeadline("");
    setHeadlineSummary("");
    setAllGroupedUnGrouped("");
  };
  //   * mui style classes
  const classes = useStyle();
  return (
    <StyledBox>
      <Typography className="pt-1" component={"div"}>
        <Client
          label="Client"
          client={selectedClient}
          setClient={setSelectedClient}
          width={300}
          setCompanies={setSelectedCompanies}
        />
      </Typography>

      <div className="mt-3 w-[200px]">
        <CustomMultiSelect
          dropdownToggleWidth={200}
          dropdownWidth={250}
          keyId="companyid"
          keyName="companyname"
          options={data?.data?.companies || []}
          selectedItems={selectedCompanies}
          setSelectedItems={setSelectedCompanies}
          title="companies"
        />
      </div>
      <FromDate fromDate={fromDate} setFromDate={setFromDate} />
      <ToDate dateNow={toDate} setDateNow={setToDate} isMargin={true} />
      <Typography className="pt-3" component={"div"}>
        <DebounceSearchHeadline
          fromDate={fromDate}
          toDate={toDate}
          selectedClient={selectedClient}
          selectedCompanies={selectedCompanies}
          selectedFetchedHeadline={selectedFetchedHeadline}
          setSelectedFetchedHeadline={setSelectedFetchedHeadline}
        />
      </Typography>
      <Typography className="pt-3" component={"div"}>
        <CustomTextField
          width={200}
          placeholder="Summary/Headline"
          type="text"
          value={headlineSummary}
          setValue={setHeadlineSummary}
        />
      </Typography>

      <YesOrNo
        classes={classes}
        mapValue={["Grouped", "Un-grouped", "All"]}
        placeholder="AllGrouped/UnGrouped"
        value={allGroupedUnGrouped}
        setValue={setAllGroupedUnGrouped}
        width={140}
      />
      <Button
        btnText={tableLoading ? "Searching" : "search"}
        onClick={fetchTableData}
        isLoading={tableLoading}
      />
      <Button btnText="clear" onClick={handleClear} />
    </StyledBox>
  );
};

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: 3,
  flexWrap: "wrap",
});

FilterComponents.propTypes = {
  setTableData: PropTypes.func.isRequired,
  tableLoading: PropTypes.bool.isRequired,
  setTableLoading: PropTypes.func.isRequired,
  fetchAfterGroup: PropTypes.bool,
  setFetchAfterGroup: PropTypes.func,
};

export default FilterComponents;
