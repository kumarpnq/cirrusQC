import ArticleView from "../manual-upload-components/ArticleView";
import Details from "../manual-upload-components/DetailSection";

const ManualUpload = () => {
  return (
    <div className="flex h-screen">
      <Details />
      <ArticleView />
    </div>
  );
};

export default ManualUpload;
