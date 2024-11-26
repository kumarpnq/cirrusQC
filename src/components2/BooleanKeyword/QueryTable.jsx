import PropTypes from "prop-types";
import { List, ListItem, IconButton, Box, Tooltip } from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TranslateIcon from "@mui/icons-material/Translate";
import axiosInstance from "../../../axiosConfig";
import { Fragment, useState } from "react";
import toast from "react-hot-toast";
import DeleteConfirmationDialog from "../../@core/DeleteConfirmationDialog";

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
  setQuery,
  setIsEdit,
  data = [],
  setQueryId,
  companyId,
}) => {
  const [localQueryId, setLocalQueryId] = useState("");
  const [openDeleteQueryOpen, setOpenDeleteQueryOpen] = useState(false);
  const [filteredQueries, setFilteredQueries] = useState(data);

  const handleTranslate = async () => {
    try {
      const params = {
        query: "",
        languages: "hn,mr",
      };
      const response = await axiosInstance.get("translateBoolean", { params });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (query, queryId) => {
    setQuery(query);
    setIsEdit(true);
    setQueryId(queryId);
  };

  const handleDeleteQueryOpen = (query) => {
    setLocalQueryId(query.queryId);
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
  return (
    <Fragment>
      <StyledList>
        {filteredQueries.map((row) => (
          <StyledListItem key={row.queryId}>
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
                onClick={handleTranslate}
              >
                <TranslateIcon />
              </IconButton>
            </Tooltip>

            {/* Query Text */}
            <QueryBox>{row.query}</QueryBox>
          </StyledListItem>
        ))}
      </StyledList>
      <DeleteConfirmationDialog
        onDelete={handleDeleteQuery}
        onClose={handleCloseDelete}
        open={openDeleteQueryOpen}
      />
    </Fragment>
  );
};

QueryList.propTypes = {
  setQuery: PropTypes.func.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      queryId: PropTypes.string.isRequired,
      query: PropTypes.string.isRequired,
    })
  ).isRequired,
  setQueryId: PropTypes.func.isRequired,
  companyId: PropTypes.string,
};
export default QueryList;
