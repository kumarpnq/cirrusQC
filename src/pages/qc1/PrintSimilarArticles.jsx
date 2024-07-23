import SearchFilter from "../../qc1-components/printSimilarArticles/SearchFilter";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { useState } from "react";
import GridTable from "../../qc1-components/printSimilarArticles/GridTable";
import GroupAccordion from "../../qc1-components/printSimilarArticles/GroupAccordian";

const PrintSimilarArticles = () => {
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [headline, setHeadline] = useState("");
  return (
    <StyledWrapper>
      <SearchFilter
        setTableData={setTableData}
        setTableLoading={setTableLoading}
        tableLoading={tableLoading}
      />
      <GroupAccordion setHeadline={setHeadline} headline={headline} />
      <GridTable
        tableData={tableData}
        tableLoading={tableLoading}
        setHeadline={setHeadline}
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Box)({
  padding: "0 7px 7px",
});

export default PrintSimilarArticles;
