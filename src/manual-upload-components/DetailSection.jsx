import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  TextField,
  CardHeader,
} from "@mui/material";

import Button from "../components/custom/Button";
import { useContext, useEffect, useState } from "react";
import ToDate from "../components/research-dropdowns/ToDate";
import { ResearchContext } from "../context/ContextProvider";

// ** third party imports

import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../constants/baseUrl";

import DebounceSearch from "../print-components/dropdowns/DebounceSearch";
import useFetchData from "../hooks/useFetchData";

const Details = ({ selectedRow, type, articleURl, setArticleURL }) => {
  const { userToken } = useContext(ResearchContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [searchURl, setSearchURL] = useState(selectedRow?.searchlink);
  const [publication, setPublication] = useState(selectedRow?.publicationname);
  const [selectedLanguages, setSelectedLanguages] = useState("en");
  const [selectedCompanies, setSelectedCompanies] = useState("");
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

  function isDomainIncluded(url, domain) {
    const escapedDomain = domain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:https?:\/\/)?(?:www\.)?${escapedDomain}`, "i");
    return regex.test(url);
  }
  const handleSave = async () => {
    const isBothUrlSame = isDomainIncluded(articleURl, publication);
    if (
      !articleURl ||
      !searchURl ||
      (!selectedCompanies.value && !dateNow) ||
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
        url: articleURl,
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
      if (isSuccess) {
        toast.success("Updated successfully");
      } else if (isFail) {
        toast.warning("Something wrong");
      }
      setSaveLoading(false);
      setTitle("");
      setContent("");
      setSummary("");
      setImage("");
      setSelectedCompanies("");
      setSelectedLanguages("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader
        title={
          <Typography variant="h6" fontSize={"0.9em"} fontFamily="nunito">
            Basic Details
          </Typography>
        }
      />
      <CardContent sx={{ px: 2 }}>
        <FormControl>
          <Box mb={1} display="flex" alignItems="center" width={580}>
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
              value={articleURl}
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
                <DebounceSearch
                  selectedCompany={selectedCompanies}
                  setSelectedCompany={setSelectedCompanies}
                />
              </div>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em", ml: 1 }}>
                Language:
              </Typography>
              <div className="ml-2">
                {/* <Languages
                  language={selectedLanguages}
                  setLanguage={setSelectedLanguages}
                  classes={classes}
                /> */}
                <select
                  className="border border-gray-400 rounded-[3px] text-[0.9em]"
                  value={selectedLanguages}
                  onChange={(e) => setSelectedLanguages(e.target.value)}
                >
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
      </CardContent>
    </Card>
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
};
export default Details;
