import {
  Box,
  Checkbox,
  CircularProgress,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import axiosInstance from "../../../../../axiosConfig";
import toast from "react-hot-toast";

const ClientScreenTable = ({ initialState, fetchData, row }) => {
  const [screens, setScreens] = useState([[]]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [toolData, setToolData] = useState([]);

  // * update status
  const [screenUpdateId, setScreenUpdateId] = useState(null);
  const permissions = initialState?.screenPermissions?.flat() || [];

  const handleCheckboxChange = (e, selectedPermission) => {
    const localButtonData =
      permissions.find((i) => i.screenId === selectedPermission.screenId)
        ?.tools || [];

    if (selectedRow?.screenId === selectedPermission.screenId) {
      setSelectedRow(null);
      setToolData([]);
    } else {
      setSelectedRow(selectedPermission);
      setToolData(localButtonData);
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
      userType: "CL",
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
      const response = await axiosInstance.put(`updateUser/`, payload);
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

  const handleToolPermissionChanges = async (tool) => {
    const updatedTool = {
      ...tool,
      permission: !tool.permission,
    };

    const updatedToolData = toolData.map((item) =>
      item.toolId === updatedTool.toolId
        ? { ...item, permission: updatedTool.permission }
        : item
    );

    setToolData(updatedToolData);

    const payload = {
      userType: "CL",
      loginName: row?.loginName,
      toolPermission: [
        {
          screenId: selectedRow.screenId,
          toolId: tool.toolId,
          permission: updatedTool.permission,
        },
      ],
    };

    try {
      const response = await axiosInstance.put(`updateUser/`, payload);
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to update screen permission");
      setToolData(toolData); // Reset tool data on error
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
        {!!toolData.length && (
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
                {toolData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ padding: "4px" }}>
                      {item.toolName}
                    </TableCell>
                    <TableCell sx={{ padding: "4px" }}>
                      <Switch
                        checked={item.permission}
                        onChange={() => handleToolPermissionChanges(item)}
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

export default ClientScreenTable;
