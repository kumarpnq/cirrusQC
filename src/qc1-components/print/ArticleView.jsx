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
import { Link } from "react-router-dom";
import TextView from "./components/TextView";

const ArticleView = ({ open, setOpen, clickedArticle }) => {
  const [scrolled, setScrolled] = useState(false);
  const handleClose = () => setOpen(false);
  const [articleData, setArticleData] = useState(null);
  const [openTextView, setOpenTextView] = useState(false);

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
                {articleData?.media || "18-jul-2032"}
              </span>
            </Typography>
            <Typography className="text-primary">
              Media Type:{" "}
              <span className="text-[0.9em] text-black">
                {articleData?.media || "Mera Media"}
              </span>
            </Typography>

            <Typography className="text-primary">
              Publication:{" "}
              <span className="text-[0.9em] text-black">
                {articleData?.publication_name || "Mera publication"}
              </span>
            </Typography>
            <Typography className="text-primary" component={"div"}>
              Language:{" "}
              <span className="text-[0.9em] text-black">
                {articleData?.language || "Hebrew"}
              </span>
            </Typography>
            <Typography className="text-primary">
              Author:{" "}
              <span className="text-[0.9em] text-black">
                {articleData?.page_number || "Sidd S"}
              </span>
            </Typography>

            <Typography className="text-primary">
              Edition:{" "}
              <span className="text-[0.9em] text-black">
                {articleData?.publication_name || "Last Edition"}
              </span>
            </Typography>
          </Box>

          {/* click buttons */}
          <Box component={Paper}>
            <Button>
              <Link
                to={
                  "https://mui.com/material-ui/material-icons/?query=vi&selected=CalendarViewDay"
                }
                target="_blank"
                rel="noreferer"
              >
                <VisibilityIcon />
                Article View
              </Link>
            </Button>
            <Button onClick={() => setOpenTextView(true)}>
              <CalendarViewDayIcon />
              Text
            </Button>
          </Box>
        </Box>
      </Modal>
      <TextView open={openTextView} setOpen={setOpenTextView} />
    </div>
  );
};

export default ArticleView;
