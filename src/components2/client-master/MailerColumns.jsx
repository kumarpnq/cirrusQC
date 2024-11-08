import { useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  FormGroup,
} from "@mui/material";
import { styled } from "@mui/system";

// Styled component for each checkbox item
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  width: "100%",
  margin: 0,
  padding: "8px 0",
  borderBottom: "1px solid #ddd",
  "&:last-child": {
    borderBottom: "none",
  },
}));

// Sample data for Mailer Columns
const mailerColumnsData = [
  { id: 1, name: "ArticleDate", checked: true },
  { id: 2, name: "Headlines", checked: true },
  { id: 3, name: "Publication", checked: false },
  { id: 4, name: "Edition", checked: false },
  { id: 5, name: "Journalist", checked: false },
  { id: 6, name: "PageNo", checked: false },
  { id: 7, name: "Space", checked: false },
  { id: 8, name: "PDF", checked: false },
  { id: 9, name: "HTML", checked: false },
  { id: 10, name: "JPG", checked: false },
];

const MailerColumns = () => {
  const [mailerColumns, setMailerColumns] = useState(mailerColumnsData);

  // Handle checkbox changes
  const handleCheckboxChange = (id) => {
    setMailerColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === id ? { ...col, checked: !col.checked } : col
      )
    );
  };

  return (
    <Box p={2} border="1px solid #ddd" borderRadius="4px">
      <Typography variant="h6" gutterBottom color="#0a4f7d">
        Mailer Columns:
      </Typography>
      <FormGroup>
        {mailerColumns.map((column) => (
          <StyledFormControlLabel
            key={column.id}
            control={
              <Checkbox
                checked={column.checked}
                onChange={() => handleCheckboxChange(column.id)}
                color="primary"
              />
            }
            label={column.name}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default MailerColumns;
