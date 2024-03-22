import PropTypes from "prop-types";
import { FormControl, Select, MenuItem } from "@mui/material";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";

const PublicationGroup = ({
  publicationGroup,
  setPublicationGroup,
  classes,
  width,
}) => {
  const { data } = useFetchData(`${url}publicationgroups/`, publicationGroup);
  const publicationGroups = data?.data?.publication_groups || [];
  const handleChange = (e) => {
    setPublicationGroup(e.target.value);
  };

  const formControlStyle = {
    width: `${width}px`,
  };

  return (
    <FormControl style={formControlStyle}>
      <Select
        value={publicationGroup}
        onChange={handleChange}
        className={classes.dropDowns}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        sx={{ fontSize: "0.8em" }}
      >
        <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
          <em>Publication Group</em>
        </MenuItem>
        {publicationGroups.map((group) => (
          <MenuItem
            key={group.publicationgroupid}
            value={group.publicationgroupid}
            sx={{ fontSize: "0.8em", opacity: 0.7 }}
          >
            {group.publicationgroupname}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

PublicationGroup.propTypes = {
  publicationGroup: PropTypes.number.isRequired,
  setPublicationGroup: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
};

export default PublicationGroup;
