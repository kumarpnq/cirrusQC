import { Box, Button, CircularProgress, Paper } from "@mui/material";
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
});

const SearchFilters = ({ loading, setLoading = () => {}, setData }) => {
  const classes = useStyle();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isActive, setIsActive] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      console.log(response);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-1 ">
        <StyledWrapper component={Paper}>
          <FromDate fromDate={fromDate} setFromDate={setFromDate} isNoMargin />
          <ToDate dateNow={toDate} setDateNow={setToDate} />

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
          >
            Delete
          </Button>
        </StyledWrapper>
      </form>
      <AddClientModal open={open} onClose={handleClose} />
    </>
  );
};

export default SearchFilters;
