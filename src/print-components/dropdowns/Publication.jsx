import PropTypes from "prop-types";
import { FormControl, Select, MenuItem } from "@mui/material";
import useFetchData from "../../hooks/useFetchData";
import { url } from "../../constants/baseUrl";
import { useEffect, useState } from "react";

const Publication = ({
  publicationGroup,
  publication,
  setPublication,
  classes,
  width,
}) => {
  const { data } = useFetchData(
    publicationGroup ? `${url}publications/${publicationGroup}` : null,
    publication
  );
  const [publications, setPublications] = useState([]);

  const handleChange = (e) => {
    setPublication(e.target.value);
  };

  useEffect(() => {
    if (publicationGroup === null) {
      setPublication("");
      setPublications([]);
    } else {
      setPublications(data?.data?.publications || []);
    }
  }, [publicationGroup, data]);

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
        {publications.map((group) => (
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
