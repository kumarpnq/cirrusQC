import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import QueryTable from "./QueryTable";
import { generateSuggestions, validateQuery } from "./utils";
import SuggestionsDropdown from "./SuggestionsDropdown";

const QueryBox = ({ type }) => {
  const [query, setQuery] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const handleQueryChange = (event) => {
    let localQuery = event.target.value;
    setQuery(localQuery);
    validateQuery(localQuery, setIsValid, setError);
    generateSuggestions(
      localQuery,
      event.target.selectionStart,
      setSuggestions
    );
  };

  const applySuggestion = (suggestion) => {
    const words = query.split(/\s+/);
    words.pop();
    const newQuery = [...words, suggestion].join(" ");
    setQuery(newQuery);
    setShowSuggestions(false);
    validateQuery(newQuery);
  };

  return (
    <Box sx={{ border: "1px solid #ddd", mt: 1, p: 0.5, position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "start",
          my: 0.5,
        }}
      >
        {<Typography variant="body2">{type}</Typography>}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" variant="outlined">
            Validate & Add
          </Button>
          <Button size="small" variant="outlined">
            Preview
          </Button>
        </Box>
      </Box>

      <TextField
        value={query}
        onChange={handleQueryChange}
        onFocus={() => setShowSuggestions(true)}
        fullWidth
        multiline
        rows={4}
        placeholder="Enter company boolean string (e.g., publication.name:'TheHindu' AND 'TimesNow' AND ('Breaking News' OR 'Prime Debate' OR 'Entertainment Show'))"
        error={!isValid}
        helperText={error}
      />
      <Box sx={{ position: "absolute", zIndex: 999, width: "100%" }}>
        {showSuggestions && !!suggestions.length && (
          <SuggestionsDropdown
            applySuggestion={applySuggestion}
            showSuggestions={showSuggestions}
            suggestions={suggestions}
          />
        )}
      </Box>
      <QueryTable />
    </Box>
  );
};

QueryBox.propTypes = {
  type: PropTypes.string,
};

export default QueryBox;
