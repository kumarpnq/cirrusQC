import PropTypes from "prop-types";
import { EditAttributesOutlined } from "@mui/icons-material";
import AttachmentIcon from "@mui/icons-material/Attachment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  Button,
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
  useGridApiRef,
  DataGrid,
  GridCloseIcon,
  GridPagination,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";

import axios from "axios";
import { useCallback, useState } from "react";
import { url } from "../../constants/baseUrl";
import ArticleView from "./edit-dialog/ArticleView";

import EditDialog from "./edit-dialog/EditDialog";
import { toast } from "react-toastify";
import { saveTableSettings } from "../../constants/saveTableSetting";
import useUserSettings from "../../hooks/useUserSettings";
import EditTextarea from "../../@core/EditTextarea";

const iconCellStyle = {
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  height: "100%",
};

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
  handleSave,
  savePermission,
  deletePermission,
}) => {
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
        <Box>
          {!!savePermission && (
            <Button
              size="small"
              onClick={handleSave}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Save Partial
            </Button>
          )}

          <GridToolbarQuickFilter />
        </Box>
        {/* <GridToolbarDensitySelector /> */}

        {/* Export button is not included */}
      </GridToolbarContainer>
    );
  }
  // * user settings
  const userColumnSettings = useUserSettings("online", "Main");

  const userToken = localStorage.getItem("user");
  const headers = {
    Authorization: `Bearer ${userToken}`,
  };

  // * similar articles popper
  const [anchorEls, setAnchorEls] = useState({});
  const [similarLoading, setSimilarLoading] = useState(false);
  const [childArticles, setChildArticles] = useState([]);
  const [openEditSimilarArticle, setOpenEditSimilarArticle] = useState(false);
  const apiRef = useGridApiRef();

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
    try {
      const userToken = localStorage.getItem("user");
      const params = {
        parent_id: row?.socialFeedId,
        child_id: id,
      };
      const response = await axios.delete(`${url}ungroupsinglesocialfeed`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params,
      });
      const successMSG = response.data?.status?.update_status;
      toast.success(successMSG || "");
      const updatedChildArticles = childArticles.filter(
        (article) => article.article !== id
      );
      setChildArticles(updatedChildArticles);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  const handleOpenEditSimilarArticle = (row) => {
    const data = {
      id: 0,
      headline: row.headline,
      socialFeedId: row.article,
      link: row.link,
    };
    setSelectedSimilarArticle([data]);
    setOpenEditSimilarArticle((pre) => !pre);
  };

  const multilineColumn = {
    type: "string",
    renderEditCell: (params) => <EditTextarea {...params} />,
  };

  const columns = [
    {
      field: "action",
      headerName: "Action",
      width: userColumnSettings?.action || 125,
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
                            {!!deletePermission && (
                              <TableCell sx={{ color: "#ffff" }}>
                                Action
                              </TableCell>
                            )}

                            <TableCell sx={{ color: "#ffff" }}>ID</TableCell>
                            <TableCell sx={{ color: "#ffff" }}>
                              Publication
                            </TableCell>
                            <TableCell sx={{ color: "#ffff" }}>
                              Headline
                            </TableCell>
                            {/* <TableCell sx={{ color: "#ffff" }}>Page</TableCell> */}
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
                                    {!!deletePermission && (
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
                                    )}

                                    <TableCell>{row.article}</TableCell>
                                    <TableCell>
                                      {row.publication_name}
                                    </TableCell>
                                    <TableCell>
                                      {row.headline.substring(0, 30) + "..."}
                                    </TableCell>
                                    {/* <TableCell>10</TableCell> */}
                                    <TableCell>{row.city}</TableCell>
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
      width: userColumnSettings?.headline || 250,
      editable: true,
      ...multilineColumn,
    },
    {
      field: "summary",
      headerName: "Summary",
      width: userColumnSettings?.summary || 500,
      editable: true,
      ...multilineColumn,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <div
            style={{
              whiteSpace: "normal", // Ensures text wraps properly within the cell
              wordWrap: "break-word", // Breaks long words to fit within the cell
              maxHeight: "4.5em", // Limits the height to approximately 4 lines
              overflow: "hidden", // Prevents overflow of content
              lineHeight: "1.4", // Ensures proper line spacing for text
              textOverflow: "ellipsis", // Adds ellipsis if the text overflows
              display: "-webkit-box", // Set as flex-like box to allow for multiline ellipsis
              WebkitBoxOrient: "vertical", // Enables multi-line truncation with ellipsis
              WebkitLineClamp: 3, // Limit the number of lines to 4 and adds ellipsis
            }}
          >
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "journalist",
      headerName: "Journalist",
      width: 150,
      editable: true,
      ...multilineColumn,
    },
    {
      field: "publication",
      headerName: "Publication",
      width: userColumnSettings?.publication || 150,
    },
    {
      field: "url",
      headerName: "URL",
      width: userColumnSettings?.publication || 100,
      renderCell: (params) => (
        <a href={params.value} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      ),
    },

    {
      field: "articleDate",
      headerName: "Article Date",
      width: userColumnSettings?.articleDate || 150,
    },
    {
      field: "socialFeedId",
      headerName: "SocialFeed ID",
      width: userColumnSettings?.socialFeedId || 150,
    },

    { field: "qcDone", headerName: "QC Done", width: 100 },
    { field: "qc1on", headerName: "QC1 On", width: 100 },
    { field: "qc1by", headerName: "QC1 By", width: 100 },
    { field: "qcpartial_on", headerName: "QC Partial On", width: 100 },
    { field: "qcpartial_by", headerName: "QC Partial By", width: 100 },
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
    qc1on: item.qc1on,
    qc1by: item.qc1by,
    qcpartial_on: item.qcpartial_on,
    qcpartial_by: item.qcpartial_by,
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

  const applySortingToRows = useCallback((rows, sortModel) => {
    // If no sort is applied, return the original rows
    if (!sortModel || sortModel.length === 0) {
      return rows;
    }

    const sortedRows = [...rows];
    sortedRows.sort((a, b) => {
      for (const sortItem of sortModel) {
        const { field, sort } = sortItem;

        // If 'sort' is not 'asc' or 'desc', skip this field
        if (!sort || (sort !== "asc" && sort !== "desc")) {
          return 0;
        }

        const valueA = a[field] ?? "";
        const valueB = b[field] ?? "";

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
  }, []);

  const handleSearchModelChange = (searchModel) => {
    const searchQuery = searchModel.value?.toLowerCase();

    if (searchQuery) {
      const filteredRows = rows.filter((row) =>
        Object.values(row).some((field) =>
          field.toString().toLowerCase().includes(searchQuery)
        )
      );
      setSortedFilteredRows(filteredRows);
    } else {
      setSortedFilteredRows(rows);
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

  // Table  columns settings
  const handleColumnResize = (params) => {
    let field = params.colDef.field;
    let width = params.width;
    saveTableSettings("online", "Main", field, width);
  };

  return (
    <>
      <Box sx={{ height: "90vh", width: "100%", mt: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          apiRef={apiRef}
          pageSize={5}
          pageSizeOptions={[25, 50, 100]}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.9em",
            },
          }}
          checkboxSelection
          onColumnResize={handleColumnResize}
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
  sortedFilteredRows: PropTypes.array,
  setSortedFilteredRows: PropTypes.func,
  handleSave: PropTypes.func,
  savePermission: PropTypes.bool,
  deletePermission: PropTypes.bool,
};

export default MainTable;
