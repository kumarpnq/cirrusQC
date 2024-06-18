// import { useContext, useEffect, useState } from "react";
// import {
//   Box,
//   Checkbox,
//   FormGroup,
//   FormControlLabel,
//   Typography,
//   Link,
//   Divider,
// } from "@mui/material";

// import UploadDialog from "../manual-upload-components/UploadDialog";
// import Button from "../components/custom/Button";
// import FromDate from "../components/research-dropdowns/FromDate";
// import { formattedDate, formattedNextDay } from "../constants/dates";
// import ToDate from "../components/research-dropdowns/ToDate";
// import TextFields from "../components/TextFields/TextField";
// import { url } from "../constants/baseUrl";
// import { ResearchContext } from "../context/ContextProvider";
// import CustomTextField from "../@core/CutsomTextField";

// //  ** third party imports
// import { EditAttributesOutlined } from "@mui/icons-material";
// import axios from "axios";
// import { toast } from "react-toastify";

// import { DataGrid, GridToolbar } from "@mui/x-data-grid";

// const ManualUpload = () => {
//   const { userToken } = useContext(ResearchContext);
//   const [open, setOpen] = useState(false);
//   const [fromDate, setFromDate] = useState(formattedDate);
//   const [dateNow, setDateNow] = useState(formattedNextDay);
//   const [publicationValue, setPublicationValue] = useState("");
//   const [topPublication, setTopPublication] = useState(false);
//   const [errorListLoading, setErrorListLoading] = useState(false);
//   const [errorList, setErrorList] = useState([]);
//   const [searchLink, setSearchLink] = useState("");
//   const [fetchAfterSave, setFetchAfterSave] = useState(false);
//   const [isArticleSaved, setIsArticleSaved] = useState(false);
//   const [modalType, setModalType] = useState();

//   // article number after save the article automatically get next article
//   const [articleNumber, setArticleNumber] = useState(0);

//   // sort
//   const [sortBy, setSortBy] = useState(null);
//   const [sortOrder, setSortOrder] = useState("asc");

//   const sortedErrorList = [...errorList].sort((a, b) => {
//     if (sortBy === "date") {
//       const dateA = new Date(a.feeddate).getTime();
//       const dateB = new Date(b.feeddate).getTime();
//       return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
//     }
//     return 0;
//   });

//   const fetchErrorList = async () => {
//     try {
//       const headers = { Authorization: `Bearer ${userToken}` };
//       const requestData = {
//         from_date: fromDate,
//         to_date: dateNow,
//         search_publication: publicationValue,
//         top_publication: Number(topPublication),
//         search_link: searchLink,
//       };
//       setErrorListLoading(true);
//       const response = await axios.post(
//         `${url}downloaderrorslist/`,
//         requestData,
//         {
//           headers,
//         }
//       );
//       setErrorList(response.data.download_errors);
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setErrorListLoading(false);
//       setFetchAfterSave(false);
//       setIsArticleSaved(false);
//     }
//   };
//   useEffect(() => {
//     if (fetchAfterSave) {
//       fetchErrorList();
//     }
//   }, [fetchAfterSave]);
//   // modal
//   const [selectedRow, setSelectedRow] = useState(null);
//   const [link, setLink] = useState(selectedRow?.articlelink);

//   useEffect(() => {
//     setLink(selectedRow?.articlelink);
//   }, [selectedRow]);

//   const handleClose = () => {
//     setOpen((prev) => !prev);
//     setFetchAfterSave(isArticleSaved ? true : false);
//     setArticleNumber(0);
//   };
//   const handleRowClick = (row, index) => {
//     setArticleNumber(index);
//     setModalType(0);
//     setOpen(!open);
//     setSelectedRow((prev) => (prev === row ? null : row));
//   };
//   const handleUploadURL = () => {
//     setModalType(1);
//     setOpen((prev) => !prev);
//   };

//   const columns = [
//     {
//       field: "edit",
//       headerName: "Edit",
//       width: 100,
//       sortable: false,
//       headerClassName: "super-app-theme--header",
//       renderCell: (params) => (
//         <Link component="button">
//           <EditAttributesOutlined
//             className="text-primary"
//             onClick={() => handleRowClick(params.row, params.id)}
//           />
//         </Link>
//       ),
//     },
//     {
//       field: "feeddate",
//       headerName: "Date",
//       width: 200,
//       headerClassName: "super-app-theme--header",
//       sortComparator: (v1, v2) =>
//         new Date(v1).getTime() - new Date(v2).getTime(),
//     },
//     {
//       field: "publicationname",
//       headerName: "Publication",
//       width: 200,
//       headerClassName: "super-app-theme--header",
//     },
//     {
//       field: "searchlink",
//       headerName: "Link",
//       width: 500,
//       headerClassName: "super-app-theme--header",
//       renderCell: (params) => (
//         <Link href={params.value} target="_blank" rel="noopener noreferrer">
//           {params.value}
//         </Link>
//       ),
//     },
//   ];
//   const rows = errorList.map((error, index) => ({
//     id: index,
//     edit: "Edit", // Example: Edit button
//     feeddate: error.feeddate.replace("T", " "), // Example: Formatting date
//     publicationname: error.publicationname,
//     searchlink: error.searchlink,
//     ...error, // Assuming error object contains other necessary fields
//   }));

//   return (
//     <div className="mx-4">
//       <Box display="flex" alignItems="center" gap={2} height={50}>
//         <FromDate fromDate={fromDate} setFromDate={setFromDate} />
//         <ToDate dateNow={dateNow} setDateNow={setDateNow} isMargin={true} />
//         <TextFields
//           placeholder="publication"
//           value={publicationValue}
//           setValue={setPublicationValue}
//         />
//         <FormGroup>
//           <FormControlLabel
//             sx={{ mt: 2 }}
//             label={
//               <Typography variant="h6" fontSize={"0.9em"}>
//                 Top Publication
//               </Typography>
//             }
//             control={
//               <Checkbox
//                 checked={topPublication}
//                 onChange={() => setTopPublication(!topPublication)}
//               />
//             }
//           />
//         </FormGroup>
//         <Button
//           btnText={errorListLoading ? "Loading" : "search"}
//           onClick={fetchErrorList}
//           isLoading={errorListLoading}
//         />
//         <Button btnText={"Other link"} onClick={handleUploadURL} />
//       </Box>
//       <CustomTextField
//         value={searchLink}
//         setValue={setSearchLink}
//         placeholder={"link"}
//         width={800}
//       />
//       <Divider sx={{ mt: 1 }} />
//       <Box
//         sx={{
//           height: 500,
//           width: "100%",
//           "& .super-app-theme--header": {
//             backgroundColor: "#0a4f7d",
//             color: "#fff",
//           },
//         }}
//       >
//         <Typography>Total Records: {errorList.length}</Typography>
//         <DataGrid
//           rows={rows}
//           columns={columns}
//           slots={{ toolbar: GridToolbar }}
//           slotProps={{
//             toolbar: {
//               showQuickFilter: true,
//             },
//           }}
//           pageSize={5}
//           pageSizeOptions={[
//             10,
//             100,
//             200,
//             1000,
//             { value: 1000, label: "1,000" },
//           ]}
//           density="compact"
//           columnBufferPx={1000}
//           disableColumnSelector
//           disableDensitySelector
//           disableSelectionOnClick
//           hideFooterSelectedRowCount
//           components={{ Toolbar: GridToolbar }}
//         />
//       </Box>

//       <UploadDialog
//         open={open}
//         handleClose={handleClose}
//         selectedRow={selectedRow}
//         type={modalType}
//         link={link}
//         setLink={setLink}
//         setIsArticleSaved={setIsArticleSaved}
//         errorList={sortedErrorList}
//         articleNumber={articleNumber}
//         setArticleNumber={setArticleNumber}
//       />
//     </div>
//   );
// };

// export default ManualUpload;

import { useContext, useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Link,
  Divider,
} from "@mui/material";

import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import UploadDialog from "../manual-upload-components/UploadDialog";
import Button from "../components/custom/Button";
import FromDate from "../components/research-dropdowns/FromDate";
import { formattedDate, formattedNextDay } from "../constants/dates";
import ToDate from "../components/research-dropdowns/ToDate";
import TextFields from "../components/TextFields/TextField";
import { url } from "../constants/baseUrl";
import { ResearchContext } from "../context/ContextProvider";
import CustomTextField from "../@core/CutsomTextField";

//  ** third party imports
import { EditAttributesOutlined } from "@mui/icons-material";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";
import { TableVirtuoso } from "react-virtuoso";
import TotalRecordsCard from "../@core/TotalRecords";

const ManualUpload = () => {
  const { userToken } = useContext(ResearchContext);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(formattedDate);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  const [publicationValue, setPublicationValue] = useState("");
  const [topPublication, setTopPublication] = useState(false);
  const [errorListLoading, setErrorListLoading] = useState(false);
  const [errorList, setErrorList] = useState([]);
  const [searchLink, setSearchLink] = useState("");
  // const [totalRecords, setTotalRecords] = useState(0);
  // const [fetchingUsingPrevNext, setFetchingUsingPrevNext] = useState(false);
  const [fetchAfterSave, setFetchAfterSave] = useState(false);
  const [isArticleSaved, setIsArticleSaved] = useState(false);
  const [modalType, setModalType] = useState();

  // article number after save the article automatically get next article
  const [articleNumber, setArticleNumber] = useState(0);

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
        search_publication: publicationValue,
        top_publication: Number(topPublication),
        search_link: searchLink,
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
    } finally {
      setErrorListLoading(false);
      setFetchAfterSave(false);
      setIsArticleSaved(false);
    }
  };
  useEffect(() => {
    if (fetchAfterSave) {
      fetchErrorList();
    }
  }, [fetchAfterSave]);
  // modal
  const [selectedRow, setSelectedRow] = useState(null);
  const [link, setLink] = useState(selectedRow?.articlelink);

  useEffect(() => {
    setLink(selectedRow?.articlelink);
  }, [selectedRow]);

  const handleClose = () => {
    setOpen((prev) => !prev);
    setFetchAfterSave(isArticleSaved ? true : false);
    setArticleNumber(0);
  };
  const handleRowClick = (row, index) => {
    setArticleNumber(index);
    setModalType(0);
    setOpen(!open);
    setSelectedRow((prev) => (prev === row ? null : row));
  };
  const handleUploadURL = () => {
    setModalType(1);
    setOpen((prev) => !prev);
  };
  return (
    <div className="mx-4">
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
        <Button btnText={"Other link"} onClick={handleUploadURL} />
      </Box>
      <CustomTextField
        value={searchLink}
        setValue={setSearchLink}
        placeholder={"link"}
        width={800}
      />
      <Divider sx={{ mt: 1 }} />
      {errorList.length > 0 && (
        <div className="relative">
          <TotalRecordsCard
            totalRecords={errorList.length}
            tClass="top-[10%]"
          />
          <TableVirtuoso
            style={{ height: 600 }}
            data={sortedErrorList}
            fixedHeaderContent={() => (
              <TableHead
                className="sticky top-0 bg-primary"
                style={{ position: "sticky", top: 0, zIndex: 1, width: "100%" }}
              >
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
                      width: 150,
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
                  <TableCell
                    size="small"
                    sx={{ color: "white", fontSize: "0.9rem", width: 200 }}
                  >
                    Publication
                  </TableCell>
                  <TableCell size="small" sx={{ color: "white", width: 1200 }}>
                    link
                  </TableCell>
                </TableRow>
              </TableHead>
            )}
            itemContent={(index, row) => (
              <TableRow key={row.articlelink}>
                <TableCell
                  size="small"
                  sx={{
                    position: "sticky",
                    left: 0,
                    background: "white",
                    fontSize: "0.8rem",
                  }}
                >
                  <EditAttributesOutlined
                    className="text-primary"
                    onClick={() => handleRowClick(row, index)}
                  />
                </TableCell>
                <TableCell
                  size="small"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "0.8rem",
                    fontFamily: "nunito",
                    width: 150,
                  }}
                >
                  <span>{row.feeddate.replace("T", " ")}</span>
                </TableCell>
                <TableCell
                  size="small"
                  sx={{
                    fontSize: "0.8rem",
                    fontFamily: "nunito",
                    width: 200,
                    whiteSpace: "nowrap", // Prevent text wrapping
                    overflow: "hidden", // Hide overflow text
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.publicationname}
                </TableCell>
                <TableCell
                  size="small"
                  sx={{
                    fontSize: "0.8rem",
                    fontFamily: "nunito",
                    maxWidth: 1000,
                    whiteSpace: "nowrap", // Prevent text wrapping
                    overflow: "hidden", // Hide overflow text
                    textOverflow: "ellipsis",
                  }}
                >
                  <Link
                    href={row.searchlink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* link */}
                    {row.searchlink}
                  </Link>
                </TableCell>
              </TableRow>
            )}
          />
        </div>
      )}

      <UploadDialog
        open={open}
        handleClose={handleClose}
        selectedRow={selectedRow}
        type={modalType}
        link={link}
        setLink={setLink}
        setIsArticleSaved={setIsArticleSaved}
        errorList={sortedErrorList}
        articleNumber={articleNumber}
        setArticleNumber={setArticleNumber}
      />
    </div>
  );
};

export default ManualUpload;
