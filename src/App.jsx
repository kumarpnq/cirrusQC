import {
  useContext,
  useEffect,
  lazy,
  Suspense,
  useState,
  useLayoutEffect,
} from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// * third party import

// * comp & urls
import AutoTokenRefresh from "./auth/autoToken";
import MainNav from "./components/material-navbar";
import ArticleView from "./pages/unprotected/ArticleView";
import NotFound from "./components/NotFound";
import { ResearchContext } from "./context/ContextProvider";
import { checkUserAuthenticate } from "./auth/auth";
import { url } from "./constants/baseUrl";

// Lazy load the components
const Home = lazy(() => import("./pages/Home"));
const Dump = lazy(() => import("./pages/Dump"));
const ManualUpload = lazy(() => import("./pages/ManualUpload"));
const NonTagged = lazy(() => import("./pages/NonTagged"));
const DDComp = lazy(() => import("./print-components/DDComp"));
const ResearchScreen = lazy(() => import("./pages/ResearchScreen"));
const Login = lazy(() => import("./components/Login"));

function App() {
  const { setUserToken, screenPermissions } = useContext(ResearchContext);
  const userToken = localStorage.getItem("user");
  const location = useLocation();
  const [permissions, setPermissions] = useState({
    online: false,
    print: false,
    dump: false,
    manual: false,
    nonTagged: false,
  });
  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    const getPermission = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${url}refreshpermission/`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        const screen_access = response.data.screen_access;
        sessionStorage.setItem("prmsn", JSON.stringify(screen_access));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getPermission();
  }, [userToken]);

  useEffect(() => {
    setPermissions({
      online: screenPermissions["Online-QC2"],
      print: screenPermissions["Print-QC2"],
      dump: screenPermissions?.Dump,
      manual: screenPermissions["Manual-upload"],
      nonTagged: screenPermissions["Non-Tagged"],
    });
  }, [screenPermissions]);

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

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {userToken ? (
            <>
              <Route path="/" exact element={<Home />} />
              <Route
                path="/online"
                exact
                element={
                  permissions.online ? (
                    <ResearchScreen />
                  ) : (
                    <div>Loading...</div>
                  )
                }
              />
              <Route
                path="/print"
                element={
                  permissions.print ? (
                    <DDComp />
                  ) : loading ? (
                    <div>Loading...</div>
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route
                path="/dump"
                element={
                  permissions.dump ? (
                    <Dump />
                  ) : loading ? (
                    <div>Loading...</div>
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route
                path="/manual-upload"
                element={
                  permissions.manual ? (
                    <ManualUpload />
                  ) : loading ? (
                    <div>Loading...</div>
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route
                path="/non-tagged"
                element={
                  permissions.nonTagged ? (
                    <NonTagged />
                  ) : loading ? (
                    <div>Loading...</div>
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
      </Suspense>
    </div>
  );
}

export default App;
