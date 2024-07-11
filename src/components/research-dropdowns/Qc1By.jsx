import { FormControl, Select, MenuItem, OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";

const Qc1By = ({ qcUsersData, qc1by, setQc1by, classes, isId, title }) => {
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-32">
        <Select
          input={<OutlinedInput label="tag" />}
          className={classes.dropDowns}
          value={qc1by}
          onChange={(e) => setQc1by(e.target.value)}
          MenuProps={{ PaperProps: { style: { height: 200 } } }}
          displayEmpty
          variant="outlined"
          sx={{ fontSize: "0.8em" }}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem
            value=""
            sx={{ fontSize: "0.8em", opacity: 0.7 }}
            onClick={() => setQc1by("")}
          >
            <em>{title ? title : "Qc1 by"}</em>
          </MenuItem>
          {!!qcUsersData &&
            qcUsersData?.map((item) => (
              <MenuItem
                key={item.usersid}
                value={isId ? item.usersid : item.username}
                sx={{ fontSize: "0.8em", opacity: 0.7 }}
              >
                {item.username}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};
Qc1By.propTypes = {
  qcUsersData: PropTypes.arrayOf(
    PropTypes.shape({
      usersid: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
  qc1by: PropTypes.array.isRequired,
  setQc1by: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  isId: PropTypes.bool,
  title: PropTypes.string,
};
export default Qc1By;
