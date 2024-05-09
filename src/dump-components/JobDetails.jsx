import { useState } from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
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
    <div style={{ overflowY: "scroll", height: 400 }}>
      <table className="w-full">
        <thead className="sticky top-0 text-sm font-thin text-white bg-primary">
          <tr>
            <th className="py-2 text-left">Job Name</th>
            <th
              onClick={() => handleSort("date")}
              className="flex py-2 text-left cursor-pointer"
            >
              Job Date
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
            </th>
            <th className="py-2">Job Status</th>
            <th className="py-2 text-left pl-14">Job Link</th>
          </tr>
        </thead>
        <tbody className="text-[0.8em]">
          {sortedRows.map((row) => (
            <tr key={row.name} className="border">
              <td className="py-2">{row.filename}</td>
              <td className="py-2">{row.requested_date.replace("T", " ")}</td>
              <td
                className="py-2"
                style={{
                  backgroundColor:
                    row.status === "Processing"
                      ? "#fffd8f"
                      : row.status === "Failed"
                      ? "#f77b52"
                      : row.status === "Completed" && "#b0faa2",
                  fontFamily: "Nunito",
                  fontSize: "0.8rem",
                }}
              >
                {row.status}
              </td>
              <td className="py-3 pl-20">
                <a
                  href={!!row.filelink && `${URI + row.filelink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="italic underline"
                >
                  link
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
      requested_date: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default JobDetails;
