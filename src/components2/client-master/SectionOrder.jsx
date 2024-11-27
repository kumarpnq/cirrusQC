import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import ComponentsHeader from "./ComponentsHeader";
import axiosInstance from "../../../axiosConfig";

const sectionArray = [
  { id: 1, name: "Ikea", value: 0 },
  { id: 2, name: "Industry", value: 0 },
  { id: 3, name: "Industry2", value: 0 },
  { id: 4, name: "Competition", value: 0 },
  { id: 5, name: "Category", value: 0 },
  { id: 6, name: "Industry3", value: 0 },
  { id: 7, name: "Others", value: 0 },
];

const SectionOrder = ({ clientId }) => {
  const [rows, setRows] = useState(sectionArray);
  const [loading, setLoading] = useState(false);

  const handleProcessRowUpdate = (newRow) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    setRows(updatedRows);
    return newRow;
  };

  const columns = [
    {
      field: "name",
      headerName: "Section Name",
      width: 200,
      editable: true,
    },
    {
      field: "value",
      headerName: "Sort Order",
      width: 150,
      editable: true,
    },
  ];

  useEffect(() => {
    const fetchSectionDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `sectionOrder/?clientId=${clientId}`
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (clientId) {
      fetchSectionDetails();
    }
  }, [clientId]);

  return (
    <Box sx={{ border: "1px solid #DDD", borderRadius: "3px", mt: 1, p: 1 }}>
      <ComponentsHeader title="Sort Order" loading={false} onSave={() => {}} />
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="compact"
          loading={loading}
          onProcessRowUpdate={handleProcessRowUpdate}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
    </Box>
  );
};

export default SectionOrder;
