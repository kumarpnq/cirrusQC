import PropTypes from "prop-types";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { styled } from "@mui/system";
import FromDate from "../components/research-dropdowns/FromDate";
import { useState } from "react";
import { formattedDate } from "../constants/dates";
import CustomTextField from "../@core/CutsomTextField";
import CustomMultiSelect from "../@core/CustomMultiSelect";
import axios from "axios";
import { makeStyles } from "@mui/styles";
import YesOrNo from "../@core/YesOrNo";
import useFetchData from "../hooks/useFetchData";
import { url } from "../constants/baseUrl";
import CustomSingleSelect from "../@core/CustomSingleSelect2";
import { arrayToString } from "../utils/arrayToString";
import { toast } from "react-toastify";

const FilterWrapper = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 3,
  paddingBottom: 1,
});
const StyledButton = styled(Button)({
  height: 25,
  display: "flex",
  alignItems: "center",
});
const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },
}));
const Filters = (props) => {
  const classes = useStyle();
  const {
    gridLoading,
    setGridLoading,
    setGridData,
    setGridError,
    setSelectedPublications,
  } = props;
  const [uploadDate, setUploadDate] = useState(formattedDate);
  const [dateType, setDateType] = useState("ARTICLE");
  const [pageNumber, setPageNumber] = useState();
  const [publication, setPublication] = useState(null);
  const [copyPublications, setCopyPublications] = useState([]);

  const { data } = useFetchData(`${url}articlepublications/`);
  const publications = data.data?.publications || [];
  const { data: publicationsData } = useFetchData(
    `${url}copyarticlespublications/?publicationId=${publication}`
  );

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!pageNumber || !copyPublications.length) {
      toast.warning("Page or copy publications required.");
      return;
    }
    try {
      setGridLoading(true);
      const token = localStorage.getItem("user");
      const params = {
        publicationIds: arrayToString(copyPublications),
        date: format(uploadDate, "yyyy-MM-dd"),
        pageNumber,
        dateType: dateType?.toLocaleLowerCase(),
      };
      const response = await axios.get(`${url}copyarticlesdata/`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setGridData(response.data.publications || []);
      // const tempLogic = setSelectedPublications([...copyPublications]);
    } catch (error) {
      console.log(error);
      setGridError(error.message);
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
        <Typography component={"div"} sx={{ mt: 1.5 }} height={25}>
          <YesOrNo
            classes={classes}
            value={dateType}
            setValue={setDateType}
            width={200}
            placeholder="Date type"
            mapValue={["ARTICLE", "UPLOAD"]}
          />
        </Typography>
        <Typography component={"div"} sx={{ mt: 1.5 }} height={25}>
          <CustomTextField
            placeholder={"Page"}
            type={"number"}
            width={100}
            value={pageNumber}
            setValue={setPageNumber}
          />
        </Typography>
        <Typography component={"div"} sx={{ mt: 1.5 }}>
          <CustomSingleSelect
            title="Publication"
            dropdownWidth={300}
            dropdownToggleWidth={250}
            keyId="publicationId"
            keyName="publicationName"
            options={publications}
            setSelectedItem={setPublication}
            selectedItem={publication}
          />
        </Typography>
        <Typography component={"div"} sx={{ mt: 1.5 }} width={200} height={25}>
          <CustomMultiSelect
            title="Copy Publication"
            dropdownWidth={300}
            dropdownToggleWidth={250}
            keyId="publicationId"
            keyName="publicationName"
            options={publicationsData.data?.publications || []}
            selectedItems={copyPublications}
            setSelectedItems={setCopyPublications}
          />
        </Typography>
        <Typography
          component={"div"}
          sx={{ mt: 1, ml: 6.2 }}
          width={50}
          height={22}
        >
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
