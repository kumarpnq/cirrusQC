import PropTypes from "prop-types";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { Button, Paper, Box, Tooltip, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { format } from "date-fns";
import { formattedNextDay } from "../../constants/dates";
import { url } from "../../constants/baseUrl";
import ToDate from "../../components/research-dropdowns/ToDate";
import CustomDebounceDropdown from "../../@core/CustomDebounceDropdown";
import Publication from "../../print-components/dropdowns/Publication";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 27,
    fontSize: "0.8em",
    marginTop: "1em",
  },
  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    background: "#d4c8c7",
  },
  componentHeight: {
    height: 25,
    display: "flex",
    alignItems: "center",
  },
}));
const SearchFilters = ({ setData, loading, setLoading }) => {
  const classes = useStyle();
  const [articleDate, setArticleDate] = useState(formattedNextDay);
  const [uploadDate, setUploadDate] = useState(formattedNextDay);
  const [publicationGroup, setPublicationGroup] = useState("");
  const [publication, setPublication] = useState("");

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("user");
      const params = {
        article_date: format(articleDate, "yyyy-MM-dd"),
        upload_date: format(uploadDate, "yyyy-MM-dd"),
      };
      if (publicationGroup) {
        params.pubgroup_id = publicationGroup;
      }
      if (publication) {
        params.publication_id = publication;
      }
      //   const testURL = "http://127.0.0.1:8000/";
      const response = await axios.get(`${url}articlesfordelete/`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      const responseData = response.data.articles;
      setData(Array.isArray(responseData) ? responseData : []);
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setArticleDate(formattedNextDay);
    setUploadDate(formattedNextDay);
    setPublicationGroup("");
    setPublication("");
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <Box
        component={Paper}
        sx={{
          display: "flex",
          alignItems: "center",
          pl: 1,
          flexWrap: "wrap",
          py: 0.5,
        }}
        className="gap-1"
      >
        <Tooltip title="Article Date">
          <Box>
            <ToDate dateNow={articleDate} setDateNow={setArticleDate} />
          </Box>
        </Tooltip>
        <Tooltip title="Upload Date">
          <Box>
            <ToDate dateNow={uploadDate} setDateNow={setUploadDate} />
          </Box>
        </Tooltip>
        <CustomDebounceDropdown
          publicationGroup={publicationGroup}
          setPublicationGroup={setPublicationGroup}
          bg="secondory"
          m="mt-0"
        />
        <div className="mb-3">
          <Publication
            publicationGroup={publicationGroup}
            publication={publication}
            setPublication={setPublication}
            classes={classes}
            width={200}
          />
        </div>
        <Button size="small" variant="outlined" onClick={handleReset}>
          Reset
        </Button>
        <Button
          size="small"
          variant="outlined"
          type="submit"
          sx={{ display: "flex", alignItems: "center", gap: 2 }}
        >
          {loading && <CircularProgress size={"1em"} />}
          Search
        </Button>
      </Box>
    </form>
  );
};

SearchFilters.propTypes = {
  setData: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default SearchFilters;
