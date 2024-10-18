import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
import { Link } from "@mui/material";
import { url } from "../constants/baseUrl";
import { useState } from "react";

const ArticlesTable = ({ loading, gridData, error, setSelectedRows }) => {
  const [selectionModel, setSelectionModel] = useState([]);

  const handleSelection = (newSelection) => {
    setSelectionModel(newSelection);
    const selectedData = newSelection.map((id) =>
      rows.find((row) => row.id === id)
    );
    setSelectedRows(selectedData);
  };
  const columns = [
    {
      field: "articleId",
      headerName: "ID",
      width: 300,
      renderCell: (params) => (
        <Link href={params.row.articleId} target="_blank" rel="noopener">
          {params.row.articleId}
        </Link>
      ),
    },
    { field: "date", headerName: "Date", width: 100 },
    { field: "publication", headerName: "Publication", width: 200 },
    { field: "headline", headerName: "Headline", width: 300 },
    { field: "page", headerName: "Page", width: 100 },
    { field: "subject", headerName: "Subject", width: 200 },
  ];

  const rows = gridData.map((i) => ({
    id: i.articleId,
    articleId: i.uploadId,
    date: format(i.articleDate, "dd-MM-yyyy"),
    publication: i.publicationName,
    headline: i.headlines,
    page: i.pageNumber,
    subject: i.reportingSubject,
  }));

  return (
    <div style={{ height: 550, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={(newSelection) =>
          handleSelection(newSelection)
        }
        rowsPerPageOptions={[5, 10, 20]}
        density="compact"
        loading={loading}
        disableRowSelectionOnClick
      />
    </div>
  );
};

ArticlesTable.propTypes = {
  loading: PropTypes.bool.isRequired,
  gridData: PropTypes.arrayOf(
    PropTypes.shape({
      articleId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      uploadId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      articleDate: PropTypes.string.isRequired,
      publicationName: PropTypes.string.isRequired,
      headlines: PropTypes.string.isRequired,
      pageNumber: PropTypes.number.isRequired,
      reportingSubject: PropTypes.string.isRequired,
    })
  ).isRequired,
  error: PropTypes.string,
};

export default ArticlesTable;
