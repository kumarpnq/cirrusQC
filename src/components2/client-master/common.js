import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

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
