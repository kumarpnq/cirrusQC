import { useState, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import { TextField, Switch, Box, Typography } from "@mui/material";
import useFetchData from "../../../../hooks/useFetchData";
import { url } from "../../../../constants/baseUrl";

const AddClients = ({
  row,
  modifiedClients,
  setModifiedClients,
  initialState,
}) => {
  const { data } = useFetchData(`${url}clientlist/`);
  const clientData = data?.data?.clients || [];
  const activeClientPermissions = initialState?.clientPermissions || [];

  // Mapping activeClientPermissions to clientData for initial state
  const initialClients = clientData.map((client) => {
    // Find the permission for each client in activeClientPermissions
    const permission = activeClientPermissions[0].find(
      (permission) => permission.clientId === client.clientid
    );

    return {
      id: client.clientid,
      clientName: client.clientname,
      sortOrder: permission?.sortOrder || 0, // Use the sortOrder from active permissions if exists
      active: permission?.isActive === "Y", // Set active based on permission (assuming 'Y' means active)
    };
  });

  const [clients, setClients] = useState(initialClients);

  useEffect(() => {
    if (clientData.length > 0) {
      const sortedClients = initialClients.sort((a, b) => b.active - a.active); // Sorting clients by active status
      setClients(sortedClients);
    }
  }, [clientData, activeClientPermissions]);

  // Function to track changes
  const handleClientChange = (id, field, value) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === id ? { ...client, [field]: value } : client
      )
    );

    setModifiedClients((prevModified) => {
      const existingClient = prevModified.find((client) => client.id === id);

      if (existingClient) {
        return prevModified.map((client) =>
          client.id === id ? { ...client, [field]: value } : client
        );
      } else {
        const originalClient = clients.find((client) => client.id === id);
        return [...prevModified, { ...originalClient, [field]: value }];
      }
    });
  };

  return (
    <Box sx={{ width: "100%", height: "400px" }}>
      <Virtuoso
        data={clients}
        itemContent={(index, client) => (
          <Box
            key={client.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px",
              height: "40px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {/* Client Name */}
            <Box sx={{ width: "30%" }}>
              <Typography variant="body2">{client.clientName}</Typography>
            </Box>

            {/* Sort Order Input */}
            <Box sx={{ width: "30%" }}>
              <TextField
                type="number"
                fullWidth
                size="small"
                variant="outlined"
                value={client.sortOrder}
                onChange={(e) =>
                  handleClientChange(client.id, "sortOrder", e.target.value)
                }
                inputProps={{ style: { padding: "6px 8px" } }}
              />
            </Box>

            {/* Active Switch */}
            <Box sx={{ width: "30%" }}>
              <Switch
                size="small"
                checked={client.active}
                onChange={(e) =>
                  handleClientChange(client.id, "active", e.target.checked)
                }
              />
            </Box>
          </Box>
        )}
        style={{ height: "100%" }}
      />
    </Box>
  );
};

export default AddClients;
