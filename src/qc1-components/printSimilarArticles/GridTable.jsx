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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AttachmentIcon from "@mui/icons-material/Attachment";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";

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
  setHeadline,
  selectionModal,
  setSelectionModal,
  setSelectedItems,
}) => {
  // * similar articles popper
  const [anchorEls, setAnchorEls] = useState({});
  const [similarLoading, setSimilarLoading] = useState(false);
  const [childArticles, setChildArticles] = useState([]);

  const handleSimilarClick = () => {};
  const handleClickAway = () => {};
  const handleCopy = (text) => {
    setHeadline(text);
  };

  console.log(tableData);
  const handleSelectionChange = (ids) => {
    console.log(ids);
    const selectedItem = ids.map((index) => tableData[index]);
    setSelectedItems(selectedItem);
    setSelectionModal(ids);
  };
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 125,
      renderCell: (params) => (
        <div style={iconCellStyle}>
          <CopyToClipboard text={JSON.stringify(params.row.headline)}>
            <IconButton
              size="small"
              onClick={() => handleCopy(params.row.headline)}
            >
              <ContentCopyIcon className="text-primary" />
            </IconButton>
          </CopyToClipboard>
          {params.row.similar_articles === "Yes" && (
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
    })
  ).isRequired,
  tableLoading: PropTypes.bool.isRequired,
  setHeadline: PropTypes.func.isRequired,
};

export default GridTable;
