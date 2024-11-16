import { Box, Button, Paper } from "@mui/material";
import { useState } from "react";
import CustomTextField from "../../@core/CutsomTextField";
import FromDate from "../../components/research-dropdowns/FromDate";
import ToDate from "../../components/research-dropdowns/ToDate";
import YesOrNo from "../../@core/YesOrNo";
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/system";
import EditAddModal from "./EditAddModal";
import AddClientModal from "./AddClientModal";

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

const SearchFilters = () => {
  const classes = useStyle();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [display, setDisplay] = useState(50);
  const [searchText, setSearchText] = useState("");
  const [isActive, setIsActive] = useState("");

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen((prev) => !prev);

  const handleSubmit = async (event) => {
    event.preventDefault();
    alert("Yeah you clicked!");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-1 ">
        <StyledWrapper component={Paper}>
          <FromDate fromDate={fromDate} setFromDate={setFromDate} isNoMargin />
          <ToDate dateNow={toDate} setDateNow={setToDate} />
          <CustomTextField
            width={100}
            placeholder={"display"}
            type={"number"}
            value={display}
            setValue={setDisplay}
          />
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
            sx={{ mb: 0.3 }}
          >
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
