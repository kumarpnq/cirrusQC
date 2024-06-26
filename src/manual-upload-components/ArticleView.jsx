import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { FaExternalLinkAlt } from "react-icons/fa";

const ArticleView = ({ link, isResponsive }) => {
  return (
    <Card className="h-[80vh]">
      <Typography
        variant="h6"
        component={"a"}
        display="flex"
        alignItems="center"
        gap={1}
        fontSize={"0.9em"}
        href={link}
        target="_blank"
        rel="noreferrer"
        fontFamily="nunito"
        className="underline text-primary"
      >
        Article View{" "}
        <FaExternalLinkAlt
          style={{
            fontSize: "1.2em",
            fontFamily: "nunito",
          }}
        />
      </Typography>
      {link && (
        <iframe
          src={link}
          title="Article"
          width={isResponsive ? "610" : "100%"}
          height="100%"
          frameBorder="0"
        />
      )}
    </Card>
  );
};

ArticleView.propTypes = {
  link: PropTypes.string.isRequired,
  isResponsive: PropTypes.bool.isRequired,
};

export default ArticleView;
