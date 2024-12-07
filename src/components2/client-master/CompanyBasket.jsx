import { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../../../axiosConfig";
import useFetchMongoData from "../../hooks/useFetchMongoData";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import AddGridModal from "./companyBasket/addGridModal";

const CompanyBasket = ({ clientId, setSelectedMainTab }) => {
  const [modifiedData, setModifiedData] = useState([]);
  const [clientBasketData, setClientBasketData] = useState([]);
  const [clientBasketLoading, setClientBasketLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  const { data: sectionData } = useFetchMongoData(
    `mailSectionDDL/?clientId=${clientId}`
  );

  const sectionDataArray = sectionData?.data?.data || [];

  // Fetch client basket data
  const fetchClientBasketData = async () => {
    try {
      setClientBasketLoading(true);
      const response = await axiosInstance.get(
        `clientBasket/?clientId=${clientId}`
      );
      setClientBasketData(response.data.data.data || []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setClientBasketLoading(false);
    }
  };

  useEffect(() => {
    fetchClientBasketData();
  }, []);

  const handleChange = (id, field, value) => {
    setClientBasketData((prev) => {
      return prev.map((item) =>
        item.companyId === id ? { ...item, [field]: value } : item
      );
    });

    setModifiedData((prev) => {
      const existingIndex = prev.findIndex((item) => item.companyId === id);

      if (existingIndex >= 0) {
        const updatedData = [...prev];
        updatedData[existingIndex] = {
          ...updatedData[existingIndex],
          [field]: value,
        };
        return updatedData;
      } else {
        return [...prev, { companyId: id, [field]: value }];
      }
    });
  };

  const handleUpdate = async () => {
    try {
      setUpdateLoading(true);
      if (!modifiedData.length) {
        console.log("No data to update");
        setSelectedMainTab("Online Publications");
        return;
      }

      const formattedData = modifiedData.map((item) => ({
        ...item,
        fromDate: item.fromDate
          ? format(parseISO(item.fromDate), "yyyy-MM-dd HH:mm:ss")
          : undefined,
        toDate: item.toDate
          ? format(parseISO(item.toDate), "yyyy-MM-dd HH:mm:ss")
          : undefined,
      }));

      const requestData = {
        clientId,
        clientBasket: formattedData,
      };
      const response = await axiosInstance.post(
        `updateClientBasket/`,
        requestData
      );

      if (response.data.data.data.success.length) {
        const status = response.data.data.data.success[0]?.message;
        toast.success(status);
        setModifiedData([]);
        fetchClientBasketData();
      } else {
        toast.error(response.data.data.data.error[0].message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ddd",
          p: 1,
          borderRadius: "3px",
          my: 0.5,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
            borderColor: "primary.main",
          },
        }}
      >
        <Typography>Add Edit Company Basket</Typography>
        <Typography component={"div"} sx={{ display: "flex", gap: 0.5 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setOpenAdd((prev) => !prev)}
          >
            Add
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={handleUpdate}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {updateLoading && <CircularProgress size={"1em"} />}
            Save
          </Button>
        </Typography>
      </Box>
      {clientBasketLoading ? (
        <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: "80vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ padding: "4px 8px" }}>Company Name</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>From Date</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>To Date</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>Sort Order</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>Mail Section</TableCell>
                <TableCell sx={{ padding: "4px 8px" }}>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientBasketData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    {row.companyName}
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <TextField
                      type="datetime-local"
                      size="small"
                      value={row?.fromDate || ""}
                      onChange={(e) =>
                        handleChange(row.companyId, "fromDate", e.target.value)
                      }
                      InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <TextField
                      type="datetime-local"
                      size="small"
                      value={row?.toDate || ""}
                      onChange={(e) =>
                        handleChange(row.companyId, "toDate", e.target.value)
                      }
                      InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <TextField
                      size="small"
                      value={row.emailPriority || ""}
                      onChange={(e) =>
                        handleChange(
                          row.companyId,
                          "emailPriority",
                          e.target.value
                        )
                      }
                      InputProps={{ style: { height: 25, fontSize: "0.9em" } }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <FormControl fullWidth>
                      <Select
                        value={row.mailSectionId || ""}
                        onChange={(e) =>
                          handleChange(
                            row.companyId,
                            "mailSectionId",
                            e.target.value
                          )
                        }
                        size="small"
                        sx={{ height: 25, fontSize: "0.9em" }}
                      >
                        {sectionDataArray.map((item, index) => (
                          <MenuItem
                            value={item.mailSectionId}
                            key={index}
                            sx={{ height: 25, fontSize: "0.9em" }}
                          >
                            {item.mailSection}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <FormControl fullWidth>
                      <Select
                        value={row.isActive || ""}
                        onChange={(e) =>
                          handleChange(
                            row.companyId,
                            "isActive",
                            e.target.value
                          )
                        }
                        size="small"
                        sx={{ height: 25, fontSize: "0.9em" }}
                      >
                        <MenuItem value="Y" sx={{ fontSize: "0.9em" }}>
                          Yes
                        </MenuItem>
                        <MenuItem value="N" sx={{ fontSize: "0.9em" }}>
                          No
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <AddGridModal
        open={openAdd}
        usedRows={clientBasketData}
        handleClose={() => setOpenAdd((prev) => !prev)}
        clientId={clientId}
        handleFetchMainData={fetchClientBasketData}
      />
    </Box>
  );
};

export default CompanyBasket;
