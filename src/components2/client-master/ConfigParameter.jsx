import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";

// Sample data from the image
const configParameters = [
  { id: 1, name: "Show Left Logo", type: "select", value: "NO" },
  { id: 2, name: "Show Top Center Logo", type: "select", value: "NO" },
  { id: 3, name: "Show Right Logo", type: "select", value: "NO" },
  { id: 4, name: "Show Bottom Center Logo", type: "select", value: "NO" },
  { id: 5, name: "Show PrintOnline count", type: "select", value: "NO" },
  { id: 6, name: "Show Mailer Tile", type: "select", value: "YES" },
  { id: 7, name: "Mailer Title Text", type: "text", value: "P&Q NEWSLETTER" },
  { id: 8, name: "Show Mailer SubTile", type: "select", value: "YES" },
  { id: 9, name: "Mailer Top Table", type: "select", value: "NO" },
  { id: 10, name: "Show Table Print Count", type: "select", value: "YES" },
  { id: 11, name: "Show Table PrintSOV Count", type: "select", value: "YES" },
  { id: 12, name: "Show Table Online Count", type: "select", value: "YES" },
  { id: 13, name: "Show Table OnlineSOV Count", type: "select", value: "YES" },
  { id: 14, name: "Show Unsubscribe", type: "select", value: "YES" },
];

// Styled table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ConfigParameter = () => {
  const [configData, setConfigData] = useState(configParameters);

  // Handle change for select and text input
  const handleChange = (id, value) => {
    setConfigData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom color="#0a4f7d">
        ConfigParameter
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="config parameter table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ConfigParameter</StyledTableCell>
              <StyledTableCell>Value</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configData.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.name}</StyledTableCell>
                <TableCell>
                  {row.type === "select" ? (
                    <Select
                      value={row.value}
                      onChange={(e) => handleChange(row.id, e.target.value)}
                      fullWidth
                      size="small"
                      variant="outlined"
                    >
                      <MenuItem value="YES">YES</MenuItem>
                      <MenuItem value="NO">NO</MenuItem>
                    </Select>
                  ) : (
                    <TextField
                      value={row.value}
                      onChange={(e) => handleChange(row.id, e.target.value)}
                      fullWidth
                      size="small"
                      variant="outlined"
                    />
                  )}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ConfigParameter;
