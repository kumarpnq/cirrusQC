import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  TextField,
  CardHeader,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import Button from "../components/custom/Button";
import Languages from "../components/research-dropdowns/Languages";
import { useContext, useState } from "react";
import ToDate from "../components/research-dropdowns/ToDate";
import { ResearchContext } from "../context/ContextProvider";

// ** third party imports

import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { url } from "../constants/baseUrl";

import DebounceSearch from "../print-components/dropdowns/DebounceSearch";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },

  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    background: "#d4c8c7",
  },
}));
const Details = ({ selectedRow }) => {
  const { userToken } = useContext(ResearchContext);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [image, setImage] = useState("");
  const [searchURl, setSearchURL] = useState(selectedRow?.searchlink);
  const [articleURl, setArticleURL] = useState(selectedRow?.articlelink);
  const [publication, setPublication] = useState(selectedRow?.publicationname);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState("");
  const [dateNow, setDateNow] = useState(selectedRow?.feeddate);
  const [saveLoading, setSaveLoading] = useState(false);

  const classes = useStyle();

  const handleSave = async () => {
    const arrayToString = (arr) => {
      if (Array.isArray(arr) && arr.length > 0) {
        return arr.map((item) => `'${item}'`).join(",");
      }
      return "";
    };
    try {
      setSaveLoading(true);
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      const request_data = {
        url: articleURl,
        companyid: arrayToString(selectedCompanies),
        article_datetime: dateNow,
        publication: publication,
        title: title,
        summary: summary,
        image: image,
        language: selectedLanguages,
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
      setSelectedLanguages([]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card className="w-full">
      <CardHeader
        title={
          <Typography variant="h6" fontSize={"0.9em"}>
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
                <Languages
                  language={selectedLanguages}
                  setLanguage={setSelectedLanguages}
                  classes={classes}
                />
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
    publicationname: PropTypes.string,
  }),
};
export default Details;
