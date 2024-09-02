import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "react-router-dom";
import { CloseOutlined } from "@mui/icons-material";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Paper,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";

import TextView from "../components/TextView";
import { url } from "../../../constants/baseUrl";

const ArticleView = ({ open, setOpen, clickedArticle }) => {
  const [scrolled, setScrolled] = useState(false);
  const handleClose = () => setOpen(false);
  const [openTextView, setOpenTextView] = useState(false);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAndParseContent = async () => {
    setLoading(true);
    setError(null);

    try {
      const userToken = localStorage.getItem("user");
      const response = await axios.get(
        `${url}getSocialFeedText/?url=${clickedArticle?.url}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      setContent(response.data.article_text);
    } catch (error) {
      setError("Failed to fetch or parse content");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // * manage scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "99vw",
            height: "99vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 1,
            outline: "none",
          }}
        >
          <Typography
            component={"button"}
            display={"flex"}
            justifyContent={"end"}
            width={"100%"}
          >
            <IconButton aria-label="" onClick={() => setOpen(false)}>
              <CloseOutlined />
            </IconButton>
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            position="sticky"
            top={0}
            height={50}
            className={`z-10 border-b-2 ${
              scrolled ? "bg-white bg-opacity-90 shadow-2xl" : "bg-white"
            }`}
          >
            <Typography variant="h4">
              <img
                src="https://perceptionandquant.com/logo2.png"
                alt="logo"
                height={50}
                width={170}
                className="ml-2"
              />
            </Typography>
            <Typography variant="h4">
              <img
                src="https://perceptionandquant.com/logo2.png"
                alt="logo"
                height={50}
                width={170}
                className="ml-2"
              />
            </Typography>
          </Box>
          <Box className="flex items-center justify-between px-2 bg-primary">
            <Typography fontSize={"0.9em"} color={"white"}>
              {clickedArticle?.headline}
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", flexWrap: "wrap", gap: 4, py: 1, px: 1 }}
            component={Paper}
          >
            <Typography className="text-primary">
              News Date:{" "}
              <span className="text-[0.9em] text-black">
                {clickedArticle?.articleDate}
              </span>
            </Typography>
            <Typography className="text-primary">
              Media Type:{" "}
              <span className="text-[0.9em] text-black">{"Online"}</span>
            </Typography>

            <Typography className="text-primary">
              Publication:{" "}
              <span className="text-[0.9em] text-black">
                {clickedArticle?.publication}
              </span>
            </Typography>
            <Typography className="text-primary" component={"div"}>
              Language:{" "}
              <span className="text-[0.9em] text-black">
                {clickedArticle?.language}
              </span>
            </Typography>
            <Typography className="text-primary">
              Author:{" "}
              <span className="text-[0.9em] text-black">
                {clickedArticle?.journalist}
              </span>
            </Typography>

            <Typography className="text-primary">
              Edition:{" "}
              <span className="text-[0.9em] text-black">Online Web</span>
            </Typography>
          </Box>

          {/* click buttons */}
          <Box component={Paper}>
            <Button>
              <Link to={clickedArticle?.url} target="_blank" rel="noreferer">
                <VisibilityIcon />
                Article View
              </Link>
            </Button>
            <Button
              onClick={() => {
                setOpenTextView(true);
                fetchAndParseContent();
              }}
            >
              <CalendarViewDayIcon />
              Text
            </Button>
          </Box>
          <Box sx={{ width: "100%", height: "100%" }}>
            <iframe
              src={clickedArticle?.url}
              frameBorder="0"
              width={"100%"}
              height={"800px"}
            />
          </Box>
        </Box>
      </Modal>
      <TextView
        open={openTextView}
        setOpen={setOpenTextView}
        content={content}
        loading={loading}
        error={error}
      />
    </div>
  );
};

ArticleView.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  clickedArticle: PropTypes.shape({
    socialFeedId: PropTypes.string,
    headline: PropTypes.string,
    articleDate: PropTypes.string,
    publication: PropTypes.string,
    language: PropTypes.string,
    journalist: PropTypes.string,
    url: PropTypes.string,
  }),
};
export default ArticleView;
