import { FormControl, TextField } from "@mui/material";
import PropTypes from "prop-types";

const ToDate = ({ dateNow, setDateNow, isMargin }) => {
  const handleToDate = (e) => {
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
        setDateNow(formattedValue);
      }
    }
  };
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl>
        <TextField
          type="datetime-local"
          value={dateNow}
          onChange={handleToDate}
          size="small"
          variant="outlined"
          InputProps={{
            style: { fontSize: "0.8rem", height: 25, top: !isMargin ? 0 : 6 },
          }}
        />
      </FormControl>
    </div>
  );
};
ToDate.propTypes = {
  dateNow: PropTypes.string.isRequired,
  setDateNow: PropTypes.func.isRequired,
  isMargin: PropTypes.bool,
};
export default ToDate;
