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
import { IoDocumentAttachOutline } from "react-icons/io5";
import { GrView } from "react-icons/gr";
import { format } from "date-fns";

// * icons
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useState } from "react";
import EditDialog from "./EditDialog";
import { toast } from "react-toastify";
import axios from "axios";
import { url } from "../../constants/baseUrl";
import useUserSettings from "../../hooks/useUserSettings";
import { saveTableSettings } from "../../constants/saveTableSetting";
import EditTextarea from "../../@core/EditTextarea";
import ArticleView from "./ArticleView";
import axiosInstance from "../../../axiosConfigOra";

const iconCellStyle = {
  display: "flex",

  alignItems: "center",
  height: "100%",
  flexDirection: "Column",
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
  deletePermission,
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
      </GridToolbarContainer>
    );
  }

  const [openEditSimilarArticle, setOpenEditSimilarArticle] = useState(false);
  const [selectedSimilarArticle, setSelectedSimilarArticle] = useState({});
  const [anchorEls2, setAnchorEls2] = useState({});
  const [openArticleView, setOpenArticleView] = useState(false);
  const [idForView, setIdForView] = useState(null);
  const [stitchLoading, setStitchLoading] = useState(false);
  const [stitchedArticles, setStitchedArticles] = useState([]);

  const handleOpenArticleView = (id) => {
    setIdForView(id);
    setOpenArticleView(true);
  };

  const handleCloseArticleView = () => {
    setIdForView(null);
    setOpenArticleView(false);
  };

  const handleStitchClick = async (event, params) => {
    const articleId = params.row.main_id;

    const index = params.id;
    setAnchorEls2((prev) => ({
      ...prev,
      [index]: prev[index] ? null : event.currentTarget,
    }));

    try {
      setStitchLoading(false);

      const response = await axiosInstance.get(
        `${url}getsticharticles/?parent_id=${articleId}`
      );

      setStitchedArticles(response.data.articles.stiched_articles || []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setStitchLoading(false);
    }
  };

  const handleClickAwayStitch = (index) => {
    setStitchedArticles([]);
    setAnchorEls2(null);
    setAnchorEls2((prev) => ({
      ...prev,
      [index]: null,
    }));
  };

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

  const multilineColumn = {
    type: "string",
    renderEditCell: (params) => <EditTextarea {...params} />,
  };

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: userColumnSettings?.Action || 87,
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
          </Box>
          <Box>
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
                <ClickAwayListener
                  onClickAway={() => handleClickAway(params.id)}
                >
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
                              <TableCell sx={{ color: "#ffff" }}>
                                Edit
                              </TableCell>
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
                              <TableCell sx={{ color: "#ffff" }}>
                                Page
                              </TableCell>
                              <TableCell sx={{ color: "#ffff" }}>
                                City
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
                                        <Tooltip title={row.headline}>
                                          {row.headline.substring(0, 30) +
                                            "..."}
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
            {params.row.stitch_articles === "Yes" && (
              <Tooltip title="View Stitched articles">
                <IconButton
                  onClick={(event) => handleStitchClick(event, params)}
                  aria-describedby={params.id}
                >
                  <IoDocumentAttachOutline className="text-primary" />
                </IconButton>
              </Tooltip>
            )}

            <ClickAwayListener
              onClickAway={() => handleClickAwayStitch(params.id)}
            >
              <Popper
                id={params.id}
                open={Boolean(anchorEls2[params.id])}
                anchorEl={anchorEls2[params.id]}
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
                        <TableCell sx={{ color: "#fff" }}>View</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Article Id</TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Article Date
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>
                          Publication Name
                        </TableCell>
                        <TableCell sx={{ color: "#fff" }}>Headline</TableCell>
                        <TableCell sx={{ color: "#fff" }}>Page</TableCell>
                      </TableHead>
                      {stitchedArticles.length === 0 ? (
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <CircularProgress />
                              </Box>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      ) : (
                        stitchedArticles.map((item, index) => (
                          <TableBody key={index}>
                            <TableRow>
                              <TableCell>
                                <IconButton
                                  onClick={() =>
                                    handleOpenArticleView(item.link)
                                  }
                                >
                                  <GrView className="text-primary" />
                                </IconButton>
                              </TableCell>
                              <TableCell>{item.article_id}</TableCell>
                              <TableCell>
                                {format(
                                  new Date(item.article_date),
                                  "yyyy-MM-dd"
                                )}
                              </TableCell>
                              <TableCell>{item.publication_name}</TableCell>
                              <TableCell>{item.headlines}</TableCell>
                              <TableCell>{item.page_number}</TableCell>
                            </TableRow>
                          </TableBody>
                        ))
                      )}
                    </Table>
                  </TableContainer>
                </Box>
              </Popper>
            </ClickAwayListener>
          </Box>
        </div>
      ),
    },

    {
      field: "thumbnail",
      headerName: "Thumbnail",
      width: userColumnSettings?.thumbnail || 100,
      height: 100,
      renderCell: (params) => (
        <div style={iconCellStyle}>
          <Tooltip
            title={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                  width: 200,
                  overflow: "hidden", // To avoid any overflow beyond the container
                  backgroundPosition: "center", // Centers the image
                  backgroundClip: "unset", // Removes clipping
                  objectFit: "contain", // Ensures the entire image fits within the box without cropping
                  padding: 0, // Ensures no internal padding causing overflow
                }}
              >
                <img
                  src={params.row.thumbnail}
                  alt="Thumbnail"
                  style={{
                    width: "100%", // Ensures the image scales with the width of the container
                    height: "auto", // Adjusts height to maintain aspect ratio
                    objectFit: "contain", // Maintains the aspect ratio and makes sure the image fits in the container
                    display: "block", // Removes any unwanted spacing around the image
                    margin: "auto", // Centers the image if it's smaller than the container
                  }}
                />
              </Box>
            }
            placement="right"
            arrow
          >
            <img
              src={params.row.thumbnail}
              alt="thumbnail"
              style={{
                // backgroundImage: `url(${params.row.thumbnail})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "80px", // Thumbnail size
                height: "100px", // Thumbnail size
              }}
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
      ...multilineColumn,
      // renderCell: (params) => (
      //   <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
      //     {params.value}
      //   </div>
      // ),
    },
    {
      field: "head_summary",
      headerName: "Summary",
      width: userColumnSettings?.head_summary || 450,
      editable: true,
      ...multilineColumn,
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "pre-wrap", // Ensures text wraps onto the next line
            wordWrap: "break-word", // Breaks long words to fit within the cell
            maxHeight: "4.5em", // Limits the height to approximately 4 lines
            overflow: "hidden", // Prevents overflow of content
            lineHeight: "1.2", // Ensures proper line spacing for text
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "journalist",
      headerName: "Journalist",
      width: userColumnSettings?.journalist || 150,
      editable: true,
      ...multilineColumn,
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
    stitch_articles: item.stitch_articles,
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
      <Box sx={{ height: "90vh", width: "100%", mt: 1 }}>
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
          editMode="row"
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
      <ArticleView
        open={openArticleView}
        setOpen={setOpenArticleView}
        handleClose={handleCloseArticleView}
        id={idForView}
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
  deletePermission: PropTypes.bool,
};
export default MainTable;
