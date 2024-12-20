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
import Button from "../../components/custom/Button";
import { yesNoToBinary } from "../../utils/yesNoToBinary";

const Details = ({ selectedRow, userToken }) => {
  const [headline, setHeadline] = useState(selectedRow?.headline);
  const [journalist, setJournalist] = useState(selectedRow?.author_name);
  const [summary, setSummary] = useState(selectedRow?.headsummary);

  const [iAlignment, setIAlignment] = useState(selectedRow?.has_image);
  const [vAlignment, setVAlignment] = useState(selectedRow?.has_video);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (selectedRow) {
      setHeadline(selectedRow?.headline);
      setJournalist(selectedRow?.author_name);
      setIAlignment(selectedRow?.has_image);
      setVAlignment(selectedRow?.has_video);
    }
  }, [selectedRow]);

  const handleImageChange = (event, newAlignment) => {
    setIAlignment(newAlignment);
  };
  const handleVideoChange = (event, newAlignment) => {
    setVAlignment(newAlignment);
  };

  const handleHeaderUpdate = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      setUpdateLoading(true);
      const request_data = {
        data: [
          {
            updateType: "U",
            socialFeedId: selectedRow?.social_feed_id,
            headline: headline,
            summary: summary,
            author: journalist,
            hasImage: yesNoToBinary(iAlignment),
            hasVideo: yesNoToBinary(vAlignment),
          },
        ],
        qcType: "QC2",
      };
      const response = await axios.post(
        `${url}updatesocialfeedheader/`,
        request_data,
        { headers }
      );
      if (response.status == 200) {
        toast.success("Updated Successfully.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setUpdateLoading(false);
    }
  };
  return (
    <Container className="w-full">
      <Card className="w-full">
        <Typography variant="h2" fontSize={"0.9em"} ml={2}>
          Edit
        </Typography>

        <CardContent sx={{ mx: 1 }}>
          <FormControl>
            <Box mb={1} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em" }}>RootURL:</Typography>
              <Typography
                sx={{ fontSize: "0.9em", fontWeight: "bold", ml: 1.7 }}
              >
                {selectedRow?.link}
              </Typography>
            </Box>
            <Box mb={1} display="flex" alignItems="center" width={580}>
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
            <Box mb={1} display="flex" alignItems="center" width={580}>
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
                <Typography sx={{ fontSize: "0.9em" }}>Video:</Typography>
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
              <Typography
                sx={{ fontSize: "0.9em", fontWeight: "bold", ml: 3.5 }}
              >
                {selectedRow?.qc1_by}
              </Typography>
            </Box>

            <Box mb={1} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em" }}>Summary:</Typography>
              <textarea
                className="ml-3 w-full outline-none border border-gray-400 rounded-[3px] text-[0.8em] px-2 font-normal text-black placeholder:font-black"
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button
                btnText={updateLoading ? "updating" : "update"}
                onClick={handleHeaderUpdate}
                isLoading={updateLoading}
              />
            </Box>
          </FormControl>
        </CardContent>
      </Card>
    </Container>
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
  selectedCompany: PropTypes.string.isRequired,
  setSelectedCompany: PropTypes.func.isRequired,
  userToken: PropTypes.string.isRequired,
};
export default Details;
