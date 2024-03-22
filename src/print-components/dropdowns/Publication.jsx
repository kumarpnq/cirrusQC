import PropTypes from "prop-types";
import { FormControl, Select, MenuItem } from "@mui/material";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";

const Publication = ({
  publicationGroup,
  publication,
  setPublication,
  classes,
  width,
}) => {
  const { data } = useFetchData(
    publicationGroup && `${url}publications/${publicationGroup}`,
    publication
  );
  const publicationGroups = data?.data?.publications || [];
  const handleChange = (e) => {
    setPublication(e.target.value);
  };

  const formControlStyle = {
    width: `${width}px`,
  };
  return (
    <FormControl style={formControlStyle}>
      <Select
        value={publication}
        onChange={handleChange}
        className={classes.dropDowns}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        sx={{ fontSize: "0.8em" }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
          <em>Publication</em>
        </MenuItem>
        {publicationGroups.map((group) => (
          <MenuItem
            key={group.publicationid}
            value={group.publicationid}
            sx={{ fontSize: "0.8em", opacity: 0.7 }}
          >
            {group.publicationname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
Publication.propTypes = {
  publicationGroup: PropTypes.string.isRequired,
  publication: PropTypes.number.isRequired,
  setPublication: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
};
export default Publication;
