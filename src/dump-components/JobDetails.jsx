import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

const JobDetails = ({ URI, rows }) => {
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

  const sortedRows = [...rows].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.requested_date).getTime();
      const dateB = new Date(b.requested_date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow className="bg-primary">
              <TableCell size="small" sx={{ color: "white" }}>
                Job Name
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
                Job Date
                {sortBy === "date" && (
                  <span className="flex">
                    {sortOrder === "asc" ? (
                      <IoIosArrowRoundUp />
                    ) : (
                      <IoIosArrowRoundDown />
                    )}
                  </span>
                )}
              </TableCell>
              <TableCell size="small" sx={{ color: "white" }}>
                Job Status
              </TableCell>
              <TableCell size="small" sx={{ color: "white" }}>
                Job Link
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell size="small">{row.filename}</TableCell>
                <TableCell size="small">
                  {row.requested_date.replace("T", " ")}
                </TableCell>
                <TableCell
                  size="small"
                  sx={{
                    bgcolor:
                      row.status === "Processing"
                        ? "#fffd8f"
                        : row.status === "Failed"
                        ? "#f77b52"
                        : row.status === "Completed" && "#b0faa2",
                  }}
                >
                  {row.status}
                </TableCell>
                <TableCell size="small">
                  {" "}
                  <a
                    href={`${URI + row.filelink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {"link"}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

JobDetails.propTypes = {
  URI: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
      status: PropTypes.oneOf(["Processing", "Failed", "Completed"]).isRequired,
      filelink: PropTypes.string.isRequired,
      requested_date: PropTypes.string.isRequired, // Ensure requested_date is included in rows
    })
  ).isRequired,
};

export default JobDetails;
