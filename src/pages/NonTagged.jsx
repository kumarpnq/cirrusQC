import { useContext, useState, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  FormGroup,
  FormControlLabel,
  Typography,
  Checkbox,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
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
import EditModal from "../nonTagged-component/editModal/editModal";
import UploadDialog from "../nonTagged-component/editArticle/UploadDialog";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import Publication from "../print-components/dropdowns/Publication";
import { TableVirtuoso } from "react-virtuoso";
import TotalRecordsCard from "../@core/TotalRecords";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
    marginTop: "1em",
  },

  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    background: "#d4c8c7",
  },
}));

const NonTagged = () => {
  const { userToken } = useContext(ResearchContext);
  const [activeTab, setActiveTab] = useState(0);
  const [setFetchAfterSave] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [toDate, setToDate] = useState(formattedNextDay);
  const [publication, setPublication] = useState("");
  const [debouncePub, setDebouncePub] = useState("");
  const [publicationGroup, setPublicationGroup] = useState("");
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
        // page: pageNumber,
        // items_per_page: recordsPerPage,
        search_publication: publication,
        top_publication: Number(topPublication),
        search_link: searchLink,
        non_tagged: Number(nonTagged),
      };
      const requestData_print = {
        from_date: fromDate.split(" ")[0],
        to_date: toDate.split(" ")[0],
        // page: pageNumber,
        // items_per_page: recordsPerPage,
        search_publication: publicationGroup,
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

      setTableData(data);
      setTableDataLoading(false);
    } catch (error) {
      setTableDataLoading(false);
      toast.error(error.message);
    }
  };

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
  const classes = useStyle();
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
        {!activeTab && (
          <div className="mt-3">
            <CustomTextField
              placeholder={"publication"}
              value={publication}
              setValue={setPublication}
            />
          </div>
        )}

        {!!activeTab && (
          <>
            <CustomDebounceDropdown
              publicationGroup={debouncePub}
              setPublicationGroup={setDebouncePub}
              m="mt-3"
            />
            <Publication
              publicationGroup={debouncePub}
              publication={publicationGroup}
              setPublication={setPublicationGroup}
              classes={classes}
              width={150}
            />{" "}
          </>
        )}

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
        <div className="relative">
          {" "}
          <TotalRecordsCard totalRecords={tableData.length} tClass="top-[7%]" />
          <TableVirtuoso
            style={{ height: 600 }}
            data={tableData}
            fixedHeaderContent={() => (
              <TableHead>
                <TableRow className="bg-primary">
                  <TableCell
                    size="small"
                    sx={{ color: "white", fontFamily: "nunito" }}
                  >
                    Edit
                  </TableCell>
                  <TableCell
                    size="small"
                    sx={{ color: "white", fontFamily: "nunito", width: 150 }}
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
                      width: 150,
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
                    Headline
                  </TableCell>
                  <TableCell
                    size="small"
                    sx={{
                      color: "white",
                      fontFamily: "nunito",
                      pl: 30,
                      width: 1000,
                    }}
                  >
                    Link
                  </TableCell>
                </TableRow>
              </TableHead>
            )}
            itemContent={(index, row) => (
              <TableBody>
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
                        sx={{
                          fontFamily: "nunito",
                          whiteSpace: "nowrap",
                          fontSize: "0.8em",
                          width: 100,
                        }}
                      >
                        <div className="truncate w-28">{row.publication}</div>
                      </TableCell>
                      <TableCell
                        size="small"
                        sx={{
                          fontFamily: "nunito",
                          whiteSpace: "nowrap",
                          fontSize: "0.8em",
                          width: 100,
                        }}
                      >
                        <div className="w-20 ml-4">
                          {row.feeddate.split("T")[0]}
                        </div>
                      </TableCell>
                      <TableCell
                        size="small"
                        sx={{
                          fontFamily: "nunito",
                          whiteSpace: "nowrap",
                          fontSize: "0.8em",
                          width: 100,
                        }}
                      >
                        <div className="w-20 ml-6">{row.socialfeedid}</div>
                      </TableCell>
                      <TableCell
                        size="small"
                        sx={{
                          fontFamily: "nunito",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: 300,
                          fontSize: "0.8em",
                        }}
                      >
                        <Tooltip title={row.headline}>
                          <div className="truncate w-72">{row.headline}</div>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        size="small"
                        sx={{
                          fontFamily: "nunito",
                          whiteSpace: "nowrap",
                          fontSize: "0.8em",
                          width: 600,
                        }}
                      >
                        <a
                          href={row.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {row.link}
                        </a>
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
                        sx={{
                          fontFamily: "nunito",
                          whiteSpace: "nowrap",
                          fontSize: "0.8em",
                        }}
                      >
                        <div className="truncate w-36">{row.publication}</div>
                      </TableCell>
                      <TableCell
                        size="small"
                        sx={{
                          fontFamily: "nunito",
                          whiteSpace: "nowrap",
                          fontSize: "0.8em",
                        }}
                      >
                        {row.articledate?.split("T")[0]}
                      </TableCell>
                      <TableCell
                        size="small"
                        sx={{
                          fontFamily: "nunito",
                          whiteSpace: "nowrap",
                          fontSize: "0.8em",
                        }}
                      >
                        {row.articleid}
                      </TableCell>
                      <TableCell
                        size="small"
                        sx={{
                          fontFamily: "nunito",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 300,
                          fontSize: "0.8em",
                        }}
                      >
                        <Tooltip title={row.headline}>
                          <div className="truncate w-96">{row.headline}</div>
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        size="small"
                        sx={{
                          fontFamily: "nunito",
                          whiteSpace: "nowrap",
                          fontSize: "0.8em",
                        }}
                      >
                        <div className="truncate w-96">
                          <Link
                            to={`/articleview/download-file/${row?.link}`}
                            target="_blank"
                            className="italic underline"
                          >
                            {row.display_value}
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              </TableBody>
            )}
          />
        </div>
      )}

      {!activeTab ? (
        <UploadDialog
          open={open}
          handleClose={handleClose}
          selectedRow={selectedArticle}
          setFetchAfterSave={setFetchAfterSave}
          tableData={tableData}
          setTableData={setTableData}
        />
      ) : (
        <EditModal
          open={open}
          handleClose={handleClose}
          selectedArticle={selectedArticle}
          editedSingleArticle={editedSingleArticle}
          setEditedSingleArticle={setEditedSingleArticle}
          tableData={tableData}
          setTableData={setTableData}
        />
      )}
    </div>
  );
};

export default NonTagged;
