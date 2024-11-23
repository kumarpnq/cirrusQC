import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import QueryTable from "./QueryTable";
import { validateQuery } from "./utils";

const QueryBox = ({ type }) => {
  const [query, setQuery] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  console.log(isValid, error);

  const handleQueryChange = (event) => {
    let localQuery = event.target.value;
    setQuery(localQuery);
    validateQuery(localQuery, setIsValid, setError);
  };

  return (
    <Box sx={{ border: "1px solid #ddd", mt: 1, p: 0.5 }}>
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
        fullWidth
        multiline
        rows={4}
        placeholder={`Enter company boolean string (e.g., publication.name:"TheHindu" AND "&TV" AND ("भाबीजी घर पर हैं" OR "हप्पू की उल्टान पलटन" OR "एक महानायक - डॉ. बी.आर. आंबेडकर" OR "दुसरी माँ")`}
      />
      <QueryTable />
    </Box>
  );
};

QueryBox.propTypes = {
  isSplit: PropTypes.bool,
  type: PropTypes.string,
};

export default QueryBox;
