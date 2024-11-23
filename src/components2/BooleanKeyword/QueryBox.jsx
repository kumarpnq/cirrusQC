import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import QueryTable from "./QueryTable";

const QueryBox = ({ type }) => {
  const [query, setQuery] = useState("");

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
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        multiline
        rows={4}
        placeholder="Query"
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
