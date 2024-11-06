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
  padding: 10,
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
    selectedRows,
    selectedPublications,
  } = props;
  const [uploadDate, setUploadDate] = useState(formattedDate);
  const [dateType, setDateType] = useState("ARTICLE");
  const [pageNumber, setPageNumber] = useState();
  const [publication, setPublication] = useState(null);
  const [copyPublications, setCopyPublications] = useState([]);
  const [saveLoading, setSaveLoading] = useState(false);

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
        publicationId: publication,
        date: format(uploadDate, "yyyy-MM-dd"),
        pageNumber,
        dateType: dateType?.toLocaleLowerCase(),
      };
      const response = await axios.get(`${url}copyarticlesdata/`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      const params2 = {
        publicationIds: arrayToString(copyPublications),
      };
      const response2 = await axios.get(`${url}selectedcopypublication/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: params2,
      });

      setGridData(response.data.publications || []);

      const tempData = response2.data.publications || [];
      setSelectedPublications(tempData || []);
    } catch (error) {
      toast.error("Error while fetching data.");
      setGridError(error.message);
    } finally {
      setGridLoading(false);
    }
  };

  const handleSaveData = async () => {
    if (!selectedRows.length) {
      toast.warning("No data selected.");
      return;
    }
    try {
      setSaveLoading(true);
      const hasPageNumberZero = selectedRows.some((row) =>
        selectedPublications.some((pub) => Number(pub.pageNumber) === 0)
      );
      if (hasPageNumberZero) {
        toast.warning("Page number zero is not allowed.");
        return;
      }

      const preparedData = selectedRows.map((row) => ({
        articleId: row.id,
        publications: selectedPublications.map((pub) => ({
          publicationId: pub.publicationId,
          cityId: pub.cityId,
          pageNumber: Number(pub.pageNumber),
        })),
      }));

      const token = localStorage.getItem("user");
      const requestData = {
        articles: preparedData,
      };
      const response = await axios.post(
        `${url}generatecopyarticles/`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.result?.length) {
        toast.success("Data saved successfully.");
      }
      toast.success(response.data.result?.status);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setSaveLoading(false);
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
            dropdownWidth={360}
            dropdownToggleWidth={250}
            keyId="publicationId"
            keyName="publicationName"
            options={publications}
            setSelectedItem={setPublication}
            selectedItem={publication}
            isIncreased
          />
        </Typography>
        <Typography component={"div"} sx={{ mt: 1.5 }} width={200} height={25}>
          <CustomMultiSelect
            title="Copy Publication"
            dropdownWidth={360}
            dropdownToggleWidth={250}
            keyId="publicationId"
            keyName="publicationName"
            options={publicationsData.data?.publications || []}
            selectedItems={copyPublications}
            setSelectedItems={setCopyPublications}
            isIncreased
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
        <Typography
          component={"div"}
          sx={{ mt: 1, ml: 5 }}
          width={50}
          height={22}
        >
          {!!selectedRows.length && (
            <StyledButton
              variant="outlined"
              size="small"
              onClick={handleSaveData}
            >
              {saveLoading && <CircularProgress size={"1em"} />} Save
            </StyledButton>
          )}
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
  selectedRows: PropTypes.array.isRequired,
  setSelectedPublications: PropTypes.func.isRequired,
  selectedPublications: PropTypes.array.isRequired,
};

export default Filters;
