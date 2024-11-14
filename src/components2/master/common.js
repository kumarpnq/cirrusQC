import { Box, styled, Typography } from "@mui/material";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #ddd",
  boxShadow: 24,
  p: 1,
};

export const StyledWrapper = styled(Box)({
  display: "flex",
  alignItems: "Center",
  padding: 2,
});

export const StyledText = styled(Typography)({
  color: "GrayText",
  fontSize: "1em",
  textWrap: "nowrap",
  width: 157,
});
