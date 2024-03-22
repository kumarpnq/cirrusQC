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
import Navigation from "./components/Navigation";
import Qc2Print from "./pages/Qc2Print";

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
      <AutoTokenRefresh />
      <Navigation />
      <Routes>
        {userToken ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/print" element={<Qc2Print />} />
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
