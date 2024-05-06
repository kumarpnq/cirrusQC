import { makeStyles } from "@mui/styles";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import getHeaderAbbreviation from "../../constants/concatHeader";
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TableCell, TableRow, Tooltip } from "@mui/material";
import { ResearchContext } from "../../context/ContextProvider";
import TableRowCheckBox from "./TableRow";
import { AiOutlineLoading } from "react-icons/ai";
import { EditAttributesOutlined } from "@mui/icons-material";
import UploadDialog from "../editArticle/UploadDialog";
import { TableVirtuoso } from "react-virtuoso";
import TotalRecordsCard from "../../@core/TotalRecords";

const useStyles = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
    marginTop: "1em",
  },
  textField: {
    "& .MuiInputBase-input": {
      fontSize: "0.8em",
    },
  },
  resize: {
    fontSize: "0.8em",
    height: 25,
  },
  headerCheckBox: {
    color: "white",
  },
}));
const MainTable = ({
  tableData,
  searchedData,
  selectedRowData,
  setSelectedRowData,
  sortColumn,
  sortDirection,
  setSortDirection,
  setSortColumn,
  highlightUpdatedRows,
}) => {
  const { tableHeaders, showTableData } = useContext(ResearchContext);
  const classes = useStyles();
  const [checkBoxLoading, setCheckBoxLoading] = useState(false);

  useEffect(() => {
    if (checkBoxLoading) {
      // Add a slight delay before setting checkBoxLoading to false
      const timeoutId = setTimeout(() => {
        setCheckBoxLoading(false);
      }, 200); // Adjust the delay time as needed

      // Cleanup the timeout to avoid memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [checkBoxLoading]);
  const handleMasterCheckboxChange = () => {
    setCheckBoxLoading(true);

    setTimeout(() => {
      const allSelected = selectedRowData.length === tableData.length;

      if (searchedData.length > 0) {
        const allSearchedSelected =
          selectedRowData.length === searchedData.length;

        if (allSearchedSelected) {
          // If all rows in searchedData are already selected, remove them from selectedRowData
          setSelectedRowData((prevSelectedRows) =>
            prevSelectedRows.filter(
              (row) =>
                !searchedData.some(
                  (searchedRow) =>
                    searchedRow.social_feed_id === row.social_feed_id
                )
            )
          );
        } else {
          // Add all rows in searchedData to selectedRowData
          setSelectedRowData((prevSelectedRows) => [
            ...prevSelectedRows,
            ...searchedData.filter(
              (searchedRow) =>
                !prevSelectedRows.some(
                  (selectedRow) =>
                    selectedRow.social_feed_id === searchedRow.social_feed_id
                )
            ),
          ]);
        }
      } else {
        // Toggle selection for all rows in tableData
        setSelectedRowData(allSelected ? [] : [...tableData]);
      }

      setCheckBoxLoading(false);
    }, 1000);
  };

  const handleSort = (clickedHeader) => {
    if (sortColumn === clickedHeader) {
      setSortDirection((prevSortDirection) =>
        prevSortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(clickedHeader);
      setSortDirection("asc");
    }
  };

  //for edit modal
  const [open, setOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const tableRowClick = (item) => {
    setOpen(true);
    setSelectedArticle((prev) => (prev === item ? null : item));
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedArticle(null);
  };

  const dataToRender = searchedData.length > 0 ? searchedData : tableData;

  return (
    <div className="relative mt-2">
      <TotalRecordsCard totalRecords={dataToRender.length} tClass="top-[5%]" />
      {/* {!!dataToRender.length && ( */}
      <TableVirtuoso
        style={{ height: 600 }}
        data={dataToRender}
        fixedHeaderContent={() => (
          <thead>
            <tr className="bg-primary">
              {" "}
              {tableHeaders?.length > 0 && !!dataToRender.length && (
                <th
                  style={{
                    display: "flex",
                    justifyItems: "center",
                    position: "sticky",
                    left: 0,
                  }}
                  className="bg-primary"
                >
                  {checkBoxLoading ? (
                    <div className="mt-1 ml-3 loading-spinner">
                      <AiOutlineLoading />
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      style={{
                        width: "17px",
                        height: "17px",
                        marginLeft: "1rem",
                        marginTop: "0.5rem",
                        cursor: "pointer",
                      }}
                      checked={selectedRowData?.length === tableData.length}
                      onChange={handleMasterCheckboxChange}
                      className={classes.headerCheckBox}
                    />
                  )}
                </th>
              )}
              {!!dataToRender.length && (
                <th className="text-white text-[0.9em] sticky bg-primary pl-3 left-8">
                  Edit
                </th>
              )}
              {showTableData &&
                tableHeaders?.map((header) => (
                  <th
                    key={header}
                    onClick={() =>
                      handleSort(header.toLowerCase().replace(/ /g, "_"))
                    }
                    className={`text-white cursor-pointer font-thin text-xs tracking-widest px-4 ${
                      (header === "COMPANY NAME" && "pl-10") ||
                      (header === "HEADLINE" && "pl-6") ||
                      (header === "PUBLICATION" && "pl-44") ||
                      (header === "LINK" && "pl-10") ||
                      (header === "REPORTING SUBJECT" && "pl-12") ||
                      (header === "AUTHOR NAME" && "pl-[430px]") ||
                      (header === "HEADSUMMARY" && "pl-8") ||
                      (header === "QC1 DONE" && "pl-[290px]") ||
                      (header === "COMPANY ID" && "pl-10") ||
                      (header === "CITY" && "pl-14") ||
                      (header === "LANGUAGE" && "pl-14") ||
                      (header === "QC2 ON" && "pl-16") ||
                      (header === "DETAIL SUMMARY" && "pl-[100PX]")
                    }`}
                  >
                    <span className="flex items-center text-sm">
                      <IoIosArrowRoundUp
                        style={{
                          fontSize: "x-small",
                          color:
                            sortColumn ===
                              header.toLowerCase().replace(/ /g, "_") &&
                            sortDirection === "asc"
                              ? "red"
                              : "#fff",
                        }}
                      />
                      <IoIosArrowRoundDown
                        style={{
                          fontSize: "x-small",
                          color:
                            sortColumn ===
                              header.toLowerCase().replace(/ /g, "_") &&
                            sortDirection === "desc"
                              ? "red"
                              : "#fff",
                        }}
                      />
                    </span>
                    {getHeaderAbbreviation(header)}
                  </th>
                ))}
            </tr>
          </thead>
        )}
        itemContent={(index, rowData) => (
          <TableRow
            key={index}
            className={`${
              selectedRowData.includes(rowData) ? "selected-row" : ""
            } ${highlightUpdatedRows.includes(rowData) ? "updated-row" : ""}`}
          >
            <TableCell
              size="small"
              padding="checkbox"
              style={{
                position: "sticky",
                top: 28,
                left: 0,
                fontSize: "0.8em",
                background: "#ffff",
              }}
              sx={{
                padding: "10px",
              }}
            >
              <TableRowCheckBox
                selectedRowData={selectedRowData}
                rowData={rowData}
                searchedData={searchedData}
                setSelectedRowData={setSelectedRowData}
              />
            </TableCell>
            <TableCell
              onClick={() => tableRowClick(rowData)}
              sx={{ position: "sticky", left: 35, top: 28 }}
              className="bg-white"
            >
              <EditAttributesOutlined className="text-primary" />
            </TableCell>
            {tableHeaders?.map((header) => (
              <React.Fragment key={header}>
                {(header === "HEADLINE" ||
                  header === "REPORTING SUBJECT" ||
                  header === "DETAIL SUMMARY" ||
                  header === "KEYWORD" ||
                  header === "PUBLICATION" ||
                  header === "AUTHOR NAME" ||
                  header === "HEADSUMMARY" ||
                  header === "FEED-ID") && (
                  <TableCell
                    sx={{
                      padding: "10px",
                    }}
                  >
                    <Tooltip
                      title={rowData[header.toLowerCase().replace(/ /g, "_")]}
                      placement="top"
                      enterDelay={1000}
                      leaveDelay={200}
                      TransitionProps={{ timeout: 1500 }}
                    >
                      <div
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          fontSize: "0.8em",
                          backgroundColor:
                            header === "REPORTING SUBJECT" &&
                            rowData[
                              "REPORTING SUBJECT"
                                .toLowerCase()
                                .replace(/ /g, "_")
                            ] === "Unknown"
                              ? "#FF7F7F"
                              : "transparent",
                          color:
                            header === "REPORTING SUBJECT" &&
                            rowData[
                              "REPORTING SUBJECT"
                                .toLowerCase()
                                .replace(/ /g, "_")
                            ] === "Unknown"
                              ? "#fff"
                              : "black",
                        }}
                        className={`text-xs w-26 text-black overflow-hidden whitespace-normal" ${
                          (header === "REPORTING SUBJECT" && "w-16") ||
                          (header === "HEADLINE" && "w-64") ||
                          (header === "DETAIL SUMMARY" && "w-[25rem]") ||
                          (header === "HEADSUMMARY" && "w-[25rem] ml-7") ||
                          (header === "KEYWORD" && "w-40") ||
                          (header === "PUBLICATION" && "w-28") ||
                          (header === "AUTHOR NAME" && "w-10 ml-24")
                        }`}
                      >
                        {rowData[header.toLowerCase().replace(/ /g, "_")]}
                      </div>
                    </Tooltip>
                  </TableCell>
                )}
                {header !== "HEADLINE" &&
                  header !== "REPORTING SUBJECT" &&
                  header !== "DETAIL SUMMARY" &&
                  header !== "KEYWORD" &&
                  header !== "PUBLICATION" &&
                  header !== "AUTHOR NAME" &&
                  header !== "HEADSUMMARY" && (
                    <TableCell size="small">
                      <div
                        className={`text-xs w-16 text-black overflow-hidden whitespace-normal mx-3 ${
                          (header === "SOCIAL FEED ID" && "w-20") ||
                          (header === "LINK" && "w-6") ||
                          (header === "PROMINENCE" && "w-20") ||
                          (header === "QC2 DONE" && "w-4") ||
                          (header === "QC1 DONE" && "w-4") ||
                          (header === "HAS VIDEO" && "w-6") ||
                          (header === "HAS IMAGE" && "w-6")
                        }`}
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          marginLeft: -3,
                          fontSize: "0.8em",
                          backgroundColor:
                            header === "REPORTING TONE" &&
                            rowData[
                              "REPORTING TONE".toLowerCase().replace(/ /g, "_")
                            ] === "Unknown"
                              ? "#FF7F7F"
                              : header === "PROMINENCE" &&
                                rowData[
                                  "PROMINENCE".toLowerCase().replace(/ /g, "_")
                                ] === "Unknown"
                              ? "#FF7F7F"
                              : "transparent",
                          color:
                            header === "REPORTING TONE" &&
                            rowData[
                              "REPORTING TONE".toLowerCase().replace(/ /g, "_")
                            ] === "Unknown"
                              ? "#fff"
                              : header === "PROMINENCE" &&
                                rowData[
                                  "PROMINENCE".toLowerCase().replace(/ /g, "_")
                                ] === "Unknown"
                              ? "#fff"
                              : "black",
                        }}
                      >
                        {rowData[header.toLowerCase().replace(/ /g, "_")]}
                      </div>
                    </TableCell>
                  )}
              </React.Fragment>
            ))}
          </TableRow>
        )}
      />
      {/* )} */}

      <UploadDialog
        open={open}
        handleClose={handleClose}
        selectedRow={selectedArticle}
      />
    </div>
  );
};
MainTable.propTypes = {
  tableData: PropTypes.array,
  selectedRowData: PropTypes.array,
  sortColumn: PropTypes.string,
  sortDirection: PropTypes.oneOf(["asc", "desc"]),
  searchedData: PropTypes.array,
  setSelectedRowData: PropTypes.func,
  setSortDirection: PropTypes.func,
  setSortColumn: PropTypes.func,
  highlightUpdatedRows: PropTypes.array,
};
export default MainTable;
