import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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

  const renderRoute = (path, componentPath, permission) => {
    return (
      <Route
        path={path}
        element={
          screenPermissions[permission] ? (
            <DynamicImport
              loadComponent={() => import(`./pages/${componentPath}`)}
            />
          ) : (
            <NotFound />
          )
        }
      />
    );
  };

  return (
    <div className="bg-secondary" style={{ fontFamily: "Nunito" }}>
      <ToastContainer />
      <div className="sticky top-0 z-50">
        <MainNav />
      </div>
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
