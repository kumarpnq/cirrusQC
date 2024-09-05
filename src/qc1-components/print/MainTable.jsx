import PropTypes from "prop-types";
import { EditAttributesOutlined } from "@mui/icons-material";
import AttachmentIcon from "@mui/icons-material/Attachment";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import {
  DataGrid,
  GridCloseIcon,
  GridPagination,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import axios from "axios";
import { useState } from "react";
import { url } from "../../constants/baseUrl";
import ArticleView from "./edit-dialog/ArticleView";

import EditDialog from "./edit-dialog/EditDialog";
import { toast } from "react-toastify";

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
      {/* <GridToolbarColumnsButton /> */}
      <Box sx={{ display: "flex" }}>
        <GridToolbarFilterButton />
        <GridPagination />
      </Box>
      {/* <GridToolbarDensitySelector /> */}
      <GridToolbarQuickFilter />
      {/* Export button is not included */}
    </GridToolbarContainer>
  );
}
const MainTable = ({
  tableData,
  tableDataLoading,
  selectionModal,
  setSelectionModal,
  handleSelectionChange,
  handleRowClick,
  getRowClassName,
  processRowUpdate,
  sortedFilteredRows,
  setSortedFilteredRows,
}) => {
  const userToken = localStorage.getItem("user");
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };

  // * similar articles popper
  const [anchorEls, setAnchorEls] = useState({});
  const [similarLoading, setSimilarLoading] = useState(false);
  const [childArticles, setChildArticles] = useState([]);
  const [openEditSimilarArticle, setOpenEditSimilarArticle] = useState(false);

  // * article view
  const [clickedArticle, setClickedArticle] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (row) => {
    setOpen(true);
    setClickedArticle(row);
  };

  const handleSimilarClick = async (event, params) => {
    const socialFeedId = params.row.socialFeedId;
    const index = params.id;
    setAnchorEls((prev) => ({
      ...prev,
      [index]: prev[index] ? null : event.currentTarget,
    }));
    setSimilarLoading(false);
    try {
      setSimilarLoading(true);
      const response = await axios.get(
        `${url}similarsocialfeeds/?socialfeed_id=${socialFeedId}`,
        { headers }
      );
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

  const [selectedSimilarArticle, setSelectedSimilarArticle] = useState([]);
  const handleDeleteSimilarArticle = async (id, row) => {
    console.log(id);
    console.log(row);

    try {
      const userToken = localStorage.getItem("userToken");
      const params = {
        parent_id: row?.main_id,
        child_token: id,
      };
      const response = await axios.delete(`${url}`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params,
      });
      console.log(response.data);
    } catch (error) {
      toast.error("Error : ");
    }
  };
  const handleOpenEditSimilarArticle = (row) => {
    const data = {
      id: 0,
      headline: row.headline,
      socialFeedId: row.article,
    };
    setSelectedSimilarArticle([data]);
    setOpenEditSimilarArticle((pre) => !pre);
  };
  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: 125,
      renderCell: (params) => (
        <div style={iconCellStyle}>
          <IconButton onClick={() => handleRowClick(params.row, params.id)}>
            <EditAttributesOutlined className="text-primary" />
          </IconButton>
          <IconButton onClick={() => handleOpen(params.row)}>
            <VisibilityIcon className="text-primary" />
          </IconButton>
          {params.row.similar_articles === "Yes" && (
            <>
              <Tooltip title="View similar articles">
                <IconButton
                  onClick={(event) => handleSimilarClick(event, params)}
                  aria-describedby={params.id}
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
                        className="border"
                        aria-label="simple table"
                      >
                        <TableHead className="bg-primary">
                          <TableRow>
                            <TableCell sx={{ color: "#ffff" }}>Edit</TableCell>
                            <TableCell sx={{ color: "#ffff" }}>
                              Action
                            </TableCell>
                            <TableCell sx={{ color: "#ffff" }}>ID</TableCell>
                            <TableCell sx={{ color: "#ffff" }}>
                              Publication
                            </TableCell>
                            <TableCell sx={{ color: "#ffff" }}>
                              Headline
                            </TableCell>
                            <TableCell sx={{ color: "#ffff" }}>Page</TableCell>
                            <TableCell sx={{ color: "#ffff" }}>City</TableCell>
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
                                    <TableCell>
                                      <IconButton
                                        onClick={() =>
                                          handleOpenEditSimilarArticle(row)
                                        }
                                      >
                                        <EditAttributesOutlined className="text-primary" />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell>
                                      {" "}
                                      <IconButton
                                        sx={{ color: "red" }}
                                        onClick={() =>
                                          handleDeleteSimilarArticle(
                                            row.article,
                                            params.row
                                          )
                                        }
                                      >
                                        <GridCloseIcon />
                                      </IconButton>
                                    </TableCell>
                                    <TableCell>{row.article}</TableCell>
                                    <TableCell>
                                      {row.publication_name}
                                    </TableCell>
                                    <TableCell>{row.headline}</TableCell>
                                    <TableCell>10</TableCell>
                                    <TableCell>Mumbai</TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableCell>No Data found</TableCell>
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
    {
      field: "headline",
      headerName: "Headline",
      width: 250,
      editable: true,
    },
    { field: "summary", headerName: "Summary", width: 500, editable: true },
    {
      field: "journalist",
      headerName: "Journalist",
      width: 150,
      editable: true,
    },
    { field: "publication", headerName: "Publication", width: 150 },
    {
      field: "url",
      headerName: "URL",
      width: 100,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      ),
    },
    { field: "qcDone", headerName: "QC Done", width: 100 },
    { field: "articleDate", headerName: "Article Date", width: 150 },
    { field: "socialFeedId", headerName: "socialFeedId", width: 150 },
  ];
  const rows = tableData?.map((item, index) => ({
    id: index,
    action: "#",
    headline: item.headline,
    summary: item.detail_summary,
    journalist: item.journalist,
    publication: item.publication,
    url: item.link,
    qcDone: item.qc1_done,
    articleDate: item.feed_date_time,
    socialFeedId: item.social_feed_id,
    similar_articles: item.similar_articles,
    language: item.language,
  }));

  const applyFilteringToRows = (rows, filterModel) => {
    if (
      filterModel.items.length === 0 &&
      (!filterModel.quickFilterValues ||
        filterModel.quickFilterValues.length === 0)
    ) {
      return rows;
    }

    return rows.filter((row) => {
      const matchesItems = filterModel.items.every((filterItem) => {
        const { field, operator, value } = filterItem;
        const cellValue = row[field];

        if (cellValue === undefined || cellValue === null) return false;

        switch (operator) {
          case "contains":
            return cellValue
              .toString()
              .toLowerCase()
              .includes(value.toString().toLowerCase());
          case "equals":
            return (
              cellValue.toString().toLowerCase() ===
              value.toString().toLowerCase()
            );
          case "startsWith":
            return cellValue
              .toString()
              .toLowerCase()
              .startsWith(value.toString().toLowerCase());
          case "endsWith":
            return cellValue
              .toString()
              .toLowerCase()
              .endsWith(value.toString().toLowerCase());
          case "greaterThan":
            return cellValue > value;
          case "lessThan":
            return cellValue < value;
          case "greaterThanOrEqual":
            return cellValue >= value;
          case "lessThanOrEqual":
            return cellValue <= value;
          default:
            return true;
        }
      });

      const matchesQuickFilter =
        filterModel.quickFilterValues.length > 0
          ? filterModel.quickFilterValues.every((quickValue) => {
              return Object.values(row).some((cellValue) =>
                cellValue
                  ?.toString()
                  .toLowerCase()
                  .includes(quickValue.toLowerCase())
              );
            })
          : true;

      // Combine logic for both items and quick filters
      if (filterModel.quickFilterLogicOperator === "and") {
        return matchesItems && matchesQuickFilter;
      } else if (filterModel.quickFilterLogicOperator === "or") {
        return matchesItems || matchesQuickFilter;
      }

      return matchesItems;
    });
  };

  const applySortingToRows = (rows, sortModel) => {
    if (sortModel.length === 0) {
      return rows; // No sorting applied, return original rows
    }

    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      for (const sortItem of sortModel) {
        const { field, sort } = sortItem;
        const valueA = a[field];
        const valueB = b[field];

        if (valueA < valueB) {
          return sort === "asc" ? -1 : 1;
        }
        if (valueA > valueB) {
          return sort === "asc" ? 1 : -1;
        }
      }
      return 0;
    });

    return sortedRows;
  };

  const handleSearchModelChange = (searchModel) => {
    // Assuming the searchModel has a 'value' key that contains the search query
    const searchQuery = searchModel.value?.toLowerCase();

    if (searchQuery) {
      const filteredRows = rows.filter((row) =>
        Object.values(row).some((field) =>
          field.toString().toLowerCase().includes(searchQuery)
        )
      );
      setSortedFilteredRows(filteredRows);
    } else {
      setSortedFilteredRows(rows); // Reset to the original rows if the search query is empty
    }
  };

  const handleSortModelChange = (sortModel) => {
    const sortedRows = applySortingToRows(rows, sortModel);

    setSortedFilteredRows(sortedRows);
  };

  const handleFilterModelChange = (filterModel) => {
    const filteredRows = applyFilteringToRows(rows, filterModel);

    setSortedFilteredRows(filteredRows);
  };

  return (
    <>
      <Box sx={{ height: 600, width: "100%", mt: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          pageSize={5}
          pageSizeOptions={[
            10,
            100,
            200,
            1000,
            { value: 1000, label: "1,000" },
          ]}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.9em",
            },
          }}
          checkboxSelection
          rowSelectionModel={selectionModal}
          onRowSelectionModelChange={(ids) => {
            setSelectionModal(ids);
            handleSelectionChange(ids);
          }}
          onSortModelChange={handleSortModelChange}
          onSearchModelChange={handleSearchModelChange}
          onFilterModelChange={handleFilterModelChange}
          processRowUpdate={processRowUpdate}
          disableDensitySelector
          disableColumnSelector
          disableRowSelectionOnClick
          columnBufferPx={1000}
          loading={tableDataLoading && <CircularProgress />}
          components={{ Toolbar: CustomToolbar }}
          getRowHeight={() => "auto"}
          hideFooterSelectedRowCount
          hideFooterPagination
          getRowClassName={getRowClassName}
        />
      </Box>
      <ArticleView
        open={open}
        setOpen={setOpen}
        clickedArticle={clickedArticle}
      />
      <EditDialog
        open={openEditSimilarArticle}
        setOpen={setOpenEditSimilarArticle}
        rowData={selectedSimilarArticle}
        rowNumber={0}
        setRowNumber={() => {}}
        isSimilar
        isFiltered
      />
    </>
  );
};

MainTable.propTypes = {
  tableData: PropTypes.array.isRequired,
  tableDataLoading: PropTypes.bool.isRequired,
  selectionModal: PropTypes.array.isRequired,
  setSelectionModal: PropTypes.func.isRequired,
  handleSelectionChange: PropTypes.func.isRequired,
  handleRowClick: PropTypes.func.isRequired,
  getRowClassName: PropTypes.func.isRequired,
  processRowUpdate: PropTypes.func.isRequired,
};

export default MainTable;
