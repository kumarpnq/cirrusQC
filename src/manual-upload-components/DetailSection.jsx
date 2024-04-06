import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  FormLabel,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

const Details = () => {
  return (
    <Card>
      <Box>
        <CardContent>
          <FormControl>
            <FormLabel> Basic Details</FormLabel>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={1}
            >
              <label>Title:</label>
              <TextField size="small" fullWidth />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={1}
            >
              <label>Content:</label>
              <textarea
                cols="50"
                rows={3}
                className="border border-gray-500 outline-none rounded-[3px]"
              />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={1}
            >
              <label>Article Summary:</label>
              <textarea
                cols="50"
                rows={3}
                className="border border-gray-500 outline-none rounded-[3px]"
              />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={1}
            >
              <label>Image URL:</label>
              <TextField size="small" fullWidth />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={1}
            >
              <label>Languages:</label>
              <Select name="" id="" fullWidth size="small" label="Languages">
                <MenuItem value="">English</MenuItem>
                <MenuItem value="">Marathi</MenuItem>
                <MenuItem value="">Hindi</MenuItem>
              </Select>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={1}
            >
              <Button variant="outlined">Save</Button>
              <Button variant="outlined">Cancel</Button>
            </Box>
          </FormControl>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Details;
