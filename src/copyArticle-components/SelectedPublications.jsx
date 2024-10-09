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
});

const TextFieldForTable = ({ type, value, handleChange }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      type={type}
      fullWidth
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
};

const SelectedPublications = () => {
  const publications = [
    { publication: "The Times", city: "New York", page: 1 },
    { publication: "The Guardian", city: "London", page: 2 },
    { publication: "Le Monde", city: "Paris", page: 3 },
  ];

  const handleCityChange = useCallback((e) => {
    console.log("City changed: ", e.target.value);
  }, []);

  const handlePageChange = useCallback((e) => {
    console.log("Page changed: ", e.target.value);
  }, []);

  return (
    <TableWrapper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Publication</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Page</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {publications.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.publication}</TableCell>
              <TableCell>
                <TextFieldForTable
                  value={row.city}
                  type="text"
                  handleChange={handleCityChange}
                />
              </TableCell>
              <TableCell>
                <TextFieldForTable
                  value={row.page}
                  type="number"
                  handleChange={handlePageChange}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
};

export default SelectedPublications;
