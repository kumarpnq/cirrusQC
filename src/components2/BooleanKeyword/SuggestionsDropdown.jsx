import PropTypes from "prop-types";
import { Paper, List, ListItem, ListItemText, Typography } from "@mui/material";
import { styled } from "@mui/system";

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  maxHeight: "160px",
  overflowY: "auto",
  borderRadius: "8px",
  boxShadow: theme.shadows[3],
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: "8px",
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: "8px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SuggestionsDropdown = ({ suggestions, applySuggestion }) => {
  return (
    <StyledPaper elevation={3}>
      <StyledTypography variant="subtitle2">Suggestions:</StyledTypography>
      <List>
        {suggestions.map((suggestion, index) => (
          <StyledListItem
            button
            key={index}
            onClick={() => applySuggestion(suggestion)}
          >
            <ListItemText primary={suggestion} />
          </StyledListItem>
        ))}
      </List>
    </StyledPaper>
  );
};

SuggestionsDropdown.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  applySuggestion: PropTypes.func.isRequired,
};

export default SuggestionsDropdown;
