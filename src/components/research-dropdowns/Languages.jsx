import { FormControl, Select, MenuItem, OutlinedInput } from "@mui/material";
import PropTypes from "prop-types";
import useFetchData from "../../hooks/useFetchData";
import { useEffect, useState } from "react";
import { url } from "../../constants/baseUrl";

const Languages = ({ language, setLanguage, classes }) => {
  const [languages, setLanguages] = useState([]);

  const selectedLanguages = Object.entries(languages)
    .filter(([_, languagecode]) => language.includes(languagecode))
    .map(([languagename, _]) => languagename);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const {
    data: langs,
    error: langsError,
    // loading: langsLoading,
  } = useFetchData(`${url}languagelist/`);

  useEffect(() => {
    if (langs.data) {
      setLanguages(langs.data.languages);
    } else {
      console.log(langsError);
    }
  }, [langs, langsError]);
  return (
    <div style={{ height: 25 }} className="flex items-center">
      <FormControl className="w-28">
        <Select
          multiple
          displayEmpty
          value={language}
          onChange={handleLanguageChange}
          className={classes.dropDowns}
          input={<OutlinedInput />}
          MenuProps={{ PaperProps: { style: { height: 200 } } }}
          inputProps={{ "aria-label": "Without label" }}
          sx={{ fontSize: "0.8em" }}
          renderValue={() => {
            if (selectedLanguages.length === 0) {
              return <em>Languages</em>;
            }
            return selectedLanguages.join(", ");
          }}
        >
          <MenuItem value="" sx={{ fontSize: "0.8em", opacity: 0.7 }}>
            <em>Languages</em>
          </MenuItem>
          {Object.entries(languages).map(([languagename, languagecode]) => (
            <MenuItem
              key={languagecode}
              value={languagecode}
              sx={{ fontSize: "0.8em", opacity: 0.7 }}
            >
              {languagename}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

Languages.propTypes = {
  language: PropTypes.arrayOf(PropTypes.string).isRequired,
  setLanguage: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default Languages;
