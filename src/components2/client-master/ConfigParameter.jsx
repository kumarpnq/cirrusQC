import { useEffect, useState } from "react";
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
} from "@mui/material";
import { styled } from "@mui/system";
import ComponentsHeader from "./ComponentsHeader";
import axiosInstance from "../../../axiosConfig";

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ConfigParameter = ({ clientId }) => {
  const [configData, setConfigData] = useState(configParameters);
  const [loading, setLoading] = useState(false);

  const handleChange = (id, value) => {
    setConfigData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  useEffect(() => {
    const fetchSectionDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `configParams/?clientId=${clientId}`
        );

        const mailerInfo = response.data.data.data.mailerInfo;
        const configParameters = [
          {
            id: 1,
            name: "Show Left Logo",
            type: "select",
            value: mailerInfo.showMailerLeftLogo === "Y" ? "YES" : "NO",
          },
          {
            id: 2,
            name: "Show Right Logo",
            type: "select",
            value: mailerInfo.showMailerRightLogo === "Y" ? "YES" : "NO",
          },
          {
            id: 3,
            name: "Show Unsubscribe",
            type: "select",
            value: mailerInfo.showUnsubscribe === "Y" ? "YES" : "NO",
          },
          {
            id: 4,
            name: "Show Table Print Count",
            type: "select",
            value: mailerInfo.showTablePrintCount === "Y" ? "YES" : "NO",
          },
          {
            id: 5,
            name: "Show Table PrintSOV Count",
            type: "select",
            value: mailerInfo.showTablePrintSovCount === "Y" ? "YES" : "NO",
          },
          {
            id: 6,
            name: "Show Table Online Count",
            type: "select",
            value: mailerInfo.showTableOnlineCount === "Y" ? "YES" : "NO",
          },
          {
            id: 7,
            name: "Show Table OnlineSOV Count",
            type: "select",
            value: mailerInfo.showTableOnlineSovCount === "Y" ? "YES" : "NO",
          },
          {
            id: 8,
            name: "Show Mailer Title",
            type: "select",
            value: mailerInfo.showMailerTitle === "Y" ? "YES" : "NO",
          },
          {
            id: 9,
            name: "Show Mailer Subtitle",
            type: "select",
            value: mailerInfo.showMailerSubtitle === "Y" ? "YES" : "NO",
          },
          {
            id: 10,
            name: "Show Bottom Logo",
            type: "select",
            value: mailerInfo.showMailerBottomLogo === "Y" ? "YES" : "NO",
          },
        ];
        setConfigData(configParameters);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (clientId) {
      fetchSectionDetails();
    }
  }, [clientId]);

  return (
    <Box p={2}>
      <ComponentsHeader
        title="Config Parameter"
        loading={false}
        onSave={() => {}}
      />
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
                      style={{ height: 25 }}
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
                      inputProps={{
                        style: {
                          height: 25,
                        },
                      }}
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
