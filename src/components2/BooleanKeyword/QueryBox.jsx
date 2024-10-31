import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import QueryTable from "./QueryTable";

const QueryBox = ({ isSplit, type }) => {
  const [query, setQuery] = useState("");

  return (
    <Box>
      <Box
        sx={{
          display: !isSplit ? "flex" : "block",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: !isSplit ? "start" : "end",
          my: 0.5,
        }}
      >
        {!isSplit && <Typography variant="body2">{type}</Typography>}
        <Button size="small" variant="outlined">
          Validate & Add
        </Button>
      </Box>

      <TextField
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        multiline
        rows={5}
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
