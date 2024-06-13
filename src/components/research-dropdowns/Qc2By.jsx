import { FormControl, Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

const Qc2By = ({ qcUsersData, classes, qc2by, setQc2by, pageType }) => {
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-32">
        <Select
          className={classes.dropDowns}
          value={qc2by}
          onChange={(e) => setQc2by(e.target.value)}
          MenuProps={{ PaperProps: { style: { height: 200 } } }}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
          sx={{ fontSize: "0.8em" }}
        >
          <MenuItem
            value=""
            sx={{ fontSize: "0.8em", opacity: 0.7 }}
            onClick={() => setQc2by("")}
          >
            <em>Qc2 by</em>
          </MenuItem>
          {qcUsersData &&
            qcUsersData?.map((items) => (
              <MenuItem
                key={items.usersid}
                value={items.username}
                sx={{ fontSize: "0.8em", opacity: 0.7 }}
              >
                {items.username}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};
Qc2By.propTypes = {
  qcUsersData: PropTypes.arrayOf(
    PropTypes.shape({
      usersid: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
  classes: PropTypes.object.isRequired,
  qc2by: PropTypes.array.isRequired,
  setQc2by: PropTypes.func.isRequired,
  pageType: PropTypes.string,
};
export default Qc2By;
