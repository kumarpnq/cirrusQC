import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  IconButton,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import AttachmentIcon from "@mui/icons-material/Attachment";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../../constants/baseUrl";

const iconCellStyle = {
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  height: "100%",
};

// * custom toolbar
function CustomToolbar() {
  return (
    <GridToolbarContainer
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <GridToolbarFilterButton />
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

const GridTable = ({
  tableData,
  tableLoading,
  selectionModal,
  setSelectionModal,
  setSelectedItems,
}) => {
  // * similar articles popper
  const [anchorEls, setAnchorEls] = useState({});
  const [similarLoading, setSimilarLoading] = useState(false);
  const [childArticles, setChildArticles] = useState([]);

  const handleSimilarClick = async (event, params) => {
    const socialFeedId = params.row.id;
    const index = params.id;
    setAnchorEls((prev) => ({
      ...prev,
      [index]: prev[index] ? null : event.currentTarget,
    }));
    setSimilarLoading(false);
    try {
      setSimilarLoading(true);
      const userToken = localStorage.getItem("user");
      const main_url = `${url}similararticlesandsocialfeeds/?article_id=${socialFeedId}`;

      const response = await axios.get(main_url, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setChildArticles(response.data.child_articles);
    } catch (error) {
      console.log(error.message);
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleClickAway = (index) => {
    setAnchorEls(null);
    setAnchorEls((prev) => ({
      ...prev,
      [index]: null,
    }));
    setSimilarLoading(false);
  };

  const handleSelectionChange = (ids) => {
    const selectedItem = ids.map((id) =>
      tableData.find((item) => item.article_id === id)
    );
    setSelectedItems(selectedItem);
    setSelectionModal(ids);
  };
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 50,
      renderCell: (params) => (
        <div style={iconCellStyle}>
          {params.row.similarArticles === "Yes" && (
            <>
              <Tooltip title="View similar articles">
                <IconButton
                  onClick={(event) => handleSimilarClick(event, params)}
                  aria-describedby={params.id}
                  size="small"
                >
                  <AttachmentIcon className="text-primary" />
                </IconButton>
              </Tooltip>
              <ClickAwayListener onClickAway={() => handleClickAway(params.id)}>
                <Popper
                  id={params.id}
                  open={Boolean(anchorEls[params.id])}
                  anchorEl={anchorEls[params.id]}
                  popperOptions={{
                    placement: "right-end",
                    strategy: "absolute",
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      bgcolor: "background.paper",
                      // height: 400,
                      maxWidth: 700,
                      maxHeight: 400,
                      overflow: "scroll",
                    }}
                  >
                    <TableContainer component={Paper}>
                      <Table
                        sx={{
                          color: "white",
                        }}
                        className="bg-[#5AACCA]"
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ color: "#ffff" }}>
                              Publication
                            </TableCell>
                            <TableCell sx={{ color: "#ffff" }}>
                              Headline
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {similarLoading ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <CircularProgress />
                            </Box>
                          ) : (
                            <>
                              {" "}
                              {childArticles.length ? (
                                childArticles.map((row, index) => (
                                  <TableRow key={index}>
                                    <TableCell sx={{ color: "#ffff" }}>
                                      {row.publication_name}
                                    </TableCell>
                                    <TableCell sx={{ color: "#ffff" }}>
                                      {row.headline}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableCell sx={{ color: "#ffff" }}>
                                  No Data found
                                </TableCell>
                              )}
                            </>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Popper>
              </ClickAwayListener>
            </>
          )}
        </div>
      ),
    },
    { field: "headline", headerName: "Headline", width: 300 },
    { field: "summary", headerName: "Summary", width: 400 },
    { field: "journalist", headerName: "Journalist", width: 150 },
    {
      field: "url",
      headerName: "URL",
      width: 150,
      renderCell: (params) => (
        <Link
          className="underline"
          to={
            params.row.articleType === "print"
              ? `/articleview/download-file/${params.row.url}`
              : params.row.url
          }
          target="_blank"
        >
          link
        </Link>
      ),
    },
    { field: "publication", headerName: "Publication", width: 150 },
    {
      field: "articleDate",
      headerName: "Article Date",
      width: 150,
    },
    {
      field: "uploadDate",
      headerName: "Upload Date",
      width: 150,
    },
  ];
  const rows = tableData.map((item) => ({
    id: item.article_id,
    headline: item.headline,
    summary: item.summary,
    journalist: item.journalist,
    url: item.url,
    publication: item.publication,
    articleDate: item.article_date,
    uploadDate: item.upload_date,
    similarArticles: item.similar_articles,
    articleType: item.article_type,
  }));

  return (
    <Box sx={{ height: 600, width: "100%", mt: 1 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        rowSelectionModel={selectionModal}
        onRowSelectionModelChange={(ids) => {
          setSelectionModal(ids);
          handleSelectionChange(ids);
        }}
        loading={tableLoading}
        getRowHeight={() => "auto"}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "0.875rem",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "0.9em",
          },
        }}
      />
    </Box>
  );
};

GridTable.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      article_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      headline: PropTypes.string.isRequired,
      summary: PropTypes.string,
      journalist: PropTypes.string,
      url: PropTypes.string,
      publication: PropTypes.string,
      article_date: PropTypes.string.isRequired,
      upload_date: PropTypes.string.isRequired,
      similar_articles: PropTypes.string,
      article_type: PropTypes.string,
    })
  ).isRequired,
  tableLoading: PropTypes.bool.isRequired,
  selectionModal: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  ).isRequired,
  setSelectionModal: PropTypes.func.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
};

export default GridTable;
