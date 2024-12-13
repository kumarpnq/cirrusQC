import {
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Checkbox,
  Switch,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import axiosInstance from "../../../../../axiosConfig";
import toast from "react-hot-toast";
import { SignalCellularNull } from "@mui/icons-material";

const AdminScreenTable = ({ initialState, row, fetchData }) => {
  const [screens, setScreens] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [buttonData, setButtonData] = useState([]);

  // * update status
  const [screenUpdateId, setScreenUpdateId] = useState(null);

  const permissions = initialState?.screenPermissions?.flat() || [];

  useEffect(() => {
    const fetchAdminScreens = async () => {
      try {
        const response = await axiosInstance.get(`getAdminHubScreens/`);
        setScreens(response.data.screens || []);
      } catch (error) {
        toast.error("Something went wrong");
      }
    };
    fetchAdminScreens();
  }, []);

  const handleCheckboxChange = (e, selectedPermission) => {
    const localButtonData =
      permissions.find((i) => i.screenId === selectedPermission.screenId)
        ?.buttons || [];

    if (selectedRow?.screenId === selectedPermission.screenId) {
      setSelectedRow(null);
      setButtonData([]);
    } else {
      setSelectedRow(selectedPermission);
      setButtonData(localButtonData);
    }
  };

  const handlePermissionChange = async (permission) => {
    const updatedPermission = {
      ...permission,
      permission: permission.permission,
    };

    const updatedPermissions = permissions.map((perm) =>
      perm.screenId === permission.screenId
        ? { ...perm, permission: updatedPermission.permission }
        : perm
    );

    setScreens(updatedPermissions);

    const payload = {
      loginName: row?.loginName,
      screenPermission: [
        {
          screenId: permission.screenId,
          permission: !updatedPermission.permission,
        },
      ],
    };

    try {
      setScreenUpdateId(permission.screenId);
      const response = await axiosInstance.put(
        `http://127.0.0.1:8000/updateUser/`,
        payload
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update screen permission");
      setScreens(permissions);
    } finally {
      setScreenUpdateId(null);
    }
  };

  const handleButtonPermissionChange = async (button) => {
    const updatedButton = {
      ...button,
      permission: !button.permission,
    };

    const updatedButtonData = buttonData.map((btn) =>
      btn.buttonId === button.buttonId
        ? { ...btn, permission: updatedButton.permission }
        : btn
    );

    setButtonData(updatedButtonData);

    const payload = {
      loginName: row?.loginName,
      buttonPermission: [
        {
          screenId: selectedRow.screenId,

          buttonId: button.buttonId,
          permission: !button.permission,
        },
      ],
    };

    try {
      const response = await axiosInstance.put(
        `http://127.0.0.1:8000/updateUser/`,
        payload
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update button permission");
      setButtonData(buttonData);
    }
  };

  return (
    <Fragment>
      <Typography variant="caption" textAlign="end">
        *Changes will be saved automatically.
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TableContainer
          sx={{ height: 400, overflowY: "scroll", borderRadius: "3px" }}
        >
          <Table size="small">
            <TableHead sx={{ position: "sticky", top: 0, zIndex: 1 }}>
              <TableRow>
                <TableCell sx={{ padding: "4px" }}>Select</TableCell>
                <TableCell sx={{ padding: "4px" }}>Screen</TableCell>
                <TableCell sx={{ padding: "4px" }}>Permission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permission, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: "4px" }}>
                    <Checkbox
                      checked={selectedRow?.screenId === permission.screenId}
                      onChange={(e) => handleCheckboxChange(e, permission)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px" }}>
                    {permission?.screenName}
                  </TableCell>
                  <TableCell sx={{ padding: "4px" }}>
                    {screenUpdateId === permission.screenId ? (
                      <CircularProgress size={"1em"} />
                    ) : (
                      <Switch
                        checked={permission?.permission}
                        onChange={() => handlePermissionChange(permission)}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {!!buttonData.length && (
          <TableContainer
            sx={{ height: 400, overflowY: "scroll", borderRadius: "3px" }}
          >
            <Table size="small">
              <TableHead sx={{ position: "sticky", top: 0, zIndex: 1 }}>
                <TableRow>
                  <TableCell sx={{ padding: "4px" }}>Button</TableCell>
                  <TableCell sx={{ padding: "4px" }}>Permission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {buttonData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ padding: "4px" }}>
                      {item.buttonName}
                    </TableCell>
                    <TableCell sx={{ padding: "4px" }}>
                      <Switch
                        checked={item.permission}
                        onChange={() => handleButtonPermissionChange(item)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Fragment>
  );
};

export default AdminScreenTable;
