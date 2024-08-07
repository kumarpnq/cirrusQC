import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterComponents from "./components/FilterComponents";

const SearchFilter = ({
  setTableData,
  setTableLoading,
  tableLoading,
  fetchAfterGroup,
  setFetchAfterGroup,
}) => {
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
        <FilterComponents
          setTableData={setTableData}
          setTableLoading={setTableLoading}
          tableLoading={tableLoading}
          fetchAfterGroup={fetchAfterGroup}
          setFetchAfterGroup={setFetchAfterGroup}
        />
      </AccordionDetails>
    </Accordion>
  );
};

SearchFilter.propTypes = {
  setTableData: PropTypes.func.isRequired,
  setTableLoading: PropTypes.func.isRequired,
  tableLoading: PropTypes.bool.isRequired,
  fetchAfterGroup: PropTypes.bool,
  setFetchAfterGroup: PropTypes.func,
};
export default SearchFilter;
