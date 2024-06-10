import { Box, Typography, useMediaQuery } from "@mui/material";

const Home = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  return (
    <Box className="flex items-center justify-center h-screen">
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          display: {
            xs: "none",
            sm: "block",
            textTransform: "uppercase",
          },
        }}
      >
        {isSmallScreen ? (
          <>
            <span className="text-black">P</span>
            <span className="text-red-500">&</span>
            <span className="text-gray-500">Q</span>
          </>
        ) : (
          <>
            {" "}
            <span className="text-black">PERCEPTION</span>
            <span className="text-red-500">&</span>
            <span className="text-gray-500">QUANT</span>
          </>
        )}
      </Typography>
    </Box>
  );
};

export default Home;
