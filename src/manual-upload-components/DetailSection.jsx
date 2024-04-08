import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  FormLabel,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import Button from "../components/custom/Button";
import Languages from "../components/research-dropdowns/Languages";
import { useContext, useState } from "react";
import ToDate from "../components/research-dropdowns/ToDate";
import { ResearchContext } from "../context/ContextProvider";

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },

  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    background: "#d4c8c7",
  },
}));
const Details = () => {
  const { formattedNextDay } = useContext(ResearchContext);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [dateNow, setDateNow] = useState(formattedNextDay);
  const classes = useStyle();
  return (
    <Card>
      <CardContent>
        <FormControl fullWidth>
          <Box mb={2} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Title:</Typography>
            <TextField
              size="small"
              // fullWidth
              sx={{ width: 350, ml: 4 }}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box mb={2} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Content:</Typography>
            <TextField
              size="small"
              multiline
              sx={{ width: 350, ml: 1.4 }}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box mb={2} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Summary:</Typography>
            <TextField
              size="small"
              multiline
              sx={{ width: 350 }}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box mb={2} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Image:</Typography>
            <TextField
              size="small"
              sx={{ width: 350, ml: 2.5 }}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box mb={2} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Search:</Typography>
            <TextField
              size="small"
              sx={{ width: 350, ml: 2.2 }}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box mb={2} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Article:</Typography>
            <TextField
              size="small"
              sx={{ width: 350, ml: 2.5 }}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box mb={2} display="flex" alignItems="center">
            <Typography sx={{ fontSize: "0.9em" }}>Publication:</Typography>
            <TextField
              size="small"
              sx={{ width: 350 }}
              InputProps={{
                style: {
                  fontSize: "0.8rem",
                  height: 25,
                },
              }}
            />
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box mb={2} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em" }}>Language:</Typography>
              <Languages
                language={selectedLanguages}
                setLanguage={setSelectedLanguages}
                classes={classes}
              />
            </Box>
            <Box mb={2} display="flex" alignItems="center">
              <Typography sx={{ fontSize: "0.9em" }}>Date:</Typography>
              <ToDate
                dateNow={dateNow}
                setDateNow={setDateNow}
                isMargin={false}
              />
            </Box>
          </Box>
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button btnText="Save" />
            <Button btnText="Cancel" />
          </Box>
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default Details;
