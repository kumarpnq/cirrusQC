import { makeStyles } from "@mui/styles";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import getHeaderAbbreviation from "../../constants/concatHeader";
import React, { memo, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TableCell, TableRow, Tooltip } from "@mui/material";
import { ResearchContext } from "../../context/ContextProvider";
import TableRowCheckBox from "./TableRow";
import { AiOutlineLoading } from "react-icons/ai";

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
  const renderTableData = () => {
    const dataToRender = searchedData.length > 0 ? searchedData : tableData;

    return tableData.length > 0 && showTableData ? (
      dataToRender.map((rowData, rowIndex) => (
        <TableRow
          key={rowIndex}
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
          {tableHeaders?.map((header) => (
            <React.Fragment key={header}>
              {(header === "HEADLINE" ||
                header === "REPORTING SUBJECT" ||
                header === "DETAIL SUMMARY" ||
                header === "KEYWORD" ||
                header === "PUBLICATION" ||
                header === "AUTHOR" ||
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
                      }}
                      className={`text-xs w-26 text-black overflow-hidden whitespace-normal" ${
                        (header === "REPORTING SUBJECT" && "w-16") ||
                        (header === "HEADLINE" && "w-64") ||
                        (header === "DETAIL SUMMARY" && "w-[25rem]") ||
                        (header === "HEADSUMMARY" && "w-[25rem]") ||
                        (header === "KEYWORD" && "w-40") ||
                        (header === "PUBLICATION" && "w-28")
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
                header !== "AUTHOR" &&
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
      ))
    ) : (
      <table className="bg-white w-screen border h-screen text-gray-400 text-sm text-center py-4"></table>
    );
  };
  return (
    <div className="mt-2 overflow-scroll h-screen">
      <table>
        <thead>
          <tr className="sticky left-0 top-0 bg-primary">
            {" "}
            {tableHeaders?.length > 0 && (
              <td
                style={{
                  display: "flex",
                  justifyItems: "center",
                  position: "sticky",
                  left: 0,
                }}
                className="bg-primary"
              >
                {checkBoxLoading ? (
                  <div className="loading-spinner ml-3 mt-1">
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
              </td>
            )}
            {showTableData &&
              tableHeaders?.map((header) => (
                <td
                  key={header}
                  onClick={() =>
                    handleSort(header.toLowerCase().replace(/ /g, "_"))
                  }
                  className={
                    "text-white cursor-pointer font-thin text-xs tracking-widest"
                  }
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
                  <span className="ml-2">{getHeaderAbbreviation(header)}</span>
                </td>
              ))}
          </tr>
        </thead>
        <tbody className="bg-thirdOne">{renderTableData()}</tbody>
      </table>
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
export default memo(MainTable);
