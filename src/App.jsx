import { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import NotFound from "./components/NotFound";
import { ResearchContext } from "./context/ContextProvider";
import { checkUserAuthenticate } from "./auth/auth";

// **component import
import AutoTokenRefresh from "./auth/autoToken";
import Qc2Print from "./pages/Qc2Print";
import Dump from "./pages/Dump";
import MainNav from "./components/material-navbar";
import ManualUpload from "./pages/ManualUpload";
import NonTagged from "./pages/NonTagged";
import ArticleView from "./pages/unprotected/ArticleView";

function App() {
  const { setUserToken } = useContext(ResearchContext);
  let sessionValid = sessionStorage.getItem("user");
  const isDumpAccess = localStorage.getItem("isDMP");
  const userToken = localStorage.getItem("user");
  if (!sessionValid) {
    localStorage.removeItem("user");
  }
  useEffect(() => {
    checkUserAuthenticate(setUserToken);
  }, []);

  // * warning sign while refreshing
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "Make sure You're saving latest changes.Are you sure you want to leave?";
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div className="bg-secondory" style={{ fontFamily: "Nunito" }}>
      <ToastContainer />
      <div className="sticky top-0 z-50">
        <MainNav />
      </div>
      <AutoTokenRefresh />

      {/* <Navigation /> */}
      <Routes>
        {userToken ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/print" element={<Qc2Print />} />
            <Route
              path="/dump"
              element={isDumpAccess ? <Dump /> : <NotFound />}
            />
            <Route path="/manual-upload" element={<ManualUpload />} />
            <Route path="/non-tagged" element={<NonTagged />} />
          </>
        ) : (
          <Route path="/login" element={<Login />} />
        )}

        <Route path="*" element={userToken ? <NotFound /> : <Login />} />
        {/* unprotected routes */}
        <Route
          path="/articleview/download-file/:id"
          element={<ArticleView />}
        />
      </Routes>
    </div>
  );
}

export default App;
