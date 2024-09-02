import PropTypes from "prop-types";
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
  GridPagination,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { EditAttributesOutlined } from "@mui/icons-material";
import AttachmentIcon from "@mui/icons-material/Attachment";

// * icons
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const iconCellStyle = {
  display: "flex",
  justifyContent: "left",
  alignItems: "center",
  height: "100%",
};

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
  processRowUpdate,
  gridDataLoading,
  getRowClassName,
  setSortedFilteredRows,
}) => {
  // * custom toolbar
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex" }}>
          <GridToolbarFilterButton />
          <GridPagination />
        </Box>
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: 160,
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

    // {
    //   field: "Thumbnail",
    //   headerName: "Thumbnail",
    //   width: 70,
    //   renderCell: (params) => (
    //     <div style={iconCellStyle}>
    //       <Tooltip
    //         title={
    //           <img
    //             src={
    //               "https://cirrus.co.in/cirrus/JPGViewID.action?ai=03GURGAON-20240705-TIMES_OF_INDIA-0010-0002.pdf&loginreq=N"
    //             }
    //           />
    //         }
    //         placement="right"
    //         arrow
    //       >
    //         <img
    //           src={`https://cirrus.co.in/cirrus/JPGViewID.action?ai=03GURGAON-20240705-TIMES_OF_INDIA-0010-0002.pdf&loginreq=N`}
    //           style={{ width: "70", height: "80" }}
    //           title="PDF"
    //           className="p-1 border rounded-lg"
    //         />
    //       </Tooltip>
    //     </div>
    //   ),
    // },
    {
      field: "headline",
      headerName: "Headlines",
      width: 300,
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
      width: 450,
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
      width: 150,
      editable: true,
    },
    { field: "article_id", headerName: "Article ID", width: 160 },
    { field: "article_date", headerName: "Article Date", width: 150 },
    {
      field: "publication_name",
      headerName: "Publication Name",
      width: 200,
    },
    { field: "page_number", headerName: "Pages", width: 80 },
    { field: "pdfSize", headerName: "PDF Size", width: 100 },

    { field: "uploadTime", headerName: "Upload Time", width: 150 },
    { field: "main_id", headerName: "System Id", width: 150 },
    {
      field: "tagTime",
      headerName: "Tag Time",
      width: 150,
      renderCell: (params) => <a href="#">{params.value}</a>,
    },
    {
      field: "text",
      headerName: "Text",
      width: 100,
      renderCell: (params) => <p>{params.value}</p>,
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

  return (
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
        onSortModelChange={handleSortModelChange}
        onSearchModelChange={handleSearchModelChange}
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
          },
        }}
        hideFooterPagination
        getRowClassName={getRowClassName}
      />
    </Box>
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
};
export default MainTable;
