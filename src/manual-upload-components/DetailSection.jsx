import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  FormLabel,
  FormHelperText,
  InputLabel,
  TextField,
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
              <textarea
                cols="50"
                rows={3}
                className="border border-gray-500 outline-none rounded-[3px]"
              />
            </Box>
            <FormHelperText></FormHelperText>
          </FormControl>
        </CardContent>
      </Box>
    </Card>
  );
};

export default Details;
