import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useContext, useState } from "react";
import Button from "../components/custom/Button"; // Assuming this is the correct import for your Button component
import { url } from "../constants/baseUrl";
import { ResearchContext } from "../context/ContextProvider";
import CustomButton from "./CustomButton";

//**  third party imports
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import useProtectedRequest from "../hooks/useProtectedRequest";

const Delete = ({
  open,
  setOpen,
  selectedArticles,
  setSelectedArticles,
  qc2PrintTableData,
  setQc2PrintTableData,
}) => {
  const [password, setPassword] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const userToken = localStorage.getItem("user");
  const { loading, error, data, makeRequest } = useProtectedRequest(
    userToken,
    "updatearticletagdetails/"
  );
  const requestData = selectedArticles.map((item) => ({
    UPDATETYPE: "D",
    ARTICLEID: item.article_id,
    COMPANYID: item.company_id,
  }));

  const userVerification = async () => {
    try {
      setVerificationLoading(true);
      const headers = { Authorization: `Bearer ${userToken}` };
      const data = { password };
      const response = await axios.post(`${url}isValidUser/`, data, {
        headers,
      });
      setVerificationLoading(false);
      return response.data.valid_user;
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleDelete = async () => {
    const isValid = await userVerification();
    isValid && (await makeRequest(requestData));
    if (!isValid) {
      return toast.error("Password not match with records");
    }

    if (error) {
      toast.error("An error occurred while deleting the articles.");
    } else {
      const updatedQc2PrintTableData = qc2PrintTableData.filter((article) => {
        // Check if the current article exists in selectedArticles based on both company_id and article_id
        const exists = selectedArticles.some(
          (selectedArticle) =>
            selectedArticle.article_id === article.article_id &&
            selectedArticle.company_id === article.company_id
        );
        // If exists, filter it out
        return !exists;
      });
      toast.success("Article deleted successfully.");
      setOpen(false);
      setPassword("");
      setSelectedArticles([]);
      // setFetchAfterSave(true);
      setQc2PrintTableData(updatedQc2PrintTableData);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle fontSize={"1em"}>
        Enter Password For Confirmation.
      </DialogTitle>
      <DialogContent>
        <TextField
          type="password"
          sx={{ outline: "none" }}
          size="small"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button btnText="Cancel" onClick={handleClose} />
        {verificationLoading ? (
          <CircularProgress />
        ) : (
          <CustomButton
            btnText="Delete"
            onClick={handleDelete}
            bg={"bg-red-500"}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

Delete.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  selectedArticles: PropTypes.array.isRequired,
  setSelectedArticles: PropTypes.array.isRequired,
  qc2PrintTableData: PropTypes.array.isRequired,
  setQc2PrintTableData: PropTypes.func.isRequired,
};

export default Delete;
