import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterComponents from "./components/FilterComponents";

const SearchFilter = () => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        Search Filters
      </AccordionSummary>
      <AccordionDetails>
        <FilterComponents />
      </AccordionDetails>
    </Accordion>
  );
};

export default SearchFilter;
