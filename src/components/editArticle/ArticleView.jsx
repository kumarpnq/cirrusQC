import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { FaExternalLinkAlt } from "react-icons/fa";

const ArticleView = ({ selectedArticle }) => {
  const link = selectedArticle?.link?.props?.href;

  return (
    <Card className="w-full px-6 ml-2">
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
        className="underline text-primary"
      >
        Article View <FaExternalLinkAlt style={{ fontSize: "1.2em" }} />
      </Typography>
      {link && (
        <iframe
          src={link}
          title="Article"
          width="100%"
          height="100%"
          frameBorder="0"
        />
      )}
    </Card>
  );
};

ArticleView.propTypes = {
  selectedArticle: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.object,
    props: PropTypes.object,
    href: PropTypes.string,
    content: PropTypes.string.isRequired,
  }),
};

export default ArticleView;
