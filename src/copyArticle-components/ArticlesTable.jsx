import { DataGrid } from "@mui/x-data-grid";

const ArticlesTable = () => {
  const columns = [
    { field: "articleId", headerName: "ID", width: 70 },
    { field: "date", headerName: "Date", width: 150 },
    { field: "publication", headerName: "Publication", width: 200 },
    { field: "headline", headerName: "Headline", width: 300 },
    { field: "page", headerName: "Page", width: 100 },
    { field: "subject", headerName: "Subject", width: 200 },
  ];

  const rows = [
    {
      id: 1,
      articleId: "001",
      date: "2023-09-25",
      publication: "The Times",
      headline: "Major Event",
      page: 1,
      subject: "Politics",
    },
    {
      id: 2,
      articleId: "002",
      date: "2023-09-26",
      publication: "The Guardian",
      headline: "Economy Update",
      page: 2,
      subject: "Economy",
    },
    {
      id: 3,
      articleId: "003",
      date: "2023-09-27",
      publication: "Le Monde",
      headline: "Sports News",
      page: 3,
      subject: "Sports",
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        rowsPerPageOptions={[5, 10, 20]}
      />
    </div>
  );
};

export default ArticlesTable;
