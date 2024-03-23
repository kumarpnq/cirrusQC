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
// import Navigation from "./components/Navigation";
import Qc2Print from "./pages/Qc2Print";
import Dump from "./pages/Dump";
import MainNav from "./components/material-navbar";

function App() {
  const { userToken, setUserToken } = useContext(ResearchContext);
  let sessionValid = sessionStorage.getItem("user");
  if (!sessionValid) {
    localStorage.removeItem("user");
  }
  useEffect(() => {
    checkUserAuthenticate(setUserToken);
  }, []);

  return (
    <div className="bg-secondory">
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
            <Route path="/dump" element={<Dump />} />
          </>
        ) : (
          <Route path="/login" element={<Login />} />
        )}

        <Route path="*" element={userToken ? <NotFound /> : <Login />} />
      </Routes>
    </div>
  );
}

export default App;
