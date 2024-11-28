import PropTypes from "prop-types";
import {
  List,
  ListItem,
  IconButton,
  Box,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TranslateIcon from "@mui/icons-material/Translate";
import axiosInstance from "../../../axiosConfig";
import { Fragment, useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmationDialog from "../../@core/DeleteConfirmationDialog";
import LanguageQueryModal from "./languageQueryModal";

// Styled Components
const StyledList = styled(List)({
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  width: "100%",
});

const StyledListItem = styled(ListItem)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: 1,
  border: "1px solid #e0e0e0",
  borderRadius: "8px",
  marginBottom: "8px",
  backgroundColor: "#fff",
  transition: "transform 0.6s, box-shadow 0.2s, background-color 0.2s",

  "&:hover": {
    backgroundColor: "#f5f5f5",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transform: "scale(1.01)",
  },

  "&:active": {
    backgroundColor: "#e0e0e0",
    transform: "scale(1)",
  },

  "&:last-child": {
    borderBottom: "none",
  },
});

const QueryBox = styled(Box)({
  flexGrow: 1,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  fontWeight: 500,
  color: "#333",
  marginLeft: 2,
});

const QueryList = ({
  type,
  setQuery,
  setIsEdit,
  data = [],
  queryId,
  setQueryId,
  companyId,
  row,
}) => {
  const [localQueryId, setLocalQueryId] = useState("");
  const [openDeleteQueryOpen, setOpenDeleteQueryOpen] = useState(false);
  const [filteredQueries, setFilteredQueries] = useState(data);

  useEffect(() => {
    setFilteredQueries(data || []);
  }, [data]);

  const handleClick = (localQuery, queryId) => {
    setQuery(localQuery);
    setIsEdit(true);
    setQueryId(queryId);
    setLocalQueryId(queryId);
  };

  const handleDeleteQueryOpen = (localQuery) => {
    setLocalQueryId(localQuery.queryId);
    setOpenDeleteQueryOpen((prev) => !prev);
  };

  // * delete query
  const handleDeleteQuery = async () => {
    try {
      const params = {
        companyId,
        queryId: localQueryId,
      };
      const response = await axiosInstance.delete("deleteBooleanQuery", {
        params,
      });
      if (response.status === 200) {
        toast.success(response.data.data.message);
        setOpenDeleteQueryOpen(false);
        setLocalQueryId(false);
        setFilteredQueries(
          data.filter((item) => item.queryId !== localQueryId)
        );
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  const handleCloseDelete = () => {
    setOpenDeleteQueryOpen(false);
    setLocalQueryId("");
  };

  // * translate
  const [translateLoadingId, setTranslateLoadingId] = useState("");
  const [openTranslateModal, setOpenTranslateModal] = useState(false);
  const [translatedData, setTranslatedData] = useState([]);
  const handleTranslate = async (localQuery, id) => {
    try {
      setTranslateLoadingId(id);
      const requestData = {
        languages: [
          "en",
          "hi",
          "bn",
          "mr",
          "gu",
          "kn",
          "ta",
          "te",
          "ml",
          "as",
          "mni",
          "ne",
          "or",
          "pa",
          "sa",
          "ur",
        ],
      };
      if (type === "Include Query") requestData.includeQuery = localQuery;
      if (type === "Exclude Query") requestData.excludeQuery = localQuery;
      const response = await axiosInstance.post(
        "translateBooleanQuery",
        requestData
      );
      if (response.status === 200) {
        const data = response.data.data;

        const queryArray = data
          .map((langData) => ({
            id: langData.langId,
            query: langData.query,
            langName: langData.langName,
          }))
          .filter((item) => item.query !== null && item.query !== "");
        setOpenTranslateModal((prev) => !prev);
        setTranslatedData(queryArray);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setTranslateLoadingId("");
    }
  };

  const handleCloseTranslateModal = () => {
    setOpenTranslateModal((prev) => !prev);
    setTranslateLoadingId("");
  };

  return (
    <Fragment>
      <StyledList>
        {filteredQueries.map((row) => (
          <StyledListItem
            key={row.queryId}
            sx={{
              backgroundColor: queryId === row.queryId ? "#b1f0be" : "",
            }}
          >
            {/* Action Buttons */}
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => handleDeleteQueryOpen(row)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleClick(row.query, row.queryId)}
              >
                <EditNoteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Translate">
              <IconButton
                color="primary"
                size="small"
                onClick={() => handleTranslate(row.query, row.queryId)}
              >
                {translateLoadingId === row.queryId ? (
                  <CircularProgress size={"1em"} />
                ) : (
                  <TranslateIcon />
                )}
              </IconButton>
            </Tooltip>

            {/* Query Text */}
            <Tooltip title={row.query}>
              <QueryBox>{row.query}</QueryBox>
            </Tooltip>
          </StyledListItem>
        ))}
      </StyledList>
      <DeleteConfirmationDialog
        onDelete={handleDeleteQuery}
        onClose={handleCloseDelete}
        open={openDeleteQueryOpen}
      />
      <LanguageQueryModal
        loading={translateLoadingId}
        handleClose={handleCloseTranslateModal}
        open={openTranslateModal}
        data={translatedData}
        row={row}
        type={type}
      />
    </Fragment>
  );
};

QueryList.propTypes = {
  query: PropTypes.string,
  type: PropTypes.string,
  setQuery: PropTypes.func.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      queryId: PropTypes.string.isRequired,
      query: PropTypes.string.isRequired,
    })
  ).isRequired,
  queryId: PropTypes.string,
  setQueryId: PropTypes.func.isRequired,
  companyId: PropTypes.string,
  row: PropTypes.object,
};
export default QueryList;
