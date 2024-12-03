import { Box } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import ComponentsHeader from "./ComponentsHeader";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const SectionOrder = ({ clientId }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiRef = useGridApiRef();

  const handleProcessRowUpdate = (newRow) => {
    const updatedRows = rows.map((row) =>
      row.id === newRow.id ? { ...row, ...newRow } : row
    );
    setRows(updatedRows);
    return newRow;
  };

  const columns = [
    {
      field: "mailSection",
      headerName: "Section Name",
      width: 200,
      editable: true,
    },
    {
      field: "sortOrder",
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
        const data = response.data.data.data || [];
        const mappedData = data.map((item) => ({
          id: item.mailSectionId,
          ...item,
        }));
        setRows(mappedData || []);
      } catch (error) {
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    if (clientId) {
      fetchSectionDetails();
    }
  }, [clientId]);

  const [hasUnsavedRows, setHasUnsavedRows] = useState(false);
  const unsavedChangesRef = useRef({
    unsavedRows: {},
    rowsBeforeChange: {},
  });

  const processRowUpdate = useCallback((newRow, oldRow) => {
    const rowId = newRow.id;

    unsavedChangesRef.current.unsavedRows[rowId] = newRow;

    if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
      unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow;
    }

    setHasUnsavedRows(true);

    return newRow;
  }, []);

  const handleUpdate = async () => {
    try {
      const changedRows = Object.values(unsavedChangesRef.current.unsavedRows);

      if (changedRows.length === 0) {
        console.log("No changes to save.");
        return;
      }

      const requestData = {
        clientId,
        sections: changedRows.map((row) => ({
          mailSectionId: row.id,
          mailSection: row.mailSection,
          sortOrder: row.sortOrder,
        })),
      };

      const response = await axiosInstance.post(
        "updateSectionOrder/",
        requestData
      );

      if (response.status === 200) {
        unsavedChangesRef.current.unsavedRows = {};
        unsavedChangesRef.current.rowsBeforeChange = {};
        setHasUnsavedRows(false);
        toast.success(response.data.data.message);
      }
    } catch (error) {
      console.log("Error updating section order:", error);
    }
  };

  // * highlight edit rows
  const getRowClassName = (params) => {
    return unsavedChangesRef.current.unsavedRows[params.row.id]
      ? "highlight-row"
      : "";
  };

  // *

  return (
    <Box
      sx={{
        border: "1px solid #DDD",
        borderRadius: "3px",
        mt: 1,
        p: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box width={500}>
        <ComponentsHeader
          title="Sort Order"
          loading={false}
          onSave={handleUpdate}
        />
      </Box>

      <Box sx={{ height: 400, width: 500 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          density="compact"
          loading={loading}
          apiRef={apiRef}
          processRowUpdate={processRowUpdate}
          getRowClassName={getRowClassName}
          onProcessRowUpdate={handleProcessRowUpdate}
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
        />
      </Box>
    </Box>
  );
};

SectionOrder.propTypes = {
  clientId: PropTypes.string.isRequired,
};
export default SectionOrder;
