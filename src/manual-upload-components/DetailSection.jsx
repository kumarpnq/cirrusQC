import { Box, Typography, FormControl, TextField } from "@mui/material";

import Button from "../components/custom/Button";
import { useEffect, useState } from "react";
import ToDate from "../components/research-dropdowns/ToDate";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

// ** third party imports
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

// * constants
import { url } from "../constants/baseUrl";
import useFetchData from "../hooks/useFetchData";
import { formattedDate } from "../constants/dates";
import DebounceSearchCompany from "../@core/DebounceSearchCompany";
import { isDomainIncluded } from "../utils/isDomainIncluded";

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
  const [selectedLanguages, setSelectedLanguages] = useState("");
  const [selectedCompanies, setSelectedCompanies] = useState(null);
  const [dateNow, setDateNow] = useState(selectedRow?.feeddate);
  const [saveLoading, setSaveLoading] = useState(false);
  const [languages, setLanguages] = useState([]);

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

  const handleSave = async () => {
    const isBothUrlSame = isDomainIncluded(articleURL, publication);

    if (
      !articleURL ||
      !selectedCompanies?.value ||
      !dateNow ||
      !title ||
      !summary ||
      !content ||
      !selectedLanguages
    ) {
      return toast.warning("Some fields are empty!");
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
      setDateNow(null);
      setTitle("");
      setContent("");
      setSummary("");
      setImage("");
      setArticleURL("");
      setSelectedCompanies(null);
      setSelectedLanguages("");
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
        setSelectedLanguages("");
        setSearchURL("");
        setArticleURL("");
        setPublication("");
        setSelectedCompanies(null);
        setDateNow(formattedDate);
      }
    }
  }, [selectedRow, setArticleURL, type]);

  return (
    <Box className="w-full h-[80vh] border shadow-md">
      <Box sx={{ px: 2 }}>
        <FormControl>
          <Box mb={1} display="flex" alignItems="center" width={"100%"}>
            <Typography sx={{ fontSize: "0.9em" }}>Title:</Typography>
            <TextField
              size="small"
              sx={{ ml: 6.3 }}
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box mb={1} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Content:</Typography>
            <textarea
              className="ml-7 w-full outline-none border border-gray-400 border:opacity-50 rounded-[3px] text-[0.9em] px-2"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Box>
          <Box mb={1} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Summary:</Typography>
            <textarea
              className="ml-4 w-full outline-none border border-gray-400 border:opacity-50 rounded-[3px] text-[0.9em] px-2"
              rows={4}
              value={summary}
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
              onChange={(e) => setArticleURL(e.target.value)}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
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
                onChange={(e) => setPublication(e.target.value)}
                InputProps={{
                  style: {
                    fontSize: "0.8rem",
                    height: 25,
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

          <Box mt={1} display="flex" justifyContent="flex-end">
            <Button btnText="Cancel" />
            <Button
              btnText={saveLoading ? "Loading" : "Save"}
              onClick={handleSave}
              isLoading={saveLoading}
            />
          </Box>
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
