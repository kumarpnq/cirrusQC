import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  TextField,
  // CardHeader,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import { useEffect, useState } from "react";

// ** third party imports

import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";

import { url } from "../../constants/baseUrl";
import Button from "../custom/Button";

const Details = ({ selectedRow }) => {
  const userToken = localStorage.getItem("user");
  const socialFeedId = selectedRow?.social_feed_id;
  const [headerData, setHeaderData] = useState(null);
  const [headline, setHeadline] = useState("");
  const [journalist, setJournalist] = useState("");
  const [summary, setSummary] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  const [iAlignment, setIAlignment] = useState("");
  const [vAlignment, setVAlignment] = useState("");

  const handleImageChange = (event, newAlignment) => {
    setIAlignment(newAlignment);
  };
  const handleVideoChange = (event, newAlignment) => {
    setVAlignment(newAlignment);
  };

  // * fetching header data
  const fetchSocialFeedHeader = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      const response = await axios.get(
        `${url}socialfeedheader/?socialfeed_id=${socialFeedId}`,
        { headers }
      );
      const data = response.data.socialfeed[0] || {};
      if (data) {
        setHeaderData(data);
        setHeadline(data.headline);
        setJournalist(data.author_name);
        setSummary(data.headsummary);
        setIAlignment(data.has_image);
        setVAlignment(data.has_video);
      }
    } catch (error) {
      toast.warning("Error while fetching header data");
    }
  };
  useEffect(() => {
    fetchSocialFeedHeader();
  }, [socialFeedId, userToken]);

  const handleHeaderUpdate = async () => {
    try {
      setUpdateLoading(true);
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      let img = iAlignment === "Yes" ? 1 : 0;
      let video = vAlignment === "Yes" ? 1 : 0;
      const request_data = {
        // *comp
        socialFeedId: selectedRow?.social_feed_id,
        // * optional if value changed
        // HEADLINE: headline,
        // SUMMARY: summary,
        // AUTHOR: journalist,
        // HASIMAGE: img,
        // HASVIDEO: video,
      };

      if (headline !== headerData.headline) {
        request_data.headline = headline;
      }
      if (summary !== headerData.headsummary) {
        request_data.summary = summary;
      }
      if (journalist !== headerData.author_name) {
        request_data.author = journalist;
      }
      if (img !== (headerData.has_image === "Yes" ? 1 : 0)) {
        request_data.hasImage = img;
      }
      if (video !== (headerData.has_video === "Yes" ? 1 : 0)) {
        request_data.hasVideo = video;
      }
      // Check if there are any updates to be made
      const updatesExist = Object.keys(request_data).length > 1;

      if (!updatesExist) {
        setUpdateLoading(false);
        toast.warning("No changes to update.");
        return;
      }
      const data = { data: [request_data], qcType: "QC2" };
      const response = await axios.post(`${url}updatesocialfeedheader/`, data, {
        headers,
      });
      if (response) {
        setUpdateLoading(false);
        fetchSocialFeedHeader();
        toast.success("Updated Successfully.");
      }
    } catch (error) {
      setUpdateLoading(false);
      toast.error(error.message);
    }
  };
  return (
    <Box className="w-full">
      <Box width={"100%"}>
        <FormControl fullWidth>
          <Box mb={1} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>RootURL:</Typography>
            <TextField
              sx={{ ml: 1.5 }}
              fullWidth
              value={selectedRow?.link?.props?.href}
              InputProps={{
                readOnly: true,
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box mb={1} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Headlines:</Typography>
            <TextField
              size="small"
              sx={{ ml: 0.8 }}
              fullWidth
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box mb={1} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Journalist:</Typography>
            <TextField
              size="small"
              sx={{ ml: 1 }}
              fullWidth
              value={journalist}
              onChange={(e) => setJournalist(e.target.value)}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box mb={1} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em" }}>Image:</Typography>
              <ToggleButtonGroup
                color="primary"
                value={iAlignment}
                exclusive
                onChange={handleImageChange}
                aria-label="Platform"
                sx={{ ml: 3.8 }}
              >
                <ToggleButton value={"Yes"} size="small" color="success">
                  Yes
                </ToggleButton>
                <ToggleButton value={"No"} size="small" color="error">
                  No
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box mb={1} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em", mr: 2 }}>Video:</Typography>
              <ToggleButtonGroup
                color="primary"
                value={vAlignment}
                exclusive
                onChange={handleVideoChange}
                aria-label="Platform"
              >
                <ToggleButton value={"Yes"} size="small" color="success">
                  Yes
                </ToggleButton>
                <ToggleButton value={"No"} size="small" color="error">
                  No
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
          <Box mb={1} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Qc1By:</Typography>
            <Typography sx={{ fontSize: "0.9em", fontWeight: "bold", ml: 3.5 }}>
              {selectedRow?.qc1_by}
            </Typography>
          </Box>

          <Box mb={1} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Summary:</Typography>
            <TextField
              multiline
              fullWidth
              rows={4}
              InputProps={{ style: { fontSize: "0.9em" } }}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button
              btnText={updateLoading ? "Updating" : "Update"}
              onClick={handleHeaderUpdate}
              isLoading={updateLoading}
            />
          </Box>
        </FormControl>
      </Box>
    </Box>
  );
};

Details.propTypes = {
  selectedRow: PropTypes.shape({
    link: PropTypes.shape({
      props: PropTypes.shape({
        href: PropTypes.string,
      }),
    }),
    headline: PropTypes.string,
    author_name: PropTypes.string,
    headsummary: PropTypes.string,
    qc1_by: PropTypes.string,
    has_image: PropTypes.string,
    has_video: PropTypes.string,
    social_feed_id: PropTypes.string,
  }),
};
export default Details;
