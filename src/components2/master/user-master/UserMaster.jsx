import { Box, Divider } from "@mui/material";
import SearchFilters from "../SearchFilters";
import { useState } from "react";
import UserGrid from "./UserGrid";
import UserAddEditModal from "./UserAddEditModal";

const UserMaster = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box>
      <SearchFilters handleOpen={() => setOpen((prev) => !prev)} />
      <Divider sx={{ my: 1 }} />
      <UserGrid />
      <UserAddEditModal open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
};

export default UserMaster;
