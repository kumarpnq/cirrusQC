import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { FindSection } from "./find-section/FindSection";
import EditSection from "./edit-section/EditSection";
import Loader from "../components/loader/Loader";
import { AiOutlineLoading } from "react-icons/ai";
import Pagination from "../components/pagination/Pagination";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import EditModal from "./editModal/editModal";
import { url } from "../constants/baseUrl";
import { EditAttributesOutlined } from "@mui/icons-material";

const Qc2Table = ({
  isTableDataLoading,
  qc2PrintTableData,
  setQc2PrintTableData,
  totalRecordsCount,
  setFetchingUsingPrevNext,
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

    if (qc2PrintTableData?.length > 0) {
      const sortedData = [...qc2PrintTableData].sort((a, b) => {
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
      setQc2PrintTableData(sortedData);
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

  return (
    <>
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
        setHighlightRows={setHighlightRows}
        setRetrieveAfterSave={setRetrieveAfterSave}
        selectedArticle={selectedArticle}
      />
      <Pagination
        tableData={qc2PrintTableData}
        setFetchingUsingPrevNext={setFetchingUsingPrevNext}
        totalRecordsCount={totalRecordsCount}
      />
      {isTableDataLoading || tableLoading ? (
        <Loader />
      ) : (
        <div className="overflow-scroll border border-gray-200 shadow h-[550px] sm:rounded-lg">
          {dataToRender?.length > 0 ? (
            <table className="sticky min-w-full divide-y divide-gray-200 top-10">
              <thead className="sticky top-0 text-white bg-primary">
                <tr>
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
                        checked={selectedItems?.length === dataToRender.length}
                        onChange={handleMasterCheckboxChange}
                      />
                    )}
                  </th>
                  <th
                    scope="col"
                    className={`px-2 py-1 text-left text-xs font-medium uppercase tracking-wider cursor-pointer whitespace-nowrap pt-2 pr-2 sticky left-14 bg-primary`}
                  >
                    Edit
                  </th>
                  {tableHeaders.map((item) => (
                    <th
                      key={item}
                      scope="col"
                      className={`px-3 py-1 text-left text-xs font-medium uppercase tracking-wider cursor-pointer whitespace-nowrap`}
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
              <tbody className="bg-white divide-y divide-gray-200 text-[0.8em]">
                {dataToRender.map((items, index) => (
                  <tr
                    key={index}
                    className={` ${
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
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="truncate w-28">{items.company}</div>
                    </td>
                    <Tooltip
                      placement="top"
                      title={items.headline}
                      enterDelay={1000}
                    >
                      <td className="px-3 py-4">
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
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="w-48 truncate">{items.publication}</div>
                    </td>
                    <td className="px-4 py-4 underline whitespace-nowrap">
                      <a
                        href={`${url}${items.link}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        link
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {items.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {items.header_space}
                    </td>
                    <td>
                      <div
                        className={`px-6 whitespace-nowrap ${
                          items.m_prom === "Unknown" &&
                          "bg-[#FF7F7F] text-white"
                        }`}
                      >
                        {items.m_prom}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.space}
                    </td>
                    <td>
                      <div
                        className={`px-3 whitespace-nowrap ${
                          items.reporting_tone === "Unknown" &&
                          "bg-[#FF7F7F] text-white"
                        }`}
                      >
                        {items.reporting_tone}
                      </div>
                    </td>

                    <td>
                      <div
                        className={`px-3 whitespace-nowrap ${
                          items.reporting_subject === "Unknown" &&
                          "bg-[#FF7F7F] text-white"
                        }`}
                      >
                        {items.reporting_subject}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.remark}
                    </td>
                    <td className="px-3 py-4 overflow-hidden">
                      <div
                        className="w-52"
                        style={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                        }}
                      >
                        {items.keyword}
                      </div>
                    </td>
                    <Tooltip
                      placement="top"
                      title={items.detail_summary}
                      enterDelay={1000}
                    >
                      <td className="px-3 py-4 overflow-hidden">
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
                      </td>
                    </Tooltip>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {items.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {items.subcategory}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.city_name}
                    </td>
                    <Tooltip
                      placement="top"
                      title={items.head_summary}
                      enterDelay={1000}
                    >
                      <td className="px-2 py-4 ">
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
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.article_id}
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.company_id}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.article_date}
                    </td>

                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.upload_date}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">{items.box}</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.box_value}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.photo}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.photo_value}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.page_number}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.page_value}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.qc1_done}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.qc2_done}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.qc1_by}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.qc1_on}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.qc2_by}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {items.qc2_on}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <span className="block mt-2 text-center">No Data Found.</span>
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
    </>
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
