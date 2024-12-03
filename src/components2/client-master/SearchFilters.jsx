import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CustomTextField from "../../@core/CutsomTextField";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/system";
import AddClientModal from "./AddClientModal";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";
import DeleteConfirmationDialog from "../../@core/DeleteConfirmationDialog";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));

const StyledWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 2,
  marginTop: 1,
  padding: 2,
});

const SearchFilters = ({
  loading,
  setLoading = () => {},
  setData,
  selectedItems,
  setSelectedItems,
  setSelectionModal,
}) => {
  const classes = useStyle();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isActive, setIsActive] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen((prev) => !prev);
  const handleDeleteOpen = () => setDeleteOpen((prev) => !prev);
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    try {
      setLoading(true);

      const params = {
        //    searchText: Optional[str] = None,
        // fromDate:Optional[str] = None,
        // toDate:Optional[str] = None,
        // isActive: Optional[str] = None,
      };
      if (searchText) params.searchText = searchText;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (isActive)
        params.isActive =
          (isActive === "Active" && "Y") || (isActive === "In Active" && "N");

      const response = await axiosInstance.get("clientMaster/", { params });

      setData(response.data.data.data || []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async () => {
    try {
      const clientIds = selectedItems.map((i) => i.clientId);
      const params = {
        clientIds: clientIds?.join(","),
      };
      const response = await axiosInstance.delete(`removeClient/`, {
        params,
      });
      if (response.status === 200) {
        toast.success(response.data.data.message);

        handleDeleteClose();
        setSelectedItems([]);
        setSelectionModal([]);
        await handleSubmit();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-1">
        <StyledWrapper component={Paper}>
          <div className="flex items-center p-1 border border-gray-400 rounded-md">
            <Typography fontSize={"0.8em"}>Subscription Start : </Typography>
            <FromDate
              fromDate={fromDate}
              setFromDate={setFromDate}
              isNoMargin
            />
          </div>
          <div className="flex items-center p-1 border border-gray-400 rounded-md">
            <Typography fontSize={"0.8em"}>Subscription End : </Typography>
            <ToDate dateNow={toDate} setDateNow={setToDate} />
          </div>

          <CustomTextField
            width={200}
            placeholder={"search text"}
            type={"text"}
            value={searchText}
            setValue={setSearchText}
          />
          <YesOrNo
            classes={classes}
            mapValue={["All", "Active", "In Active"]}
            placeholder="active"
            value={isActive}
            setValue={setIsActive}
            width={100}
          />

          <Button
            size="small"
            variant="outlined"
            type="submit"
            sx={{ mb: 0.3, display: "flex", alignItems: "center", gap: 1 }}
          >
            {loading && <CircularProgress size={"1em"} />}
            Search
          </Button>
          <Button
            size="small"
            variant="outlined"
            sx={{ mb: 0.3 }}
            onClick={() => setOpen((prev) => !prev)}
          >
            Add
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            sx={{ mb: 0.3 }}
            onClick={handleDeleteOpen}
          >
            Delete
          </Button>
        </StyledWrapper>
      </form>
      <AddClientModal open={open} onClose={handleClose} />
      <DeleteConfirmationDialog
        open={deleteOpen}
        onDelete={handleDeleteClient}
        onClose={handleDeleteClose}
      />
    </>
  );
};

export default SearchFilters;
