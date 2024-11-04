import PropTypes from "prop-types";
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
  DataGrid,
  GridCloseIcon,
  GridPagination,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { EditAttributesOutlined } from "@mui/icons-material";
import AttachmentIcon from "@mui/icons-material/Attachment";
import { debounce } from "lodash";

// * icons
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useState } from "react";
import EditDialog from "./EditDialog";
import { toast } from "react-toastify";
import axios from "axios";
import { url } from "../../constants/baseUrl";
import useUserSettings from "../../hooks/useUserSettings";
import { saveTableSettings } from "../../constants/saveTableSetting";

const iconCellStyle = {
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  height: "100%",
};

// * custom toolbar

const MainTable = ({
  gridData,
  apiRef,
  selectionModal,
  setSelectionModal,
  handleSelectionChange,
  handleRowClick,
  handleSimilarClick,
  handleClickAway,
  anchorEls,
  similarLoading,
  childArticles,
  setChildArticles,
  processRowUpdate,
  gridDataLoading,
  getRowClassName,
  setSortedFilteredRows,
  handleSave,
  savePermission,
}) => {
  // * user settings
  const userColumnSettings = useUserSettings("print", "Main");

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex" }}>
          <GridToolbarFilterButton />
          <GridPagination />
        </Box>
        <Box>
          {!!savePermission && (
            <Button size="small" onClick={handleSave}>
              Save
            </Button>
          )}

          <GridToolbarQuickFilter />
        </Box>
      </GridToolbarContainer>
    );
  }

  const [openEditSimilarArticle, setOpenEditSimilarArticle] = useState(false);
  const [selectedSimilarArticle, setSelectedSimilarArticle] = useState({});

  const handleDeleteSimilarArticle = async (id, row) => {
    try {
      const userToken = localStorage.getItem("user");

      const params = {
        parent_id: row?.main_id,
        child_id: id,
      };
      const response = await axios.delete(`${url}ungroupsinglearticle`, {
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
      toast.error("Something went wrong");
    }
  };
  const handleOpenEditSimilarArticle = (row) => {
    const data = {
      id: 0,
      headline: row.headline,
      main_id: row.article,
      default_link: row.default_link,
      link: row.link,
    };
    setSelectedSimilarArticle(data);
    setOpenEditSimilarArticle((pre) => !pre);
  };

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: userColumnSettings?.Action || 160,
      renderCell: (params) => (
        <div style={iconCellStyle}>
          <Box
            sx={{
              display: "flex",
              // flexDirection: "column",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <Tooltip title="View PDF">
              <IconButton>
                <Link
                  to={`/articleview/download-file/${params.row.link}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <PictureAsPdfIcon className="text-primary" />
                </Link>
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit article">
              <IconButton onClick={() => handleRowClick(params.row, params.id)}>
                <EditAttributesOutlined className="text-primary" />
              </IconButton>
            </Tooltip>
            {/* <Grid container spacing={1} justifyContent="center"> */}
            {/* Top Row */}
            {/* <Grid item>
                <Tooltip title="View PDF">
                  <IconButton>
                    <Link
                      to={`/articleview/download-file/${params.row.link}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <PictureAsPdfIcon className="text-primary" />
                    </Link>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="View JPG">
                  <IconButton>
                    <Link
                      to={`/articleview/download-file/${params.row.link}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ImageIcon className="text-primary" />
                    </Link>
                  </IconButton>
                </Tooltip>
              </Grid> */}
            {/* </Grid> */}
            {/* <Grid container spacing={1} justifyContent="center"> */}
            {/* Bottom Row */}
            {/* <Grid item>
                <Tooltip title="View HTML">
                  <IconButton>
                    <Link
                      to={`/articleview/download-file/${params.row.link}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MdHtml className="text-primary" />
                    </Link>
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item>
                <Tooltip title="Edit article">
                  <IconButton
                    onClick={() => handleRowClick(params.row, params.id)}
                  >
                    <EditAttributesOutlined className="text-primary" />
                  </IconButton>
                </Tooltip>
              </Grid> */}
            {/* </Grid> */}
          </Box>
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
                                    <TableCell>
                                      <Tooltip title={row.headline}>
                                        {row.headline.substring(0, 30) + "..."}
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell>{row.page_number}</TableCell>
                                    <TableCell>{row.city}</TableCell>
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

    {
      field: "thumbnail",
      headerName: "Thumbnail",
      width: userColumnSettings?.thumbnail || 70,
      height: 70,
      renderCell: (params) => (
        <div style={iconCellStyle}>
          <Tooltip
            title={
              <Box sx={{ objectFit: "contain" }}>
                <img src={params.row.thumbnail} height={150} width={150} />
              </Box>
            }
            placement="right"
            arrow
          >
            <img
              src={params.row.thumbnail}
              alt="thumbnail"
              style={{ width: "80", height: "100" }}
              title="PDF"
              className="p-1 border rounded-lg shadow-md"
            />
          </Tooltip>
        </div>
      ),
    },
    {
      field: "headline",
      headerName: "Headline",
      width: userColumnSettings?.headline || 300,
      editable: true,
      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "head_summary",
      headerName: "Summary",
      width: userColumnSettings?.head_summary || 450,
      editable: true,

      renderCell: (params) => (
        <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "journalist",
      headerName: "Journalist",
      width: userColumnSettings?.journalist || 150,
      editable: true,
    },
    {
      field: "article_id",
      headerName: "Article ID",
      width: userColumnSettings?.article_id || 160,
    },
    {
      field: "article_date",
      headerName: "Article Date",
      width: userColumnSettings?.article_date || 150,
    },
    {
      field: "publication_name",
      headerName: "Publication Name",
      width: userColumnSettings?.publication_name || 200,
    },
    {
      field: "page_number",
      headerName: "Page",
      width: userColumnSettings?.page_number || 80,
    },
    {
      field: "pdfSize",
      headerName: "PDF Size",
      width: userColumnSettings?.pdfSize || 100,
    },

    {
      field: "main_id",
      headerName: "System Id",
      width: userColumnSettings?.main_id || 150,
    },

    { field: "uploadTime", headerName: "Upload Time", width: 150 },
    { field: "qc1on", headerName: "QC1 On", width: 150 },
    { field: "qc1by", headerName: "QC1 By", width: 150 },
    { field: "qcpartial_on", headerName: "QC Partial On", width: 150 },
    { field: "qcpartial_by", headerName: "QC Partial By", width: 150 },

    {
      field: "tagTime",
      headerName: "Tag Time",
      width: userColumnSettings?.tagTime || 150,
      renderCell: (params) => <a href="#">{params.value}</a>,
    },
    {
      field: "text",
      headerName: "Text",
      width: userColumnSettings?.text || 100,
      renderCell: (params) => (
        <p>
          {" "}
          {params.value.length > 30
            ? `${params.value.substring(0, 30)}...`
            : params.value}
        </p>
      ),
    },
  ];

  const rows = gridData?.map((item, index) => ({
    id: index,
    headline: item.headline,
    head_summary: item.head_summary,
    article_id: item.article_id,
    article_date: item.article_date,
    publication_name: item.publication_name,
    page_number: item.page_number,
    pdfSize: item.pdfSize,
    journalist: item.journalist,
    uploadTime: item.upload_time,
    defaultLink: item.default_link,
    main_id: item.id,
    similar_articles: item.similar_articles,
    link: item.link,
    text: item.text,
    thumbnail: item.thumbnail,
    qc1on: item.qc1on || "",
    qc1by: item.qc1by || "",
    qcpartial_on: item.qcpartial_on || "",
    qcpartial_by: item.qcpartial_by || "",
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

  const handleSortModelChange = (sortModel) => {
    const sortedRows = applySortingToRows(rows, sortModel);

    setSortedFilteredRows(sortedRows);
  };
  const debouncedHandleFilterModelChange = debounce((filterModel) => {
    const filteredRows = applyFilteringToRows(rows, filterModel);
    setSortedFilteredRows(filteredRows);
  }, 1000);
  const handleFilterModelChange = (filterModel) => {
    debouncedHandleFilterModelChange(filterModel);
  };

  // * resize column
  const handleColumnResize = (params) => {
    let field = params.colDef.field;
    let width = params.width;
    saveTableSettings("print", "Main", field, width);
  };

  return (
    <>
      <Box sx={{ height: 600, width: "100%", mt: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          density="compact"
          getRowHeight={() => "auto"}
          checkboxSelection
          apiRef={apiRef}
          onColumnResize={handleColumnResize}
          onSortModelChange={handleSortModelChange}
          onFilterModelChange={handleFilterModelChange}
          ignoreValueFormatterDuringExport
          rowSelectionModel={selectionModal}
          onRowSelectionModelChange={(ids) => {
            setSelectionModal(ids);
            handleSelectionChange(ids);
          }}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontSize: "0.875rem",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.9em",
            },
            root: {
              "& .MuiDataGrid-cell": {
                whiteSpace: "normal",
                wordWrap: "break-word",
              },
            },
          }}
          processRowUpdate={processRowUpdate}
          loading={gridDataLoading && <CircularProgress />}
          disableDensitySelector
          disableColumnSelector
          disableRowSelectionOnClick
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: {
                autoFocus: true,
              },
            },
          }}
          hideFooterPagination
          getRowClassName={getRowClassName}
        />
      </Box>
      <EditDialog
        open={openEditSimilarArticle}
        setOpen={setOpenEditSimilarArticle}
        row={selectedSimilarArticle}
        rowNumber={0}
        selectedItems={[]}
        isMultiple={false}
        setSelectedItems={() => {}}
        setSelectionModal={setSelectionModal}
      />
    </>
  );
};

MainTable.propTypes = {
  gridData: PropTypes.array.isRequired,
  apiRef: PropTypes.object.isRequired,
  selectionModal: PropTypes.array.isRequired,
  setSelectionModal: PropTypes.func.isRequired,
  handleSelectionChange: PropTypes.func.isRequired,
  handleRowClick: PropTypes.func.isRequired,
  handleSimilarClick: PropTypes.func.isRequired,
  handleClickAway: PropTypes.func.isRequired,
  anchorEls: PropTypes.object.isRequired,
  similarLoading: PropTypes.bool.isRequired,
  childArticles: PropTypes.array.isRequired,
  processRowUpdate: PropTypes.func.isRequired,
  gridDataLoading: PropTypes.bool.isRequired,
  CustomToolbar: PropTypes.elementType.isRequired,
  getRowClassName: PropTypes.func.isRequired,
  setSortedFilteredRows: PropTypes.func.isRequired,
  setChildArticles: PropTypes.func.isRequired,
  handleSave: PropTypes.func,
  savePermission: PropTypes.bool,
};
export default MainTable;
