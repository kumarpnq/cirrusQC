import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Box, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { FindSection } from "./find-section/FindSection";
import EditSection from "./edit-section/EditSection";
import Loader from "../components/loader/Loader";
import { AiOutlineLoading } from "react-icons/ai";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import EditModal from "./editModal/editModal";
import { EditAttributesOutlined } from "@mui/icons-material";
import { TableVirtuoso } from "react-virtuoso";
import TotalRecordsCard from "../@core/TotalRecords";
import RadialMenu from "../@core/RadialMenu";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useMovieData } from "@mui/x-data-grid-generator";

const Qc2Table = ({
  isTableDataLoading,
  qc2PrintTableData,
  setQc2PrintTableData,
  // totalRecordsCount,
  // setFetchingUsingPrevNext,
  setRetrieveAfterSave,
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  // tableheaders
  const [tableHeaders, setTableHeaders] = useState([]);
  // searchedData
  const [searchedData, setSearchedData] = useState([]);
  // single article selection for edit
  const [selectedArticle, setSelectedArticle] = useState(null);
  // for highlight the rows
  const [highlightRows, setHighlightRows] = useState([]);
  // loading states
  const [tableLoading, setTableLoading] = useState(false);
  const [masterCheckBoxLoading, setMasterCheckBoxLoading] = useState(false);
  const [checkBoxLoading, setCheckBoxLoading] = useState(false);
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortedAscending, setSortedAscending] = useState(true);

  useEffect(() => {
    if (qc2PrintTableData && qc2PrintTableData?.length > 0) {
      const header = Object.keys(qc2PrintTableData[0]);
      setTableHeaders(header);
    }
  }, [qc2PrintTableData]);

  const handleMasterCheckboxChange = () => {
    setMasterCheckBoxLoading(true);
    setTimeout(() => {
      if (searchedData.length > 0) {
        const allSearchedSelected =
          selectedItems.length === searchedData.length;
        if (allSearchedSelected) {
          setSelectedItems((prevSelectedRows) =>
            prevSelectedRows.filter(
              (row) =>
                !searchedData.some(
                  (searchedRow) =>
                    searchedRow.article_id === row.article_id &&
                    searchedRow.company_id === row.company_id
                )
            )
          );
        } else {
          setSelectedItems((prevSelectedRows) => [
            ...prevSelectedRows,
            ...searchedData.filter(
              (searchedRow) =>
                !prevSelectedRows.some(
                  (selectedRow) =>
                    selectedRow.article_id === searchedRow.article_id &&
                    selectedRow.company_id === searchedRow.company_id
                )
            ),
          ]);
        }
      } else {
        setSelectedItems((selectedItems) =>
          selectedItems.length === qc2PrintTableData.length
            ? []
            : [...qc2PrintTableData]
        );
      }
      setMasterCheckBoxLoading(false);
    }, 0);
  };

  const handleCheckboxChange = (item) => {
    setCheckBoxLoading(true);

    setTimeout(() => {
      setSelectedItems((prev) => {
        if (!Array.isArray(prev)) {
          prev = [];
        }
        const isSelected = prev.some(
          (row) =>
            row.article_id === item.article_id &&
            row.company_id === item.company_id
        );
        if (isSelected) {
          return prev.filter(
            (row) =>
              !(
                row.article_id === item.article_id &&
                row.company_id === item.company_id
              )
          );
        } else {
          if (searchedData.length > 0) {
            if (searchedData.includes(item)) {
              return [...prev, item];
            }
          } else {
            return [...prev, item];
          }
        }
        return prev;
      });
      setCheckBoxLoading(false);
    }, 0);
  };

  const sortTableData = (header) => {
    setSortedColumn(header);
    setSortedAscending((prev) => (header === sortedColumn ? !prev : true));

    // Determine which data set to sort
    const data = searchedData.length > 0 ? searchedData : qc2PrintTableData;

    if (data.length > 0) {
      const sortedData = [...data].sort((a, b) => {
        const valueA =
          typeof a[header] === "string" ? a[header] : String(a[header]);
        const valueB =
          typeof b[header] === "string" ? b[header] : String(b[header]);

        if (isNaN(valueA) || isNaN(valueB)) {
          return sortedAscending
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          return sortedAscending ? valueA - valueB : valueB - valueA;
        }
      });

      // Set the sorted data back to the appropriate state
      if (searchedData.length > 0) {
        setSearchedData(sortedData);
      } else {
        setQc2PrintTableData(sortedData);
      }
    }
  };

  const dataToRender =
    searchedData.length > 0 ? searchedData : qc2PrintTableData;

  //for edit modal
  const [open, setOpen] = useState(false);
  const [editedSingleArticle, setEditedSingleArticle] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setSelectedArticle(null);
    setEditedSingleArticle(null);
  };

  const tableRowClick = (item) => {
    setOpen(true);
    setSelectedArticle((prev) => (prev === item ? null : item));
  };
  const handleMoveModifiedRows = () => {
    const highlightedSet = new Set(
      highlightRows.map((row) => `${row.article_id}-${row.company_id}`)
    );

    const filteredData = qc2PrintTableData.filter(
      (row) => !highlightedSet.has(`${row.article_id}-${row.company_id}`)
    );

    // Get the highlighted rows
    const highlightedData = qc2PrintTableData.filter((row) =>
      highlightedSet.has(`${row.article_id}-${row.company_id}`)
    );

    setQc2PrintTableData([...highlightedData, ...filteredData]);
  };

  const VISIBLE_FIELDS = [
    "title",
    "company",
    "director",
    "year",
    "cinematicUniverse",
  ];

  const data = useMovieData();

  console.log(data);

  const columns = useMemo(
    () =>
      data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns]
  );

  return (
    <div className="relative">
      <FindSection
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        qc2PrintTableData={qc2PrintTableData}
        setSearchedData={setSearchedData}
        setTableLoading={setTableLoading}
      />
      <EditSection
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        qc2PrintTableData={qc2PrintTableData}
        setQc2PrintTableData={setQc2PrintTableData}
        searchedData={searchedData}
        setSearchedData={setSearchedData}
        highlightRows={highlightRows}
        setHighlightRows={setHighlightRows}
        setRetrieveAfterSave={setRetrieveAfterSave}
        selectedArticle={selectedArticle}
      />
      <Box sx={{ display: "flex" }}>
        <TotalRecordsCard
          totalRecords={dataToRender.length}
          tClass="top-[27%]"
        />
        <RadialMenu
          onMoveTop={handleMoveModifiedRows}
          totalRows={qc2PrintTableData.length}
          modifiedRows={highlightRows.length}
        />
      </Box>
      <Box sx={{ height: 400, width: 1 }}>
        <DataGrid
          {...data}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          columns={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>

      {/* <button onClick={handleMoveModifiedRows}>Move to top</button> */}
      {isTableDataLoading || tableLoading ? (
        <Loader />
      ) : (
        <div className="mt-2 border border-gray-200 sm:rounded-lg">
          {!!dataToRender.length && (
            <TableVirtuoso
              style={{ height: 600 }}
              data={dataToRender}
              fixedHeaderContent={() => (
                <thead className="sticky top-0 text-white bg-primary">
                  <tr className="border border-black">
                    <th
                      scope="col"
                      className="sticky left-0 px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer bg-primary"
                    >
                      {masterCheckBoxLoading ? (
                        <div className="absolute mb-3 mr-2 loading-spinner">
                          <AiOutlineLoading />
                        </div>
                      ) : (
                        <input
                          type="checkbox"
                          checked={
                            selectedItems?.length === dataToRender.length
                          }
                          onChange={handleMasterCheckboxChange}
                        />
                      )}
                    </th>
                    {!!dataToRender.length && (
                      <th
                        scope="col"
                        className={`px-2 py-1 text-left text-xs font-medium uppercase tracking-wider cursor-pointer whitespace-nowrap pt-2 pr-2 sticky left-14 bg-primary`}
                      >
                        Edit
                      </th>
                    )}

                    {tableHeaders.map((item) => (
                      <th
                        key={item}
                        scope="col"
                        className={`px-3 py-1 text-left text-xs font-medium uppercase tracking-wider cursor-pointer whitespace-nowrap ${
                          (item === "headline" && "pl-8") ||
                          (item === "publication" && "pl-44") ||
                          (item === "link" && "pl-32") ||
                          (item === "header_space" && "pl-[135px]") ||
                          (item === "space" && "pl-16") ||
                          (item === "reporting_tone" && "pl-16") ||
                          (item === "reporting_subject" && "pl-16") ||
                          (item === "remark" && "pl-16") ||
                          (item === "keyword" && "pl-36") ||
                          (item === "detail_summary" && "pl-44") ||
                          (item === "category" && "pl-36") ||
                          (item === "subcategory" && "pl-44") ||
                          (item === "city_name" && "pl-[120px]") ||
                          (item === "head_summary" && "pl-10") ||
                          (item === "article_id" && "pl-36") ||
                          (item === "company_id" && "pl-8") ||
                          (item === "article_date" && "pl-8") ||
                          (item === "upload_date" && "4") ||
                          (item === "box" && "pl-8") ||
                          (item === "box_value" && "pl-8") ||
                          (item === "qc1_on" && "pl-28") ||
                          (item === "qc2_by" && "pl-28") ||
                          (item === "qc2_on" && "pl-44 pr-20")
                        }`}
                        onClick={() => sortTableData(item)}
                      >
                        <span className="flex">
                          <IoIosArrowRoundUp
                            style={{
                              color:
                                item === sortedColumn
                                  ? sortedAscending
                                    ? "green"
                                    : "red"
                                  : "",
                              fontSize: "x-small",
                            }}
                          />
                          <IoIosArrowRoundDown
                            style={{
                              color:
                                item === sortedColumn
                                  ? sortedAscending
                                    ? "red"
                                    : "green"
                                  : "",
                              fontSize: "x-small",
                            }}
                          />
                        </span>
                        {item.toUpperCase().replace(/_/g, " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              itemContent={(index, items) => (
                <tbody className="bg-white divide-y divide-gray-200 text-[0.8em]">
                  <tr
                    key={index}
                    className={`border borer-black ${
                      selectedItems.includes(items) ? "selected-row" : ""
                    } ${highlightRows.includes(items) ? "updated-row" : ""}`}
                  >
                    <td className="sticky left-0 px-6 py-2 bg-white top-10 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(items)}
                        onChange={() => handleCheckboxChange(items)}
                      />
                    </td>
                    <td
                      onClick={() => tableRowClick(items)}
                      className="sticky font-thin text-gray-800 bg-white top-10 left-14"
                    >
                      <EditAttributesOutlined className="text-primary" />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="truncate w-28">{items.company}</div>
                    </td>
                    <Tooltip
                      placement="top"
                      title={items.headline}
                      enterDelay={1000}
                    >
                      <td className="py-2">
                        <div
                          className="w-60"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                        >
                          {items.headline}
                        </div>
                      </td>
                    </Tooltip>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div
                        className="w-48 text-left truncate"
                        style={{ minWidth: 200 }}
                      >
                        {items.publication}
                      </div>
                    </td>
                    <td className="w-10 px-3 py-2 underline whitespace-nowrap">
                      <Link
                        to={`/articleview/download-file/${items?.link}`}
                        target="_blank"
                      >
                        link
                      </Link>
                    </td>
                    <td
                      className="px-3 py-2 truncate"
                      style={{ minWidth: "200px" }}
                    >
                      <div className="truncate" style={{ width: "200px" }}>
                        <Tooltip title={items.author}>{items.author}</Tooltip>
                      </div>
                    </td>
                    <td className="py-2" style={{ width: "100px" }}>
                      <div
                        style={{ width: "100px" }}
                        className="pr-12 text-right"
                      >
                        {items.header_space}
                      </div>
                    </td>
                    {/* <div style={{ width: "100px" }} className="border"> */}
                    <td className="px-3">
                      <div
                        style={{
                          width: 100,
                          color: items.m_prom === "Unknown" && "white",
                          backgroundColor:
                            items.m_prom === "Unknown" && "#FF7F7F",
                        }}
                      >
                        {items.m_prom}
                      </div>
                    </td>
                    {/* </div> */}

                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: 100 }} className="text-right pr-14">
                        {items.space}
                      </div>
                    </td>
                    <td>
                      <div
                        className={`whitespace-nowrap ${
                          items.reporting_tone === "Unknown" &&
                          "bg-[#FF7F7F] text-white"
                        }`}
                        style={{ width: "200px" }}
                      >
                        {items.reporting_tone}
                      </div>
                    </td>

                    <td className="border">
                      <div
                        className={`px-3 whitespace-nowrap ${
                          items.reporting_subject === "Unknown" &&
                          "bg-[#FF7F7F] text-white"
                        }`}
                        style={{ width: "200px" }}
                      >
                        {items.reporting_subject}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "200px" }}>{items.remark}</div>
                    </td>
                    <td className="px-3 py-2 overflow-hidden">
                      <div
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                          width: 200,
                        }}
                      >
                        {items.keyword}
                      </div>
                    </td>

                    <td className="px-3 py-2 overflow-hidden">
                      <Tooltip
                        placement="top"
                        title={items.detail_summary}
                        enterDelay={1000}
                      >
                        <div
                          className="w-60"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                        >
                          {items.detail_summary}
                        </div>
                      </Tooltip>
                    </td>

                    <td className="px-6 py-2 whitespace-nowrap">
                      <div style={{ width: "200px" }}>{items.category}</div>
                    </td>
                    <td className="px-6 py-2 whitespace-nowrap">
                      <div style={{ width: "200px" }}>{items.subcategory}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "100px" }}>{items.city_name}</div>
                    </td>
                    <Tooltip
                      placement="top"
                      title={items.head_summary}
                      enterDelay={1000}
                    >
                      <td className="px-2 py-2">
                        <div
                          className="w-60"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                            overflow: "hidden",
                          }}
                        >
                          {items.head_summary}
                        </div>
                      </td>
                    </Tooltip>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "100px" }}>{items.article_id}</div>
                    </td>

                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "100px" }}>{items.company_id}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "100px" }}>{items.article_date}</div>
                    </td>

                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "100px" }}>{items.upload_date}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "50px" }}>{items.box}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "50px" }}>{items.box_value}</div>
                    </td>
                    <td className="px-1 py-2 pl-8 whitespace-nowrap">
                      <div style={{ width: "50px" }}>{items.photo}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "50px" }}>{items.photo_value}</div>
                    </td>
                    <td className="py-2 pl-12 whitespace-nowrap">
                      <div style={{ width: "50px" }}>{items.page_number}</div>
                    </td>
                    <td className="py-2 pl-16 whitespace-nowrap">
                      <div style={{ width: "50px" }}>{items.page_value}</div>
                    </td>
                    <td className="py-2 pl-16 whitespace-nowrap">
                      <div style={{ width: "50px" }}>{items.qc1_done}</div>
                    </td>
                    <td className="py-2 pl-8 whitespace-nowrap">
                      <div style={{ width: "50px" }}>{items.qc2_done}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "150px" }}>{items.qc1_by}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "150px" }}>{items.qc1_on}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "150px" }}>{items.qc2_by}</div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div style={{ width: "200px" }}>{items.qc2_on}</div>
                    </td>
                  </tr>
                </tbody>
              )}
            />
          )}
        </div>
      )}
      <EditModal
        open={open}
        handleClose={handleClose}
        selectedArticle={selectedArticle}
        editedSingleArticle={editedSingleArticle}
        setEditedSingleArticle={setEditedSingleArticle}
      />
    </div>
  );
};
Qc2Table.propTypes = {
  isTableDataLoading: PropTypes.bool,
  qc2PrintTableData: PropTypes.arrayOf(
    PropTypes.shape({
      // Define the shape of each object in the array
      // Example:
      // id: PropTypes.number.isRequired,
      // name: PropTypes.string.isRequired,
      // ...
    })
  ).isRequired,
  setQc2PrintTableData: PropTypes.func.isRequired,
  totalRecordsCount: PropTypes.number,
  setFetchingUsingPrevNext: PropTypes.func,
  setRetrieveAfterSave: PropTypes.func,
};
export default Qc2Table;
