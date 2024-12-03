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
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import ComponentsHeader from "./ComponentsHeader";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ConfigParameter = ({ clientId }) => {
  const [configData, setConfigData] = useState([]);
  const [initialConfigData, setInitialConfigData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

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
            key: "showMailerLeftLogo", // Added key
            type: "select",
            value: mailerInfo.showMailerLeftLogo === "Y" ? "YES" : "NO",
          },
          {
            id: 2,
            name: "Show Right Logo",
            key: "showMailerRightLogo", // Added key
            type: "select",
            value: mailerInfo.showMailerRightLogo === "Y" ? "YES" : "NO",
          },
          {
            id: 3,
            name: "Show Unsubscribe",
            key: "showUnsubscribe", // Added key
            type: "select",
            value: mailerInfo.showUnsubscribe === "Y" ? "YES" : "NO",
          },
          {
            id: 4,
            name: "Show Table Print Count",
            key: "showTablePrintCount", // Added key
            type: "select",
            value: mailerInfo.showTablePrintCount === "Y" ? "YES" : "NO",
          },
          {
            id: 5,
            name: "Show Table PrintSOV Count",
            key: "showTablePrintSovCount", // Added key
            type: "select",
            value: mailerInfo.showTablePrintSovCount === "Y" ? "YES" : "NO",
          },
          {
            id: 6,
            name: "Show Table Online Count",
            key: "showTableOnlineCount",
            type: "select",
            value: mailerInfo.showTableOnlineCount === "Y" ? "YES" : "NO",
          },
          {
            id: 7,
            name: "Show Table OnlineSOV Count",
            key: "showTableOnlineSovCount",
            type: "select",
            value: mailerInfo.showTableOnlineSovCount === "Y" ? "YES" : "NO",
          },
          {
            id: 8,
            name: "Show Mailer Title",
            key: "showMailerTitle",
            type: "select",
            value: mailerInfo.showMailerTitle === "Y" ? "YES" : "NO",
          },
          {
            id: 9,
            name: "Show Mailer Subtitle",
            key: "showMailerSubtitle",
            type: "select",
            value: mailerInfo.showMailerSubtitle === "Y" ? "YES" : "NO",
          },
          {
            id: 10,
            name: "Show Bottom Logo",
            key: "showMailerBottomLogo",
            type: "select",
            value: mailerInfo.showMailerBottomLogo === "Y" ? "YES" : "NO",
          },
        ];

        setInitialConfigData(configParameters);
        setConfigData(configParameters);
      } catch (error) {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    if (clientId) {
      fetchSectionDetails();
    }
  }, [clientId]);

  // Helper function to find updated fields
  const getUpdatedFields = () => {
    return configData.reduce((updatedFields, current) => {
      const initial = initialConfigData.find((item) => item.id === current.id);
      if (initial && initial.value !== current.value) {
        const fieldKey = current.key || current.name;
        updatedFields[fieldKey] = current.value === "YES" ? "Y" : "N";
      }

      return updatedFields;
    }, {});
  };

  const updateConfigParameter = async () => {
    try {
      setUpdateLoading(true);

      const updatedFields = getUpdatedFields();
      if (Object.keys(updatedFields).length === 0) {
        toast.error("No changes detected.");
        return;
      }

      const requestData = {
        clientId,
        mailerInfo: updatedFields,
      };

      const response = await axiosInstance.post(
        `updateConfigParams`,
        requestData
      );
      if (response.status === 200) {
        toast.success(response.data.data.message);
      }
    } catch (error) {
      toast.error("Failed to update configuration.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Box
      p={2}
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box width={600}>
        <ComponentsHeader
          title="Config Parameter"
          loading={updateLoading}
          onSave={updateConfigParameter}
        />
      </Box>

      {loading ? (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ width: 600 }}>
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
                        style={{ height: 25, fontSize: "0.9em" }}
                      >
                        <MenuItem value="YES" sx={{ fontSize: "0.9em" }}>
                          YES
                        </MenuItem>
                        <MenuItem value="NO" sx={{ fontSize: "0.9em" }}>
                          NO
                        </MenuItem>
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
                            fontSize: "0.9em",
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
      )}
    </Box>
  );
};

ConfigParameter.propTypes = {
  clientId: PropTypes.string.isRequired,
};
export default ConfigParameter;
