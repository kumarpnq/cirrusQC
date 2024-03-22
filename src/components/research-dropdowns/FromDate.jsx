import { FormControl, TextField } from "@mui/material";
import PropTypes from "prop-types";

const FromDate = ({ fromDate, setFromDate }) => {
  const handleFromDate = (e) => {
    const { value } = e.target;

    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        // Convert to local time before formatting
        const localDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        const formattedValue = localDate
          .toISOString()
          .slice(0, 16)
          .replace("T", " ");
        setFromDate(formattedValue);
      }
    }
  };
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl>
        <TextField
          size="small"
          type="datetime-local"
          value={fromDate}
          onChange={handleFromDate}
          variant="outlined"
          InputProps={{
            style: { fontSize: "0.8rem", height: 25, top: 6 },
          }}
        />
      </FormControl>
    </div>
  );
};
FromDate.propTypes = {
  fromDate: PropTypes.string.isRequired,
  setFromDate: PropTypes.func.isRequired,
};
export default FromDate;
