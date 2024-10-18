import { useCallback } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";

const TableWrapper = styled(TableContainer)({
  border: "1px  solid #ddd",
  borderRadius: "5px",
  maxHeight: 550,
  overflowY: "scroll",
});

const CompactTable = styled(Table)`
  & .MuiTableCell-root {
    padding: 4px 8px; /* Reduce cell padding */
    font-size: 0.875rem; /* Make font smaller */
  }

  & .MuiTableCell-head {
    font-weight: bold;
    background-color: #f5f5f5; /* Optional: Light background for headers */
  }

  & .MuiTableRow-root {
    height: 32px; /* Reduce row height */
  }
`;

const TextFieldForTable = ({ type, value, handleChange, isDisable }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      type={type}
      fullWidth
      disabled={isDisable}
      sx={{ width: type === "text" ? 150 : 70 }}
      InputProps={{
        style: {
          fontSize: "0.8rem",
          height: 25,
        },
      }}
      value={value}
      onChange={handleChange}
    />
  );
};

TextFieldForTable.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleChange: PropTypes.func.isRequired,
  isDisable: PropTypes.bool,
};

const SelectedPublications = ({
  selectedPublications,
  setSelectedPublications,
}) => {
  const handlePageChange = useCallback((e, index) => {
    const newPageNumber = e.target.value;

    // Update the pageNumber in the state
    setSelectedPublications((prevPublications) =>
      prevPublications.map((pub, pubIndex) =>
        pubIndex === index ? { ...pub, pageNumber: newPageNumber } : pub
      )
    );
  }, []);

  return (
    <TableWrapper>
      <CompactTable>
        <TableHead>
          <TableRow>
            <TableCell>Publication</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Page</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedPublications.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.publicationName}</TableCell>
              <TableCell>
                <TextFieldForTable
                  value={row.cityName}
                  type="text"
                  handleChange={() => {}}
                  isDisable={true}
                />
              </TableCell>
              <TableCell>
                <TextFieldForTable
                  value={row.pageNumber}
                  type="number"
                  handleChange={(e) => handlePageChange(e, index)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </CompactTable>
    </TableWrapper>
  );
};

SelectedPublications.propTypes = {
  selectedPublications: PropTypes.arrayOf(
    PropTypes.shape({
      publicationId: PropTypes.string.isRequired,
      publicationName: PropTypes.string.isRequired,
      cityId: PropTypes.number.isRequired,
      cityName: PropTypes.string.isRequired,
      pageNumber: PropTypes.number.isRequired,
    })
  ).isRequired,
  setSelectedPublications: PropTypes.func,
};

export default SelectedPublications;
