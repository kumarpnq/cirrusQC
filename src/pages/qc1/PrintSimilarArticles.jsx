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
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionModal, setSelectionModal] = useState([]);
  return (
    <StyledWrapper>
      <SearchFilter
        setTableData={setTableData}
        setTableLoading={setTableLoading}
        tableLoading={tableLoading}
      />
      <GroupAccordion
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setSelectionModal={setSelectionModal}
        fetchTableData={""}
      />
      <GridTable
        tableData={tableData}
        tableLoading={tableLoading}
        setHeadline={setHeadline}
        selectionModal={selectionModal}
        setSelectionModal={setSelectionModal}
        setSelectedItems={setSelectedItems}
      />
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Box)({
  padding: "0 7px 7px",
});

export default PrintSimilarArticles;
