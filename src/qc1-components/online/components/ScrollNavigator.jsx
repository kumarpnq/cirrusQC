import PropTypes from "prop-types";
import { List, ListItem, Typography, Box, Paper } from "@mui/material";
import { styled } from "@mui/system";

const ScrollNavigator = ({
  selectedItems,
  activeArticle,
  setActiveArticle,
}) => {
  const handleItemClick = (item) => {
    setActiveArticle(item);
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
          >
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

ScrollNavigator.propTypes = {
  selectedItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      headline: PropTypes.string.isRequired,
      publication: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeArticle: PropTypes.object,
  setActiveArticle: PropTypes.func.isRequired,
};

export default ScrollNavigator;
