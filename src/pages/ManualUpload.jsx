import { useContext, useState } from "react";
import {
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import UploadDialog from "../manual-upload-components/UploadDialog";
import Button from "../components/custom/Button";
import FromDate from "../components/research-dropdowns/FromDate";
import { formattedDate, formattedNextDay } from "../constants/dates";
import ToDate from "../components/research-dropdowns/ToDate";
import TextFields from "../components/TextFields/TextField";

//  ** third party imports
import { EditAttributesOutlined } from "@mui/icons-material";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../constants/baseUrl";
import { ResearchContext } from "../context/ContextProvider";
import Pagination from "../components/pagination/Pagination";

const ManualUpload = () => {
  const { userToken } = useContext(ResearchContext);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  const [publicationValue, setPublicationValue] = useState("");
  const [topPublication, setTopPublication] = useState(false);
  const [errorListLoading, setErrorListLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fetchingUsingPrevNext, setFetchingUsingPrevNext] = useState(false);

  // sort
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const sortedErrorList = [...errorList].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.feeddate).getTime();
      const dateB = new Date(b.feeddate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });
  const fetchErrorList = async () => {
    try {
      const headers = { Authorization: `Bearer ${userToken}` };
      const requestData = {
        from_date: fromDate,
        to_date: dateNow,
        page: 1,
        items_per_page: 10,
        search_publication: publicationValue,
        top_publication: Number(topPublication),
      };
      setErrorListLoading(true);
      const response = await axios.post(
        `${url}downloaderrorslist/`,
        requestData,
        {
          headers,
        }
      );
      setErrorList(response.data.download_errors);
      setTotalRecords(response.data.errors_count);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setErrorListLoading(false);
    }
  };

  // modal
  const [selectedRow, setSelectedRow] = useState(null);
  const handleClose = () => setOpen((prev) => !prev);
  const handleRowClick = (row) => {
    setOpen(!open);
    setSelectedRow((prev) => (prev === row ? null : row));
  };

  return (
    <div className="h-screen mx-4">
      <Box display="flex" alignItems="center" gap={2} height={50}>
        <FromDate fromDate={fromDate} setFromDate={setFromDate} />
        <ToDate dateNow={dateNow} setDateNow={setDateNow} isMargin={true} />
        <TextFields
          placeholder="publication"
          value={publicationValue}
          setValue={setPublicationValue}
        />
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
        <Button
          btnText={errorListLoading ? "Loading" : "search"}
          onClick={fetchErrorList}
          isLoading={errorListLoading}
        />
      </Box>
      {errorList.length > 0 && (
        <>
          <Box>
            <Pagination
              tableData={errorList}
              totalRecordsCount={totalRecords}
              setFetchingUsingPrevNext={setFetchingUsingPrevNext}
            />
          </Box>
          <Box mt={2}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead className="bg-primary">
                  <TableRow>
                    <TableCell
                      size="small"
                      sx={{
                        color: "white",
                        position: "sticky",
                        left: 0,
                      }}
                      className="bg-primary"
                    >
                      Edit
                    </TableCell>
                    <TableCell
                      size="small"
                      sx={{
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSort("date")}
                    >
                      Date
                      {sortBy === "date" && (
                        <span className="flex">
                          <IoIosArrowRoundUp
                            style={{
                              color: sortOrder === "asc" ? "green" : "red",
                            }}
                          />
                          <IoIosArrowRoundDown
                            style={{
                              color: sortOrder === "asc" ? "red" : "green",
                            }}
                          />
                        </span>
                      )}
                    </TableCell>
                    <TableCell size="small" sx={{ color: "white" }}>
                      Publication
                    </TableCell>
                    <TableCell size="small" sx={{ color: "white" }}>
                      link
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="text-[0.8em]">
                  {sortedErrorList.map((row) => (
                    <TableRow
                      key={row.articlelink}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        size="small"
                        sx={{
                          position: "sticky",
                          left: 0,
                          background: "white",
                        }}
                      >
                        <EditAttributesOutlined
                          className="text-primary"
                          onClick={() => handleRowClick(row)}
                        />
                      </TableCell>
                      <TableCell
                        size="small"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span>{row.feeddate.replace("T", " ")}</span>
                      </TableCell>
                      <TableCell size="small">{row.publicationname}</TableCell>
                      <TableCell size="small">{row.searchlink}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}

      <UploadDialog
        open={open}
        handleClose={handleClose}
        selectedRow={selectedRow}
      />
    </div>
  );
};

export default ManualUpload;
