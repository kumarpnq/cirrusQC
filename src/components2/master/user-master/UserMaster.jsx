import { Box, Divider } from "@mui/material";
import SearchFilters from "../SearchFilters";
import { useEffect, useState } from "react";
import UserGrid from "./UserGrid";
import UserAddEditModal from "./UserAddEditModal";
import axiosInstance from "../../../../axiosConfig";
import toast from "react-hot-toast";

const UserMaster = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance(`http://127.0.0.1:8000/usersList`);
        setData(response.data || []);
      } catch (error) {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  return (
    <Box>
      <SearchFilters handleOpen={() => setOpen((prev) => !prev)} />
      <Divider sx={{ my: 1 }} />
      <UserGrid loading={loading} data={data} />
      <UserAddEditModal open={open} handleClose={() => setOpen(false)} />
    </Box>
  );
};

export default UserMaster;
