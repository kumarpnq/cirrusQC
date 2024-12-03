import { useState } from "react";
import {
  Box,
  Modal,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import useFetchData from "../../../hooks/useFetchData";
import CustomMultiSelect from "../../../@core/CustomMultiSelect";
import { url } from "../../../constants/baseUrl";
import CloseIcon from "@mui/icons-material/Close";
import axiosInstance from "../../../../axiosConfig";
import toast from "react-hot-toast";

const AddGridModal = ({
  open,
  handleClose,
  usedRows = [],
  clientId,
  handleFetchMainData,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionModal, setSelectionModal] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const { data: companyData } = useFetchData(`${url}companylist`);
  const companyArray = companyData?.data?.companies || [];

  const columns = [
    { field: "companyId", headerName: "Company ID", width: 200 },
    { field: "companyName", headerName: "Company Name", width: 300 },
  ];

  const rows = usedRows.map((ListItem, index) => ({
    id: index,
    companyId: ListItem.companyId,
    companyName: ListItem.companyName,
  }));

  const handleSelectionChange = (newSelection) => {
    console.log(newSelection);

    setSelectionModal(newSelection);
    const selectedRowsData = rows.filter((row) =>
      newSelection.includes(row.id)
    );
    setSelectedRows(selectedRowsData);
  };

  const handleAddNewCompanies = async () => {
    try {
      setAddLoading(true);
      const usedCompanyIds = usedRows.map((i) => i.companyId);
      const companiesToAdd = companyArray
        .filter(
          (company) =>
            selectedCompanies.includes(company.companyid) &&
            !usedCompanyIds.includes(company.companyid)
        )
        .map((i) => ({ companyId: i.companyid, companyName: i.companyname }));

      const requestData = {
        clientId,
        companies: companiesToAdd,
      };
      const response = await axiosInstance.post(
        `addCompanyToBasket`,
        requestData
      );
      if (response.data.data.success.length) {
        toast.success(response.data.data.success[0].message);
        setSelectedCompanies([]);
        handleFetchMainData();
        handleClose();
      } else {
        toast.error(response.data.data.error[0]?.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemoveCompanies = async () => {
    try {
      setRemoveLoading(true);
      const params = {
        clientId,
        companyIds: selectedRows.map((i) => i.companyId).join(","),
      };
      const response = await axiosInstance.delete(`removeCompanyFromBasket/`, {
        params,
      });
      if (response.data.data.success.length) {
        toast.success(response.data.data.success[0].message);
        handleFetchMainData();

        setSelectedRows([]);
        setSelectionModal([]);
        handleClose();
      } else {
        toast.error(response.data.data.error[0]?.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setRemoveLoading(false);
    }
  };

  const handleCloseAll = () => {
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 600,
          backgroundColor: "white",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography textAlign={"end"}>
          <IconButton onClick={handleCloseAll}>
            <CloseIcon />
          </IconButton>
        </Typography>
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: "3px",
            my: 0.3,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            justifyContent: "end",
            p: 0.2,
          }}
        >
          <CustomMultiSelect
            dropdownToggleWidth={270}
            dropdownWidth={270}
            keyId="companyid"
            keyName="companyname"
            options={companyArray || []}
            selectedItems={selectedCompanies}
            setSelectedItems={setSelectedCompanies}
            title="Companies"
          />

          <Typography display={"flex"} gap={0.5}>
            <Button
              onClick={handleAddNewCompanies}
              size="small"
              variant="outlined"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {addLoading && <CircularProgress size={"1em"} />}
              Add
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={handleRemoveCompanies}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {removeLoading && <CircularProgress size={"1em"} />}
              Remove
            </Button>
          </Typography>
        </Box>
        <Box sx={{ height: 450, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            checkboxSelection
            density="compact"
            rowSelectionModel={selectionModal}
            onRowSelectionModelChange={handleSelectionChange}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default AddGridModal;
