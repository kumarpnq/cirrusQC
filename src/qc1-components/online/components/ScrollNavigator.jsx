import PropTypes from "prop-types";
import {
  List,
  ListItem,
  Typography,
  Box,
  Paper,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const ScrollNavigator = ({
  selectedItems,
  setSelectedItems,
  activeArticle,
  setActiveArticle,
  setSelectionModal,
  setOpen,
}) => {
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const handleItemClick = (item) => {
    setActiveArticle(item);
  };
  const handleRemoveItem = (item, event) => {
    event.stopPropagation();
    const filteredItems = selectedItems.filter((i) => i.id !== item.id);
    if (!filteredItems.length) {
      setSelectionModal([]);
      setSelectedItems([]);
      setOpen(false);
    } else {
      setSelectedItems(filteredItems);
    }
  };
  return (
    <Box
      sx={{
        position: "relative",
        width: "300px",
        height: "250px",
        overflow: "hidden",
      }}
      component={Paper}
    >
      <StyledList>
        {selectedItems.map((item) => (
          <StyledListItem
            key={item.id}
            onClick={() => handleItemClick(item)}
            active={activeArticle && activeArticle.id === item.id}
            onMouseEnter={() => setHoveredItemId(item.id)}
            onMouseLeave={() => setHoveredItemId(null)}
          >
            {hoveredItemId === item.id && (
              <StyledIconButton
                onClick={(event) => handleRemoveItem(item, event)}
              >
                <CloseIcon />
              </StyledIconButton>
            )}

            <Typography variant="h6" fontSize={"0.9em"}>
              {item.headline}
            </Typography>
            <Typography variant="subtitle2" fontWeight={"bold"}>
              {item.publication_name}
            </Typography>
          </StyledListItem>
        ))}
      </StyledList>
    </Box>
  );
};

const StyledListItem = styled(ListItem)(({ active }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "16px",
  boxSizing: "border-box",
  border: "1px solid gray",
  margin: 1,
  borderRadius: "3px",
  cursor: "pointer",
  backgroundColor: active ? "gray" : "inherit",
  color: active ? "#fff" : "inherit",
  "&:hover": {
    backgroundColor: "gray",
    color: "#fff",
  },
}));

const StyledList = styled(List)({
  position: "relative",
  overflowY: "scroll",
  height: "100%",
  padding: 0,
  margin: 0,
  "&::-webkit-scrollbar": {
    display: "none",
  },
});

const StyledIconButton = styled(IconButton)({
  position: "absolute",
  right: 0,
  top: 0,
});

ScrollNavigator.propTypes = {
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      headline: PropTypes.string.isRequired,
      publication: PropTypes.string.isRequired,
    })
  ).isRequired,
  setSelectedItems: PropTypes.func,
  activeArticle: PropTypes.object,
  setActiveArticle: PropTypes.func.isRequired,
  setSelectionModal: PropTypes.func,
  setOpen: PropTypes.func,
};

export default ScrollNavigator;
