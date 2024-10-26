import {
  Box,
  Typography,
  FormControl,
  TextField,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";

import { useEffect, useState } from "react";
import ToDate from "../components/research-dropdowns/ToDate";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

// ** third party imports
import { format } from "date-fns";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

// * constants
import { url } from "../constants/baseUrl";
import useFetchData from "../hooks/useFetchData";
import DebounceSearchCompany from "../@core/DebounceSearchCompany";
import { isDomainIncluded } from "../utils/isDomainIncluded";
import { formattedNextDay } from "../constants/dates";

const Details = ({
  type,
  // articleURl,
  // setArticleURL,
  setIsArticleSaved,
  errorList,
  articleNumber,
  setArticleNumber,
  setLink,
}) => {
  const userToken = localStorage.getItem("user");
  const [selectedRow, setSelectedRow] = useState(errorList[articleNumber]);
  const today = format(new Date(), "dd-MM-yyyy");

  useEffect(() => {
    setSelectedRow(errorList.length > 0 ? errorList[articleNumber] : null);
  }, [articleNumber, errorList]);

  useEffect(() => {
    setLink(selectedRow?.articlelink);
  }, [articleNumber, selectedRow]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [searchURl, setSearchURL] = useState(selectedRow?.searchlink);
  const [articleURL, setArticleURL] = useState("");
  const [publication, setPublication] = useState(selectedRow?.publicationname);
  const [selectedLanguages, setSelectedLanguages] = useState("en");
  const [selectedCompanies, setSelectedCompanies] = useState(null);
  const [dateNow, setDateNow] = useState(
    selectedRow?.feeddate || formattedNextDay
  );
  const [saveLoading, setSaveLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [pasteLoading, setPasteLoading] = useState(false);
  const [helperText, setHelperText] = useState("");

  const {
    data: langs,
    error: langsError,
    // loading: langsLoading,
  } = useFetchData(`${url}languagelist/`);
  useEffect(() => {
    if (langs.data) {
      setLanguages(langs.data.languages);
    } else {
      console.log(langsError);
    }
  }, [langs, langsError]);

  const handleOnPaste = async (event) => {
    const text = event.clipboardData.getData("text");
    try {
      setPasteLoading(true);
      const token = localStorage.getItem("user");
      const response = await axios.get(
        `${url}getpublicationfromurl/?url=${text}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status?.statusCode === -1) {
        setHelperText(response.data?.status?.message);
      } else {
        setPublication(response.data.publication);
      }
    } catch (error) {
      toast.warning("Something went wrong.");
    } finally {
      setPasteLoading(false);
    }
  };
  const handleSave = async (event) => {
    event.preventDefault();
    const isBothUrlSame = isDomainIncluded(articleURL, publication);
    const emptyFields = [];

    if (!articleURL) emptyFields.push("Article URL");
    if (!selectedCompanies?.value) emptyFields.push("Company");
    if (!dateNow) emptyFields.push("Date");
    if (!title) emptyFields.push("Title");
    if (!summary) emptyFields.push("Summary");
    if (!content) emptyFields.push("Content");
    if (!selectedLanguages) emptyFields.push("Language");

    if (emptyFields.length > 0) {
      return toast.warning(
        `The following fields are empty: ${emptyFields.join(", ")}`
      );
    }
    if (!isBothUrlSame) return toast.warning("Url not match with publication");
    try {
      setSaveLoading(true);
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      const request_data = {
        url: articleURL,
        searchurl: searchURl,
        companyid: selectedCompanies.value,
        article_datetime: dateNow,
        publication: publication,
        title: title,
        summary: summary,
        content: content,
        image: image,
        language: selectedLanguages,
        otherlink: type,
      };
      const response = await axios.post(
        `${url}addsocialfeedmanual/`,
        request_data,
        { headers }
      );

      const isSuccess = response.data?.result?.success?.length;
      const isFail = response.data?.result?.errors?.length;
      const erMessage = response.data?.result?.errors?.map((i) => i.errors);
      if (isSuccess) {
        toast.success("Updated successfully");

        setArticleNumber((prev) => prev + 1);
        setSelectedRow(errorList[articleNumber]);
        setIsArticleSaved(true);
      } else if (isFail) {
        toast.warning("Already URL is present in Database");
      }

      setSaveLoading(false);
      // setDateNow(null);
      setTitle("");
      setContent("");
      setSummary("");
      setImage("");
      setArticleURL("");
      if (!type) {
        setSelectedCompanies(null);
        setSelectedLanguages("en");
      }
      setPublication("");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (selectedRow) {
      if (type === 0) {
        setTitle("");
        setContent("");
        setSummary("");
        setImage("");
        setSelectedLanguages("");
        setSearchURL(selectedRow.searchlink);
        setArticleURL(selectedRow.articlelink);
        setPublication(selectedRow.publicationname);
        setDateNow(selectedRow.feeddate);
      } else {
        setTitle("");
        setContent("");
        setSummary("");
        setImage("");
        setSelectedLanguages("en");
        setSearchURL("");
        setArticleURL("");
        setPublication("");
        setSelectedCompanies(null);
        setDateNow(today);
      }
    }
  }, [selectedRow, setArticleURL, type]);

  return (
    <Box className="w-full h-[80vh] border shadow-md">
      <Box sx={{ px: 2 }}>
        <FormControl>
          <form onSubmit={handleSave}>
            <Box mb={1} display="flex" alignItems="center" width={"100%"}>
              <Typography sx={{ fontSize: "0.9em" }}>Title:</Typography>
              <TextField
                size="small"
                sx={{ ml: 6.3 }}
                fullWidth
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                InputProps={{
                  style: {
                    fontSize: "0.8rem",
                    height: 25,
                    border: !title ? "1px solid red" : "",
                  },
                }}
              />
            </Box>
            <Box mb={1} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em" }}>Content:</Typography>
              <textarea
                className="ml-7 w-full outline-none border border-gray-400 border:opacity-50 rounded-[3px] text-[0.9em] px-2"
                style={{ border: !content && "1px solid red" }}
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Box>
            <Box mb={1} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em" }}>Summary:</Typography>
              <textarea
                className="ml-4 w-full outline-none border border-gray-400 border:opacity-50 rounded-[3px] text-[0.9em] px-2"
                style={{ border: !summary && "1px solid red" }}
                rows={4}
                value={summary}
                required
                onChange={(e) => setSummary(e.target.value)}
              />
            </Box>
            <Box mb={1} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em" }}>Image:</Typography>
              <TextField
                size="small"
                sx={{ ml: 4.6 }}
                fullWidth
                value={image}
                onChange={(e) => setImage(e.target.value)}
                InputProps={{
                  style: {
                    fontSize: "0.8rem",
                    height: 25,
                  },
                }}
              />
            </Box>
            <Box mb={1} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em" }}>SearchURL:</Typography>
              <TextField
                size="small"
                disabled
                fullWidth
                sx={{ ml: 0.5 }}
                value={searchURl}
                onChange={(e) => setSearchURL(e.target.value)}
                InputProps={{
                  style: {
                    fontSize: "0.8rem",
                    height: 25,
                  },
                }}
              />
            </Box>
            <Box mb={1} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em" }}>ArticleURL:</Typography>
              <TextField
                size="small"
                fullWidth
                sx={{ ml: 1 }}
                value={articleURL}
                required
                onChange={(e) => setArticleURL(e.target.value)}
                onPaste={handleOnPaste}
                helperText={<span className="text-red-500">{helperText}</span>}
                InputProps={{
                  style: {
                    fontSize: "0.8rem",
                    height: 25,
                    border: !articleURL && "1px solid red",
                  },
                  endAdornment: pasteLoading && <CircularProgress size={20} />,
                }}
              />
            </Box>
            <Box
              mb={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <Typography sx={{ fontSize: "0.9em" }}>Company:</Typography>
                <div className="ml-4">
                  <DebounceSearchCompany
                    setSelectedCompany={setSelectedCompanies}
                    selectedCompany={selectedCompanies}
                  />
                </div>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography sx={{ fontSize: "0.9em", ml: 1 }}>
                  Language:
                </Typography>
                <div className="ml-2">
                  <select
                    className="border border-gray-400 rounded-[3px] text-[0.9em]"
                    value={selectedLanguages}
                    onChange={(e) => setSelectedLanguages(e.target.value)}
                  >
                    <option value="">Language</option>
                    {Object.entries(languages).map(
                      ([languagename, languagecode]) => (
                        <option key={languagecode} value={languagecode}>
                          {languagename}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </Box>
            </Box>
            <Box
              mb={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex" alignItems="center">
                <Typography sx={{ fontSize: "0.9em" }}>Publication:</Typography>
                <TextField
                  size="small"
                  fullWidth
                  sx={{ ml: 1 }}
                  value={publication}
                  required
                  onChange={(e) => setPublication(e.target.value)}
                  disabled={type === 1}
                  InputProps={{
                    style: {
                      fontSize: "0.8rem",
                      height: 25,
                      border: !publication && "1px solid red",
                    },
                  }}
                />
              </Box>

              <Box display="flex" alignItems="center">
                <Typography sx={{ fontSize: "0.9em" }}>Date:</Typography>
                {dateNow ? (
                  <CheckIcon sx={{ color: "green", fontSize: "1em" }} />
                ) : (
                  <CloseIcon sx={{ color: "red", fontSize: "1em" }} />
                )}
                <div className="">
                  <ToDate
                    dateNow={dateNow}
                    setDateNow={setDateNow}
                    isMargin={false}
                  />
                </div>
              </Box>
            </Box>
            <Divider />
            <Box mt={1} display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="outlined"
                size="small"
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                {saveLoading && <CircularProgress size={"1em"} />}Submit
              </Button>
            </Box>
          </form>
        </FormControl>
      </Box>
    </Box>
  );
};

Details.propTypes = {
  selectedRow: PropTypes.shape({
    searchlink: PropTypes.string,
    articlelink: PropTypes.string,
    publicationname: PropTypes.string,
    feeddate: PropTypes.string,
  }),
  type: PropTypes.number.isRequired,
  articleURl: PropTypes.string.isRequired,
  setArticleURL: PropTypes.func.isRequired,
  setIsArticleSaved: PropTypes.func.isRequired,
  errorList: PropTypes.array.isRequired,
  articleNumber: PropTypes.number.isRequired,
  setArticleNumber: PropTypes.func.isRequired,
  setLink: PropTypes.func.isRequired,
};
export default Details;
