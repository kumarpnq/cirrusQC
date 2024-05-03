import { useContext, useState, Fragment, useEffect } from "react";
import {
  Box,
  FormGroup,
  FormControlLabel,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import { EditAttributesOutlined } from "@mui/icons-material";
import BasicTabs from "../dump-components/customTabPanel";
import { formattedDate, formattedNextDay } from "../constants/dates";
import FromDate from "../components/research-dropdowns/FromDate";
import ToDate from "../components/research-dropdowns/ToDate";
import CustomDebounceDropdown from "../@core/CustomDebounceDropdown";
import Button from "../components/custom/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { ResearchContext } from "../context/ContextProvider";
import { url } from "../constants/baseUrl";
import CustomTextField from "../@core/CutsomTextField";
import Pagination from "../components/pagination/Pagination";
import EditModal from "../nonTagged-component/editModal/editModal";
import UploadDialog from "../nonTagged-component/editArticle/UploadDialog";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

const NonTagged = () => {
  const { userToken, pageNumber, recordsPerPage } = useContext(ResearchContext);
  const [activeTab, setActiveTab] = useState(0);
  const [fetchUsingPrevNext, setFetchingUsingPrevNext] = useState(false);
  const [fetchAfterSave, setFetchAfterSave] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [publication, setPublication] = useState("");
  const [topPublication, setTopPublication] = useState(true);
  const [nonTagged, setNonTagged] = useState(true);
  const [searchLink, setSearchLink] = useState("");
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  const handleDataFetch = async () => {
    if (isFirstRender) return;
    try {
      setTableDataLoading(true);
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      const requestData_online = {
        from_date: fromDate.split(" ")[0],
        to_date: toDate.split(" ")[0],
        page: pageNumber,
        items_per_page: recordsPerPage,
        search_publication: publication,
        top_publication: Number(topPublication),
        search_link: "",
        non_tagged: Number(nonTagged),
      };
      const requestData_print = {
        from_date: fromDate.split(" ")[0],
        to_date: toDate.split(" ")[0],
        page: pageNumber,
        items_per_page: recordsPerPage,
        search_publication: publication,
      };
      const request_data = !activeTab ? requestData_online : requestData_print;
      const endpoint = !activeTab
        ? "taglessSocialfeedList/"
        : "taglessArticleList/";
      const response = await axios.post(`${url + endpoint}`, request_data, {
        headers,
      });
      const data = !activeTab
        ? response.data.tagless_socialfeeds
        : response.data.tagless_articles;
      const totalRecord = !activeTab
        ? response.data.socialfeed_count
        : response.data.article_count;
      setTableData(data);
      setTotalRecords(totalRecord);
      setTableDataLoading(false);
      setFetchingUsingPrevNext(false);
      setFetchAfterSave(false);
    } catch (error) {
      setTableDataLoading(false);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (fetchUsingPrevNext || fetchAfterSave) {
      handleDataFetch();
    }
    handleDataFetch();
  }, [fetchUsingPrevNext, fetchAfterSave]);

  const [sortDirection, setSortDirection] = useState("asc");

  const handleFilterItems = () => {
    const fromDateObj = new Date(fromDate.split(" ")[0]);
    const toDateObj = new Date(toDate.split(" ")[0]);

    const sortedData = [...tableData].sort((a, b) => {
      let dateA, dateB;
      if (!activeTab) {
        dateA = new Date(a.feeddate);
        dateB = new Date(b.feeddate);
      } else {
        dateA = new Date(a.articledate);
        dateB = new Date(b.articledate);
      }
      if (sortDirection === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    const filteredData = sortedData.filter((item) => {
      let itemDate;
      if (!activeTab) {
        itemDate = new Date(item.feeddate.split("T")[0]);
      } else {
        itemDate = new Date(item.articledate.split("T")[0]);
      }
      return itemDate >= fromDateObj && itemDate <= toDateObj;
    });

    setTableData(filteredData);
  };

  const handleSortDirectionChange = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  //for edit modal
  const [open, setOpen] = useState(false);
  const [editedSingleArticle, setEditedSingleArticle] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleClose = () => {
    setSelectedArticle(null);
    setEditedSingleArticle(null);
    setOpen(false);
  };

  const tableRowClick = (item) => {
    setOpen(true);
    setSelectedArticle((prev) => (prev === item ? null : item));
  };

  return (
    <div className="h-screen px-3">
      <BasicTabs
        value={activeTab}
        setValue={setActiveTab}
        setSelectedColumnsForDump={setTableData}
      />
      <Box display="flex" alignItems="center" gap={1}>
        <FromDate fromDate={fromDate} setFromDate={setFromDate} />
        <ToDate dateNow={toDate} setDateNow={setToDate} isMargin />
        <CustomDebounceDropdown
          publicationGroup={publication}
          setPublicationGroup={setPublication}
          m="mt-3"
        />
        {!activeTab && (
          <>
            {" "}
            <FormGroup>
              <FormControlLabel
                sx={{ mt: 2 }}
                label={
                  <Typography variant="h6" fontSize={"0.9em"}>
                    Top Publication
                  </Typography>
                }
                control={
                  <Checkbox
                    checked={topPublication}
                    onChange={() => setTopPublication(!topPublication)}
                  />
                }
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                sx={{ mt: 2 }}
                label={
                  <Typography variant="h6" fontSize={"0.9em"}>
                    Non Tagged
                  </Typography>
                }
                control={
                  <Checkbox
                    checked={nonTagged}
                    onChange={() => setNonTagged(!nonTagged)}
                  />
                }
              />
            </FormGroup>{" "}
          </>
        )}

        <Button
          btnText={tableDataLoading ? "Searching" : "search"}
          onClick={handleDataFetch}
          isLoading={tableDataLoading}
        />
      </Box>
      {!activeTab && (
        <CustomTextField
          value={searchLink}
          setValue={setSearchLink}
          placeholder={"search with link"}
          width={900}
        />
      )}
      <Divider sx={{ mt: 1 }} />
      {!!tableData.length && (
        <>
          {" "}
          <Pagination
            tableData={tableData}
            totalRecordsCount={totalRecords}
            setFetchingUsingPrevNext={setFetchingUsingPrevNext}
          />
          <TableContainer component={Paper} sx={{ mt: 1, maxHeight: 600 }}>
            <Table
              sx={{ minWidth: 650, maxHeight: 500, overflow: "scroll" }}
              aria-label="simple table"
            >
              <TableHead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <TableRow className="bg-primary">
                  <TableCell
                    size="small"
                    sx={{ color: "white", fontFamily: "nunito" }}
                  >
                    Edit
                  </TableCell>
                  <TableCell
                    size="small"
                    sx={{ color: "white", fontFamily: "nunito" }}
                  >
                    Publication
                  </TableCell>
                  <TableCell
                    size="small"
                    sx={{
                      color: "white",
                      fontFamily: "nunito",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleSortDirectionChange();
                      handleFilterItems();
                    }}
                  >
                    <span className="flex items-center text-white">
                      <IoIosArrowRoundDown
                        className={`${
                          sortDirection === "asc" && "text-red-500"
                        }`}
                      />
                      <IoIosArrowRoundUp
                        className={`${
                          sortDirection === "desc" && "text-red-500"
                        }`}
                      />
                    </span>
                    {!activeTab ? "FeedDate" : "ArticleDate"}
                  </TableCell>
                  <TableCell
                    size="small"
                    sx={{ color: "white", fontFamily: "nunito" }}
                  >
                    {!activeTab ? "SocialFeedId" : "ArticleId"}
                  </TableCell>
                  <TableCell
                    size="small"
                    sx={{ color: "white", fontFamily: "nunito" }}
                  >
                    Link
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((row, index) => (
                  <Fragment key={index}>
                    {!activeTab ? (
                      <TableRow key={row.id}>
                        <TableCell
                          size="small"
                          sx={{ color: "#0a4f7d" }}
                          onClick={() => tableRowClick(row)}
                        >
                          <EditAttributesOutlined />
                        </TableCell>
                        <TableCell
                          size="small"
                          sx={{ fontFamily: "nunito", whiteSpace: "nowrap" }}
                        >
                          {row.publication}
                        </TableCell>
                        <TableCell
                          size="small"
                          sx={{ fontFamily: "nunito", whiteSpace: "nowrap" }}
                        >
                          {row.feeddate.split("T")[0]}
                        </TableCell>
                        <TableCell
                          size="small"
                          sx={{ fontFamily: "nunito", whiteSpace: "nowrap" }}
                        >
                          {row.socialfeedid}
                        </TableCell>
                        <TableCell
                          size="small"
                          sx={{ fontFamily: "nunito", whiteSpace: "nowrap" }}
                        >
                          {row.link}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow key={row.id}>
                        <TableCell
                          size="small"
                          sx={{ color: "#0a4f7d" }}
                          onClick={() => tableRowClick(row)}
                        >
                          <EditAttributesOutlined />
                        </TableCell>
                        <TableCell
                          size="small"
                          sx={{ fontFamily: "nunito", whiteSpace: "nowrap" }}
                        >
                          {row.publication}
                        </TableCell>
                        <TableCell
                          size="small"
                          sx={{ fontFamily: "nunito", whiteSpace: "nowrap" }}
                        >
                          {row.articledate.split("T")[0]}
                        </TableCell>
                        <TableCell
                          size="small"
                          sx={{ fontFamily: "nunito", whiteSpace: "nowrap" }}
                        >
                          {row.articleid}
                        </TableCell>
                        <TableCell
                          size="small"
                          sx={{ fontFamily: "nunito", whiteSpace: "nowrap" }}
                        >
                          {row.link}
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {!activeTab ? (
        <UploadDialog
          open={open}
          handleClose={handleClose}
          selectedRow={selectedArticle}
          setFetchAfterSave={setFetchAfterSave}
        />
      ) : (
        <EditModal
          open={open}
          handleClose={handleClose}
          selectedArticle={selectedArticle}
          editedSingleArticle={editedSingleArticle}
          setEditedSingleArticle={setEditedSingleArticle}
        />
      )}
    </div>
  );
};

export default NonTagged;
