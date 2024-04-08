import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
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
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../constants/baseUrl";
import { ResearchContext } from "../context/ContextProvider";
import Pagination from "../components/pagination/Pagination";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const ManualUpload = () => {
  const { userToken } = useContext(ResearchContext);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  const [publicationValue, setPublicationValue] = useState("");
  const [errorListLoading, setErrorListLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const fetchErrorList = async () => {
    try {
      const headers = { Authorization: `Bearer ${userToken}` };
      const requestData = {
        from_date: fromDate,
        to_date: dateNow,
        page: 1,
        items_per_page: 10,
        search_publication: publicationValue,
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
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setErrorListLoading(false);
    }
  };

  const handleClose = () => setOpen((prev) => !prev);
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
        <Button
          btnText={errorListLoading ? "Loading" : "search"}
          onClick={fetchErrorList}
          isLoading={errorListLoading}
        />
      </Box>
      <Box>
        <Pagination tableData={errorList} totalRecordsCount={500} />
      </Box>
      <Box mt={2}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="bg-primary">
              <TableRow>
                <TableCell size="small" sx={{ color: "white" }}>
                  Edit
                </TableCell>
                <TableCell size="small" sx={{ color: "white" }}>
                  Feed Date
                </TableCell>
                <TableCell size="small" sx={{ color: "white" }}>
                  Publication
                </TableCell>
                <TableCell size="small" sx={{ color: "white" }}>
                  link
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {errorList.map((row) => (
                <TableRow
                  key={row.articlelink}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell size="small">
                    <EditAttributesOutlined
                      className="text-primary"
                      onClick={() => setOpen(true)}
                    />
                  </TableCell>
                  <TableCell size="small">{row.feeddate}</TableCell>
                  <TableCell size="small">{row.publicationname}</TableCell>
                  <TableCell
                    size="small"
                    sx={{
                      width: "200px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {row.searchlink}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <UploadDialog open={open} handleClose={handleClose} />
    </div>
  );
};

export default ManualUpload;
