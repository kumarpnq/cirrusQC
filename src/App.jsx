import { useContext, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import { ResearchContext } from "./context/ContextProvider";
import { checkUserAuthenticate } from "./auth/auth";
import AutoTokenRefresh from "./auth/autoToken";
import MainNav from "./components/material-navbar";
import ArticleView from "./pages/unprotected/ArticleView";
import DynamicImport from "./DynamicImport";

function App() {
  const { setUserToken, screenPermissions } = useContext(ResearchContext);
  const userToken = localStorage.getItem("user");
  const location = useLocation();

  const componentMap = {
    ResearchScreen: () => import("./pages/ResearchScreen"),
    Qc2Print: () => import("./pages/Qc2Print"),
    Dump: () => import("./pages/Dump"),
    ManualUpload: () => import("./pages/ManualUpload"),
    NonTagged: () => import("./pages/NonTagged"),
    // Add other components as needed
  };

  useEffect(() => {
    checkUserAuthenticate(setUserToken);
  }, [setUserToken]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "Make sure you're saving latest changes. Are you sure you want to leave?";
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const renderRoute = (path, componentName, permission) => {
    return (
      <Route
        path={path}
        element={
          screenPermissions[permission] ? (
            <DynamicImport loadComponent={componentMap[componentName]} />
          ) : (
            <span>Loading...</span>
          )
        }
      />
    );
  };

  const isArticleView = location.pathname.startsWith("/articleview");

  return (
    <div className="bg-secondary" style={{ fontFamily: "Nunito" }}>
      <ToastContainer />
      {!isArticleView && (
        <div className="sticky top-0 z-50">
          <MainNav />
        </div>
      )}
      <AutoTokenRefresh />

      <Routes>
        {userToken ? (
          <>
            <Route path="/" exact element={<Home />} />
            {renderRoute("/online", "ResearchScreen", "Online-QC2")}
            {renderRoute("/print", "Qc2Print", "Print-QC2")}
            {renderRoute("/dump", "Dump", "Dump")}
            {renderRoute("/manual-upload", "ManualUpload", "Manual-upload")}
            {renderRoute("/non-tagged", "NonTagged", "Non-Tagged")}
          </>
        ) : (
          <Route path="/login" element={<Login />} />
        )}
        <Route path="*" element={userToken ? <NotFound /> : <Login />} />
        <Route
          path="/articleview/download-file/:id"
          element={<ArticleView />}
        />
      </Routes>
    </div>
  );
}

export default App;
