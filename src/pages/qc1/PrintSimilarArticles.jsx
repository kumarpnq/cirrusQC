import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";

// * components
import SearchFilter from "../../qc1-components/printSimilarArticles/SearchFilter";
import GridTable from "../../qc1-components/printSimilarArticles/GridTable";
import GroupAccordion from "../../qc1-components/printSimilarArticles/GroupAccordian";

const PrintSimilarArticles = () => {
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectionModal, setSelectionModal] = useState([]);
  const [fetchAfterGroup, setFetchAfterGroup] = useState(false);
  return (
    <StyledWrapper>
      <SearchFilter
        setTableData={setTableData}
        setTableLoading={setTableLoading}
        tableLoading={tableLoading}
        fetchAfterGroup={fetchAfterGroup}
        setFetchAfterGroup={setFetchAfterGroup}
      />
      {!!selectedItems.length && (
        <GroupAccordion
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setSelectionModal={setSelectionModal}
          setFetchAfterGroup={setFetchAfterGroup}
        />
      )}

      <GridTable
        tableData={tableData}
        tableLoading={tableLoading}
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
