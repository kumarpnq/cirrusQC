import {
  Box,
  Typography,
  List,
  ListItem,
  Paper,
  IconButton,
} from "@mui/material";
import { GridCloseIcon } from "@mui/x-data-grid";

// Data for query rules and examples
const queryRules = [
  { label: "Field search", description: 'field:value or field:"exact phrase"' },
  { label: "Boolean", description: "AND, OR, NOT (uppercase) or &&, ||, !" },
  { label: "Grouping", description: "(term1 OR term2) AND term3" },
  { label: "Required/Prohibited", description: "+required -prohibited" },
  { label: "Wildcards", description: "test* te?t *test" },
  { label: "Fuzzy matching", description: "term~2" },
  { label: "Proximity search", description: '"phrase search"~5' },
  { label: "Ranges", description: "[1 TO 5], {1 TO 5}, [1 TO *], etc." },
  { label: "Boosting", description: "term^2 or (term1 OR term2)^3" },
  { label: "Regular expressions", description: "/[mb]oat/" },
  { label: "Reserved fields", description: "_exists_, _missing_, etc." },
  { label: "Escaping special chars", description: "\\+, \\-, \\/, etc." },
];

const exampleQueries = [
  {
    query: 'title:"Tata Groups" AND text:development^2',
    description: "Search in title with boosted category",
  },
  {
    query: "created:[2023-01-01 TO 2023-12-31] AND status:(active OR pending)",
    description: "Date range with status filter",
  },
  {
    query: 'text:"Ratan Tata"~2 AND tags:*Air India*',
    description: "Fuzzy match with wildcard",
  },
];

// Single component combining both sections
const QueryComponent = ({ handleClose }) => {
  return (
    <Box sx={{ maxWidth: "700px", mx: "auto", p: 2 }}>
      {/* Query Rules Section */}
      <Typography variant="div" sx={{ mb: 0.5, textAlign: "end" }}>
        <IconButton color="primary" onClick={handleClose}>
          <GridCloseIcon />
        </IconButton>
      </Typography>
      <Box
        sx={{
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          mb: 4,
          p: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          fontSize="1.2em"
          color="primary"
          textAlign="center"
        >
          Elasticsearch Query String Syntax
        </Typography>
        <List sx={{ pl: 2, color: "text.secondary", fontSize: "0.95rem" }}>
          {queryRules.map((rule, index) => (
            <ListItem key={index} sx={{ display: "list-item", pl: 2 }}>
              <strong>{rule.label}:</strong> {rule.description}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Example Queries Section */}
      <Paper
        sx={{
          p: 2,
          borderRadius: "8px",
          backgroundColor: "#f3f4f6",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
          fontSize="1.2em"
          color="primary"
          textAlign="center"
        >
          Example Queries:
        </Typography>
        <Box
          sx={{
            typography: "body2",
            "& code": {
              px: 1,
              py: 0.5,
              backgroundColor: "#e0e7ff",
              borderRadius: "4px",
              fontWeight: "bold",
            },
          }}
        >
          {exampleQueries.map((example, index) => (
            <Box key={index} mb={2}>
              <code>{example.query}</code>
              <Typography
                component="span"
                sx={{ ml: 2, color: "text.secondary" }}
              >
                - {example.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default QueryComponent;
