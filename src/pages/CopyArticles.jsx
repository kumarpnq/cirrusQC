import { styled } from "@mui/system";
import { Box, Divider, Grid } from "@mui/material";
import Filters from "../copyArticle-components/Filters";
import SelectedPublications from "../copyArticle-components/SelectedPublications";
import ArticlesTable from "../copyArticle-components/ArticlesTable";
import { useState } from "react";

const StyledWrapper = styled(Box)({
  padding: "0 5px",
});

function CopyArticles() {
  const [gridLoading, setGridLoading] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [gridError, setGridError] = useState(null);
  const [selectedPublications, setSelectedPublications] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <StyledWrapper>
      <Filters
        gridLoading={gridLoading}
        setGridLoading={setGridLoading}
        setGridData={setGridData}
        setGridError={setGridError}
        selectedPublications={selectedPublications}
        setSelectedPublications={setSelectedPublications}
        selectedRows={selectedRows}
      />
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        <Grid item xs={12} md={4}>
          <SelectedPublications
            selectedPublications={selectedPublications}
            setSelectedPublications={setSelectedPublications}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <ArticlesTable
            loading={gridLoading}
            gridData={gridData}
            gridError={gridError}
            setSelectedRows={setSelectedRows}
          />
        </Grid>
      </Grid>
    </StyledWrapper>
  );
}

export default CopyArticles;
