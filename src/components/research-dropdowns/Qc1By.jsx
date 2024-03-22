import { FormControl, Select, MenuItem, OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";

const Qc1By = ({ qcUsersData, qc1by, setQc1by, classes }) => {
  const selectedUsernamesqc1 = qcUsersData
    .filter((item) => qc1by.includes(item.usersid))
    .map((selectedItem) => selectedItem.username);
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-32">
        <Select
          input={<OutlinedInput label="tag" />}
          className={classes.dropDowns}
          value={qc1by}
          onChange={(e) => setQc1by(e.target.value)}
          multiple
          MenuProps={{ PaperProps: { style: { height: 200 } } }}
          displayEmpty
          sx={{ fontSize: "0.8em" }}
          inputProps={{ "aria-label": "Without label" }}
          renderValue={() => {
            if (selectedUsernamesqc1.length === 0) {
              return <em>Qc1 by</em>;
            }
            return selectedUsernamesqc1.join(", ");
          }}
        >
          <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
            <em>Qc1 by</em>
          </MenuItem>
          {qcUsersData &&
            qcUsersData.map((item) => (
              <MenuItem
                key={item.usersid}
                value={item.usersid}
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
};
export default Qc1By;
