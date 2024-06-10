import { useContext, useEffect, useState } from "react";
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
import Dump from "./pages/Dump";
import ManualUpload from "./pages/ManualUpload";
import NonTagged from "./pages/NonTagged";
import DDComp from "./print-components/DDComp";
import ResearchScreen from "./pages/ResearchScreen";

function App() {
  const { setUserToken, screenPermissions } = useContext(ResearchContext);
  const userToken = localStorage.getItem("user");
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  const onlinePermission = screenPermissions["Online-QC2"];
  const printPermission = screenPermissions["Print-QC2"];
  const dumpPermission = screenPermissions?.Dump;
  const manualPermission = screenPermissions["Manual-upload"];
  const nonTaggedPermission = screenPermissions["Non-Tagged"];

  useEffect(() => {
    checkUserAuthenticate(setUserToken);
  }, [setUserToken]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

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
            <Route
              path="/online"
              exact
              element={
                onlinePermission ? (
                  loading ? (
                    "loading"
                  ) : (
                    <ResearchScreen />
                  )
                ) : (
                  <NotFound />
                )
              }
            />
            <Route
              path="/print"
              element={
                printPermission ? (
                  loading ? (
                    "loading"
                  ) : (
                    <DDComp />
                  )
                ) : (
                  <NotFound />
                )
              }
            />
            <Route
              path="/dump"
              element={
                dumpPermission ? loading ? "loading" : <Dump /> : <NotFound />
              }
            />
            <Route
              path="/manual-upload"
              element={
                manualPermission ? (
                  loading ? (
                    "loading"
                  ) : (
                    <ManualUpload />
                  )
                ) : (
                  <NotFound />
                )
              }
            />
            <Route
              path="/non-tagged"
              element={
                nonTaggedPermission ? (
                  loading ? (
                    "loading"
                  ) : (
                    <NonTagged />
                  )
                ) : (
                  <NotFound />
                )
              }
            />
          </>
        ) : (
          <Route path="login" element={<Login />} />
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
