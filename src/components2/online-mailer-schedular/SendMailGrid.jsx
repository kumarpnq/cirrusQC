import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";

const columns = [
  { field: "articleId", headerName: "Article ID", width: 150 },
  { field: "articleDate", headerName: "Article Date", width: 180 },
  { field: "publicationName", headerName: "Publication Name", width: 200 },
  { field: "headline", headerName: "Headline", width: 300 },
  { field: "pageNumber", headerName: "Page Number", width: 120 },
  { field: "pdfSize", headerName: "PDF Size", width: 120 },
  { field: "reportingSubject", headerName: "Reporting Subject", width: 200 },
];

const rows = [
  {
    id: 1,
    articleId: "A001",
    articleDate: "2024-01-01",
    publicationName: "News Daily",
    headline: "New Innovations in Tech",
    pageNumber: 5,
    pdfSize: "20KB",
    reportingSubject: "Technology",
  },
  {
    id: 2,
    articleId: "A002",
    articleDate: "2024-01-02",
    publicationName: "Sports Weekly",
    headline: "Championship Highlights",
    pageNumber: 12,
    pdfSize: "25KB",
    reportingSubject: "Sports",
  },
  {
    id: 3,
    articleId: "A003",
    articleDate: "2024-01-03",
    publicationName: "Health Magazine",
    headline: "Wellness Trends",
    pageNumber: 8,
    pdfSize: "22KB",
    reportingSubject: "Health",
  },
  {
    id: 4,
    articleId: "A004",
    articleDate: "2024-01-04",
    publicationName: "Travel Journal",
    headline: "Top Destinations for 2024",
    pageNumber: 15,
    pdfSize: "18KB",
    reportingSubject: "Travel",
  },
  {
    id: 5,
    articleId: "A005",
    articleDate: "2024-01-05",
    publicationName: "Food Blog",
    headline: "Culinary Delights",
    pageNumber: 3,
    pdfSize: "30KB",
    reportingSubject: "Food",
  },
  {
    id: 6,
    articleId: "A006",
    articleDate: "2024-01-06",
    publicationName: "Tech Review",
    headline: "Gadgets of the Year",
    pageNumber: 7,
    pdfSize: "27KB",
    reportingSubject: "Technology",
  },
  {
    id: 7,
    articleId: "A007",
    articleDate: "2024-01-07",
    publicationName: "Business Insider",
    headline: "Market Trends",
    pageNumber: 10,
    pdfSize: "24KB",
    reportingSubject: "Business",
  },
  {
    id: 8,
    articleId: "A008",
    articleDate: "2024-01-08",
    publicationName: "Art Journal",
    headline: "Contemporary Art Scene",
    pageNumber: 11,
    pdfSize: "15KB",
    reportingSubject: "Art",
  },
  {
    id: 9,
    articleId: "A009",
    articleDate: "2024-01-09",
    publicationName: "Education Today",
    headline: "Innovative Learning Methods",
    pageNumber: 6,
    pdfSize: "19KB",
    reportingSubject: "Education",
  },
  {
    id: 10,
    articleId: "A010",
    articleDate: "2024-01-10",
    publicationName: "Music Monthly",
    headline: "Festival Season",
    pageNumber: 4,
    pdfSize: "21KB",
    reportingSubject: "Music",
  },
  {
    id: 11,
    articleId: "A011",
    articleDate: "2024-01-11",
    publicationName: "Eco Magazine",
    headline: "Sustainability Practices",
    pageNumber: 14,
    pdfSize: "20KB",
    reportingSubject: "Environment",
  },
  {
    id: 12,
    articleId: "A012",
    articleDate: "2024-01-12",
    publicationName: "Fitness Journal",
    headline: "Health and Fitness Tips",
    pageNumber: 9,
    pdfSize: "23KB",
    reportingSubject: "Health",
  },
  {
    id: 13,
    articleId: "A013",
    articleDate: "2024-01-13",
    publicationName: "Science Daily",
    headline: "Latest Scientific Discoveries",
    pageNumber: 13,
    pdfSize: "26KB",
    reportingSubject: "Science",
  },
  {
    id: 14,
    articleId: "A014",
    articleDate: "2024-01-14",
    publicationName: "Finance Weekly",
    headline: "Investment Strategies",
    pageNumber: 16,
    pdfSize: "20KB",
    reportingSubject: "Finance",
  },
  {
    id: 15,
    articleId: "A015",
    articleDate: "2024-01-15",
    publicationName: "Parenting Guide",
    headline: "Raising Happy Kids",
    pageNumber: 2,
    pdfSize: "18KB",
    reportingSubject: "Parenting",
  },
  {
    id: 16,
    articleId: "A016",
    articleDate: "2024-01-16",
    publicationName: "Fashion Today",
    headline: "Fashion Trends 2024",
    pageNumber: 17,
    pdfSize: "22KB",
    reportingSubject: "Fashion",
  },
  {
    id: 17,
    articleId: "A017",
    articleDate: "2024-01-17",
    publicationName: "Home Decor",
    headline: "Interior Design Ideas",
    pageNumber: 1,
    pdfSize: "30KB",
    reportingSubject: "Home",
  },
  {
    id: 18,
    articleId: "A018",
    articleDate: "2024-01-18",
    publicationName: "Gardening Weekly",
    headline: "Garden Maintenance Tips",
    pageNumber: 8,
    pdfSize: "15KB",
    reportingSubject: "Gardening",
  },
  {
    id: 19,
    articleId: "A019",
    articleDate: "2024-01-19",
    publicationName: "Movie Review",
    headline: "Best Movies of 2024",
    pageNumber: 4,
    pdfSize: "27KB",
    reportingSubject: "Movies",
  },
  {
    id: 20,
    articleId: "A020",
    articleDate: "2024-01-20",
    publicationName: "Technology Today",
    headline: "AI Advances",
    pageNumber: 9,
    pdfSize: "25KB",
    reportingSubject: "Technology",
  },
];

const SendMailGrid = () => {
  return (
    <Box sx={{ height: 550, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        density="compact"
        rowsPerPageOptions={[5]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
      />
    </Box>
  );
};

export default SendMailGrid;
