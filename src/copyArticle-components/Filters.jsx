import PropTypes from "prop-types";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import FromDate from "../components/research-dropdowns/FromDate";
import { useState } from "react";
import { formattedDate } from "../constants/dates";
import CustomTextField from "../@core/CutsomTextField";
import Publication from "./sub-components/Publication";
import CustomMultiSelect from "../@core/CustomMultiSelect";
import axios from "axios";

const FilterWrapper = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 3,
});
const StyledButton = styled(Button)({
  height: 25,
  display: "flex",
  alignItems: "center",
});
const Filters = (props) => {
  const { gridLoading, setGridLoading, setGridData, setGridError } = props;
  const [uploadDate, setUploadDate] = useState(formattedDate);
  const [articleDate, setArticleDate] = useState(formattedDate);
  const [pageNumber, setPageNumber] = useState();
  const [publication, setPublication] = useState("");
  const [copyPublications, setCopyPublications] = useState([]);

  // * table grid data from API

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      setGridLoading(true);
      const response = await axios.get("url");
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setGridLoading(false);
    }
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <FilterWrapper component={Paper}>
        <Tooltip title="Upload Date">
          <div className="ml-2">
            <FromDate fromDate={uploadDate} setFromDate={setUploadDate} />
          </div>
        </Tooltip>
        <Tooltip title="Article Date">
          <div>
            <FromDate fromDate={articleDate} setFromDate={setArticleDate} />
          </div>
        </Tooltip>
        <Typography component={"div"} sx={{ mt: 1.5 }} height={25}>
          <CustomTextField
            placeholder={"Page"}
            type={"number"}
            width={100}
            value={pageNumber}
            setValue={setPageNumber}
          />
        </Typography>
        <Typography component={"div"} sx={{ mt: 0.5 }}>
          <Publication
            label="Publication"
            options={[]}
            selectedValue={publication}
            setSelectedValue={setPublication}
            width={200}
          />
        </Typography>
        <Typography component={"div"} sx={{ mt: 1.5 }} width={200} height={25}>
          <CustomMultiSelect
            title="Copy Publication"
            dropdownWidth={200}
            dropdownToggleWidth={200}
            keyId="publicationid"
            keyName="publicationname"
            options={[]}
            selectedItems={copyPublications}
            setSelectedItems={setCopyPublications}
          />
        </Typography>
        <Typography component={"div"} sx={{ mt: 1 }} width={50} height={22}>
          <StyledButton
            type="submit"
            variant={gridLoading ? "outlined" : "contained"}
          >
            {gridLoading && <CircularProgress size={"1em"} />} Search
          </StyledButton>
        </Typography>
      </FilterWrapper>
    </form>
  );
};

Filters.propTypes = {
  gridLoading: PropTypes.bool.isRequired,
  setGridLoading: PropTypes.func.isRequired,
  setGridData: PropTypes.func.isRequired,
  setGridError: PropTypes.func.isRequired,
};

export default Filters;
