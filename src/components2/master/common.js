import { Box, styled, Typography } from "@mui/material";

export const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vw",
  bgcolor: "background.paper",
  border: "1px solid #ddd",
  boxShadow: 24,
  p: 1,
};

export const StyledWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  margin: theme.spacing(0.2),
  padding: theme.spacing(0.5),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  boxShadow: `0 4px 8px rgba(0, 0, 0, 0.1)`,
  transition: "all 0.5s ease-in-out",
  "&:hover": {
    boxShadow: `0 6px 12px rgba(0, 0, 0, 0.2)`,
    // transform: "scale(1.001)",
  },
  backgroundColor: theme.palette.background.default,
}));

export const StyledText = styled(Typography)(({ theme }) => ({
  fontSize: "1em",
  color: theme.palette.text.secondary,
  fontWeight: "500",
  whiteSpace: "nowrap",
  width: 255,
  overflow: "hidden",
  textOverflow: "ellipsis",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75em",
    width: "auto",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "0.875em",
    width: "auto",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "1em",
    width: 250,
  },
  textAlign: "left",
  padding: theme.spacing(0.5),
}));
