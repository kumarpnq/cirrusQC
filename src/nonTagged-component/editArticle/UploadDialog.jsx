import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Details from "./DetailSection";
import ArticleView from "./ArticleView";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import ClientSection from "./ClientSection";
import axios from "axios";
import { url } from "../../constants/baseUrl";
// import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "99vw",
  height: "99vh",
  overflow: "scroll",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  // p: 4,
  display: "flex",
  flexDirection: "column",
};

const UploadDialog = ({
  open,
  handleClose,
  selectedRow,
  setFetchAfterSave,
  tableData,
  setTableData,
}) => {
  const userToken = localStorage.getItem("user");
  const socialfeedId = selectedRow?.socialfeedid;
  const [fetchedHeader, setFetchedHeader] = useState(null);
  const [tableDataList, setTableDataList] = useState([]);
  const [editableTagData, setEditableTagData] = useState([]);
  const [modifiedRows, setModifiedRows] = useState([]);
  const [tableDataLoading, setTableDataLoading] = useState(false);

  const fetchData = async () => {
    try {
      setTableDataLoading(true);
      setTableDataList([]);
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };

      const [headerResponse, detailsResponse] = await Promise.all([
        axios.get(`${url}socialfeedheader?socialfeed_id=${socialfeedId}`, {
          headers,
        }),
        axios.get(`${url}socialfeedtagdetails/?socialfeed_id=${socialfeedId}`, {
          headers,
        }),
      ]);

      setFetchedHeader(headerResponse.data.socialfeed[0]);

      const data = detailsResponse.data.socialfeed_details;
      const realData = data && Object.keys(data).length > 0 ? data : [];
      setTableDataList(realData);
      setTableDataLoading(false);
    } catch (error) {
      setTableDataList([]);
      setTableDataLoading(false);
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    if (selectedRow && open) {
      fetchData();
    }
  }, [selectedRow, userToken, open]);

  const handleSecondaryClose = () => {
    setTableDataList([]);
    setEditableTagData([]);
    setModifiedRows([]);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleSecondaryClose}>
      <Box sx={style}>
        <DialogTitle
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography> Article Edit</Typography>
          <Button onClick={handleSecondaryClose}>Close</Button>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <div className="flex">
              <Details selectedRow={fetchedHeader} userToken={userToken} />
              <ArticleView selectedArticle={fetchedHeader} />
            </div>

            {/* client section */}
            <ClientSection
              selectedArticle={fetchedHeader}
              userToken={userToken}
              setFetchAfterSave={setFetchAfterSave}
              tableData={tableData}
              setTableData={setTableData}
              tableDataList={tableDataList}
              setTableDataList={setTableDataList}
              editableTagData={editableTagData}
              setEditableTagData={setEditableTagData}
              modifiedRows={modifiedRows}
              setModifiedRows={setModifiedRows}
              tableDataLoading={tableDataLoading}
              fetchData={fetchData}
            />
          </Box>
        </DialogContent>
      </Box>
    </Modal>
  );
};

UploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  setFetchAfterSave: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  tableData: PropTypes.array.isRequired,
  setTableData: PropTypes.func.isRequired,
};

export default UploadDialog;
