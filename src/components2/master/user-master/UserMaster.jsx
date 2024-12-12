import { Box, Divider } from "@mui/material";
import SearchFilters from "../SearchFilters";
import { useState } from "react";
import UserGrid from "./UserGrid";
import UserAddEditModal from "./UserAddEditModal";

const UserMaster = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // * endpoints
  let deleteEndPoint = "deleteUsers";
  let mainEndPoint = "http://127.0.0.1:8000/usersList";
  return (
    <Box>
      <SearchFilters
        handleOpen={() => setOpen((prev) => !prev)}
        loading={loading}
        setLoading={setLoading}
        endpoint={mainEndPoint}
        deleteEndPoint={deleteEndPoint}
        setFetchAfterSave={() => {}}
        selectedItems={selectedItems}
        setData={setData}
      />
      <Divider sx={{ my: 1 }} />
      <UserGrid loading={loading} data={data} />
      <UserAddEditModal
        open={open}
        handleClose={() => setOpen(false)}
        fromWhere={"Add"}
        row={null}
      />
    </Box>
  );
};

export default UserMaster;
