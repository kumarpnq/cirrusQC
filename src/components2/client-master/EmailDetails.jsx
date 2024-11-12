import { useState } from "react";
import { Box, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const initialData = [
  {
    id: 1,
    email: "johndoe@example.com",
    name: "John Doe",
    phone: "1234567890",
    designation: "Manager",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    sortOrder: 1,
    active: true,
  },
  {
    id: 2,
    email: "janedoe@example.com",
    name: "Jane Doe",
    phone: "0987654321",
    designation: "Developer",
    startDate: "2023-02-01",
    endDate: "2023-11-30",
    sortOrder: 2,
    active: false,
  },
  {
    id: 3,
    email: "michaelsmith@example.com",
    name: "Michael Smith",
    phone: "1122334455",
    designation: "Designer",
    startDate: "2023-03-15",
    endDate: "2023-09-15",
    sortOrder: 3,
    active: true,
  },
  {
    id: 4,
    email: "emilyjohnson@example.com",
    name: "Emily Johnson",
    phone: "6677889900",
    designation: "HR",
    startDate: "2023-04-10",
    endDate: "2024-04-10",
    sortOrder: 4,
    active: false,
  },
  {
    id: 5,
    email: "davidmartin@example.com",
    name: "David Martin",
    phone: "4433221100",
    designation: "CTO",
    startDate: "2023-05-01",
    endDate: "2023-12-01",
    sortOrder: 5,
    active: true,
  },
  {
    id: 6,
    email: "sarahclark@example.com",
    name: "Sarah Clark",
    phone: "5566778899",
    designation: "Lead Developer",
    startDate: "2023-06-15",
    endDate: "2024-06-15",
    sortOrder: 6,
    active: false,
  },
  {
    id: 7,
    email: "charlielane@example.com",
    name: "Charlie Lane",
    phone: "9988776655",
    designation: "Data Analyst",
    startDate: "2023-07-01",
    endDate: "2023-12-01",
    sortOrder: 7,
    active: true,
  },
  {
    id: 8,
    email: "natalieadams@example.com",
    name: "Natalie Adams",
    phone: "2211334455",
    designation: "Product Manager",
    startDate: "2023-08-01",
    endDate: "2024-01-01",
    sortOrder: 8,
    active: true,
  },
  {
    id: 9,
    email: "christopherwhite@example.com",
    name: "Christopher White",
    phone: "3344556677",
    designation: "Marketing Director",
    startDate: "2023-09-01",
    endDate: "2024-09-01",
    sortOrder: 9,
    active: false,
  },
  {
    id: 10,
    email: "lucymiller@example.com",
    name: "Lucy Miller",
    phone: "4433998877",
    designation: "Sales Executive",
    startDate: "2023-10-01",
    endDate: "2024-10-01",
    sortOrder: 10,
    active: true,
  },
  {
    id: 11,
    email: "brianscott@example.com",
    name: "Brian Scott",
    phone: "5599332211",
    designation: "Accountant",
    startDate: "2023-11-01",
    endDate: "2024-11-01",
    sortOrder: 11,
    active: true,
  },
  {
    id: 12,
    email: "annaevans@example.com",
    name: "Anna Evans",
    phone: "6677993344",
    designation: "Customer Support",
    startDate: "2023-12-01",
    endDate: "2024-12-01",
    sortOrder: 12,
    active: false,
  },
  {
    id: 13,
    email: "markjones@example.com",
    name: "Mark Jones",
    phone: "7766554433",
    designation: "Software Engineer",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    sortOrder: 13,
    active: true,
  },
  {
    id: 14,
    email: "paulroberts@example.com",
    name: "Paul Roberts",
    phone: "8899776655",
    designation: "QA Engineer",
    startDate: "2024-02-01",
    endDate: "2024-07-01",
    sortOrder: 14,
    active: false,
  },
  {
    id: 15,
    email: "elizabethhall@example.com",
    name: "Elizabeth Hall",
    phone: "1234598765",
    designation: "Operations Manager",
    startDate: "2024-03-01",
    endDate: "2024-09-01",
    sortOrder: 15,
    active: true,
  },
  {
    id: 16,
    email: "williamtaylor@example.com",
    name: "William Taylor",
    phone: "4455668899",
    designation: "Chief Architect",
    startDate: "2024-04-01",
    endDate: "2024-10-01",
    sortOrder: 16,
    active: true,
  },
  {
    id: 17,
    email: "oliviacarter@example.com",
    name: "Olivia Carter",
    phone: "5566889900",
    designation: "Web Developer",
    startDate: "2024-05-01",
    endDate: "2024-12-01",
    sortOrder: 17,
    active: false,
  },
  {
    id: 18,
    email: "jamesanderson@example.com",
    name: "James Anderson",
    phone: "6677889900",
    designation: "Network Engineer",
    startDate: "2024-06-01",
    endDate: "2024-11-01",
    sortOrder: 18,
    active: true,
  },
  {
    id: 19,
    email: "sophiawilliams@example.com",
    name: "Sophia Williams",
    phone: "7788991133",
    designation: "Business Analyst",
    startDate: "2024-07-01",
    endDate: "2025-01-01",
    sortOrder: 19,
    active: true,
  },
  {
    id: 20,
    email: "danielmiller@example.com",
    name: "Daniel Miller",
    phone: "8899001122",
    designation: "Chief Financial Officer",
    startDate: "2024-08-01",
    endDate: "2024-12-31",
    sortOrder: 20,
    active: false,
  },
];

const EmailDetails = () => {
  const [rows, setRows] = useState(initialData);
  const [modifiedRows, setModifiedRows] = useState({});

  const handleEditCellChange = (params) => {
    console.log(params);

    const { id, field, value } = params;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
    setModifiedRows((prevModifiedRows) => ({
      ...prevModifiedRows,
      [id]: {
        ...prevModifiedRows[id],
        [field]: value,
      },
    }));
  };

  const columns = [
    {
      field: "email",
      headerName: "Email",
      editable: true,
      width: 500,
    },
    {
      field: "name",
      headerName: "Name",
      editable: true,
    },
    {
      field: "phone",
      headerName: "Phone",
      editable: true,
    },
    {
      field: "designation",
      headerName: "Designation",
      editable: true,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      editable: true,
      type: "date",
      valueGetter: () => new Date(),
    },
    {
      field: "endDate",
      headerName: "End Date",
      editable: true,
      type: "date",
      valueGetter: () => new Date(),
    },
    {
      field: "sortOrder",
      headerName: "Sort Order",
      editable: true,
    },
    {
      field: "active",
      headerName: "Active",
      editable: true,
      width: 200,
      renderCell: (params) => (
        <RadioGroup
          value={params.value}
          onChange={(e) => handleRadioChange(e, params)}
          row
        >
          <FormControlLabel
            value="Yes"
            control={<Radio checked={params.row.active} />}
            label="Yes"
          />
          <FormControlLabel
            value="No"
            control={<Radio checked={!params.row.active} />}
            label="No"
          />
        </RadioGroup>
      ),
    },
  ];

  const handleRadioChange = (e, params) => {
    const updatedRow = { ...params.row, active: e.target.value };
    console.log(updatedRow);
  };

  return (
    <Box sx={{ height: "80vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        disableSelectionOnClick
        density="compact"
        onCellEditCommit={handleEditCellChange}
        hideFooterSelectedRowCount
      />
    </Box>
  );
};

export default EmailDetails;
