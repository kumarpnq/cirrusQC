import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// ** third party component
import PropTypes from "prop-types";

const JobDetails = ({ URI, rows }) => {
  return (
    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow className="bg-primary">
              <TableCell size="small" sx={{ color: "white" }}>
                Job Name
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
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell size="small">{row.filename}</TableCell>
                <TableCell
                  size="small"
                  sx={{
                    bgcolor:
                      row.status === "Processing"
                        ? "yellow"
                        : row.status === "Failed"
                        ? "red"
                        : row.status === "Completed" && "green",
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
    })
  ).isRequired,
};
export default JobDetails;
