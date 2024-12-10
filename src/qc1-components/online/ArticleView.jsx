import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import {
  Card,
  CircularProgress,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import PropTypes from "prop-types";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import BlurLinearIcon from "@mui/icons-material/BlurLinear";
import ImageCarousel from "../../unprotected-components/Carousel";
import axios from "axios";
import { url } from "../../constants/baseUrl";

const style = {
  width: "100vw",
  height: "95vh",
  backgroundColor: "white",
  outline: "none",
  overflow: "scroll",
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ArticleView = ({ open, setOpen, handleClose, id }) => {
  const [articleData, setArticleData] = useState(null);
  const [fetchArticleLoading, setFetchArticleLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [multipleImages, setMultipleImages] = useState([]);
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIframeLoading(true);
  };
  const tabValue = (type) => {
    let value;
    if (type === "jpg") {
      value = 0;
    } else if (type === "htm") {
      value = 1;
    } else if (type === "pdf") {
      value = 2;
    }
    return value;
  };
  useEffect(() => {
    const getArticleHeader = async () => {
      setFetchArticleLoading(true);
      try {
        const response = await axios.get(`${url}articleview/`, {
          params: {
            article_code: id,
          },
        });

        if (response.status === 200) {
          setArticleData(response.data);
          const type = tabValue(response.data.default_type);
          setValue(type);
        } else {
          console.error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetchArticleLoading(false);
      }
    };

    getArticleHeader();
  }, [id]);

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

  useEffect(() => {
    document.title = articleData
      ? articleData?.headlines
      : "Perception & Quant";
  }, [articleData]);
  const handlePrint = () => {
    window.print();
  };
  const handleThumbnail = async () => {
    try {
      // Assuming the framePath is the URL of the current frame
      const response = await axios.get(framePath, {
        responseType: "blob", // Set the response type to blob
      });
      const blob = new Blob([response.data], { type: "application/pdf" }); // Assuming the frame content is a PDF
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "thumbnail.pdf"; // Set the file name for the thumbnail
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating thumbnail:", error);
    }
  };

  useEffect(() => {
    const fetchData = async (url, callback, type) => {
      try {
        const response = await axios.get(url);
        if (type === 0) {
          callback(response.data.imageUrls);
        } else {
          callback(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (value === 3 && articleData?.TXTPATH) {
      fetchData(articleData.TXTPATH, setTextContent, 3);
    }

    if (value === 0 && articleData?.JPGPATH) {
      fetchData(articleData.JPGPATH, setMultipleImages, 0);
    }
  }, [value, articleData]);

  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  const framePath =
    (value === 0 && articleData?.JPGPATH) ||
    (value === 1 && articleData?.HTMLPATH) ||
    (value === 2 && articleData?.PDFPATH) ||
    (value === 3 && articleData?.TXTPATH);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="article-view-modal"
        aria-describedby="article-view-content"
      >
        <Box sx={style}>
          <Typography component={"div"} className="flex justify-end">
            <IconButton onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Typography>
          <>
            {/* header part */}
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
            {/* mid information section */}
            <Card
              sx={{
                //   width: "100vw",
                mt: 1,
              }}
            >
              <Box className="flex items-center justify-between px-2 bg-primary">
                <Typography fontSize={"0.9em"} color={"white"}>
                  {articleData?.headlines}
                </Typography>
                <Typography fontSize={"0.9em"} color={"white"}>
                  {articleData?.article_date}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 4,
                  py: 1,
                  px: 1,
                }}
              >
                <Typography className="text-primary">
                  Media Type:{" "}
                  <span className="text-[0.9em] text-black">
                    {articleData?.media}
                  </span>
                </Typography>
                <Typography className="text-primary">
                  Publication Type:{" "}
                  <span className="text-[0.9em] text-black">
                    {articleData?.publication_type}
                  </span>
                </Typography>
                <Typography className="text-primary">
                  Publication:{" "}
                  <span className="text-[0.9em] text-black">
                    {articleData?.publication_name}
                  </span>
                </Typography>
                <Typography className="text-primary" component={"div"}>
                  Language:{" "}
                  <span className="text-[0.9em] text-black">
                    {articleData?.language}
                  </span>
                </Typography>
                <Typography className="text-primary">
                  Page Number:{" "}
                  <span className="text-[0.9em] text-black">
                    {articleData?.page_number}
                  </span>
                </Typography>
                <Typography className="text-primary">
                  Size:{" "}
                  <span className="text-[0.9em] text-black">
                    {" "}
                    {articleData?.space}
                  </span>
                </Typography>
                <Typography className="text-primary">
                  Circulation:{" "}
                  <span className="text-[0.9em] text-black">
                    {articleData?.circulation}
                  </span>
                </Typography>
                <Typography className="text-primary">
                  Edition:{" "}
                  <span className="text-[0.9em] text-black">
                    {articleData?.publication_name}
                  </span>
                </Typography>
              </Box>
            </Card>
            <Card className="flex items-center justify-between px-3 mt-1">
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                }}
              >
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="type tabs"
                >
                  <Tab label="IMAGE" {...a11yProps(0)} />
                  <Tab label="HTML" {...a11yProps(1)} />
                  <Tab label="PDF" {...a11yProps(2)} />
                  <Tab label="TEXT" {...a11yProps(3)} />
                </Tabs>
              </Box>
              {/* handling multiple images */}

              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="print">
                  <IconButton onClick={handlePrint}>
                    <LocalPrintshopIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="thumbnail">
                  <IconButton onClick={handleThumbnail}>
                    <BlurLinearIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Card>
            <Card className="flex items-center justify-center mt-1 border">
              {fetchArticleLoading ? (
                <CircularProgress />
              ) : value === 3 ? (
                <div
                  style={{
                    minHeight: "800px",
                    backgroundColor: "white",
                    color: "black",
                    padding: "16px",
                  }}
                >
                  {textContent ? (
                    <pre
                      style={{
                        minHeight: "800px",
                        backgroundColor: "white",
                        color: "black",
                        padding: "16px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {textContent}
                    </pre>
                  ) : (
                    <CircularProgress />
                  )}
                </div>
              ) : value === 0 && articleData?.JPGPATH ? (
                <ImageCarousel images={multipleImages} />
              ) : (
                <>
                  {iframeLoading && (
                    <div className="flex items-center justify-center h-full">
                      <CircularProgress />
                    </div>
                  )}
                  <iframe
                    src={
                      value === 1
                        ? articleData?.HTMLPATH
                        : value === 2
                        ? articleData?.PDFPATH
                        : ""
                    }
                    onLoad={handleIframeLoad}
                    frameBorder="0"
                    style={{
                      width: "100%",
                      minHeight: "800px",
                      display: iframeLoading ? "none" : "block",
                    }}
                  />
                </>
              )}
            </Card>
          </>
        </Box>
      </Modal>
    </div>
  );
};

export default ArticleView;
