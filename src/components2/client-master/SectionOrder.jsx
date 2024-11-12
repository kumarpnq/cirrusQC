import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import ComponentsHeader from "./ComponentsHeader";

const sectionArray = [
  { id: 1, name: "Ikea", value: 0 },
  { id: 2, name: "Industry", value: 0 },
  { id: 3, name: "Industry2", value: 0 },
  { id: 4, name: "Competition", value: 0 },
  { id: 5, name: "Category", value: 0 },
  { id: 6, name: "Industry3", value: 0 },
  { id: 7, name: "Others", value: 0 },
];

const SectionOrder = () => {
  const [rows, setRows] = useState(sectionArray);

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

  return (
    <Box sx={{ border: "1px solid #DDD", borderRadius: "3px", mt: 1, p: 1 }}>
      <ComponentsHeader title="Sort Order" loading={false} onSave={() => {}} />
      <Box sx={{ height: 400, width: 500 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="compact"
          onProcessRowUpdate={handleProcessRowUpdate}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
    </Box>
  );
};

export default SectionOrder;
