import { styled } from "@mui/system";
import { Box, Divider, Grid } from "@mui/material";
import Filters from "../copyArticle-components/Filters";
import SelectedPublications from "../copyArticle-components/SelectedPublications";
import ArticlesTable from "../copyArticle-components/ArticlesTable";

const StyledWrapper = styled(Box)({
  padding: "0 5px",
});

function CopyArticles() {
  return (
    <StyledWrapper>
      <Filters />
      <Divider sx={{ my: 1 }} />
      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        <Grid item xs={12} md={4}>
          <SelectedPublications />
        </Grid>
        <Grid item xs={12} md={8}>
          <ArticlesTable />
        </Grid>
      </Grid>
    </StyledWrapper>
  );
}

export default CopyArticles;
