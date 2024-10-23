import {
  useContext,
  useEffect,
  lazy,
  Suspense,
  useState,
  useLayoutEffect,
} from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// * third party import
import axios from "axios";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// * comp & urls
import AutoTokenRefresh from "./auth/autoToken";
import MainNav from "./components/material-navbar";
import ArticleView from "./pages/unprotected/ArticleView";
import NotFound from "./components/NotFound";
import { ResearchContext } from "./context/ContextProvider";
import { checkUserAuthenticate } from "./auth/auth";
import { url } from "./constants/baseUrl";
import Online from "./pages/qc1/Online";
import Print from "./pages/qc1/Print";
import Analytics from "./pages/Analytics/Analytics";
import BasketCityPub from "./pages/BasketCityPub";
import PrintSimilarArticles from "./pages/qc1/PrintSimilarArticles";
import CopyArticles from "./pages/CopyArticles";
import OnlineMailSchedular from "./pages/OnlineMailSchedular";
import OnlineCompanySlicing from "./pages/OnlineCompanySlicing";
import WhatsAppContact from "./components2/Whatsapp-contact/WhatsAppContact";

// Lazy load the components
const Home = lazy(() => import("./pages/Home"));
const Dump = lazy(() => import("./pages/Dump"));
const ManualUpload = lazy(() => import("./pages/ManualUpload"));
const NonTagged = lazy(() => import("./pages/NonTagged"));
const DDComp = lazy(() => import("./print-components/DDComp"));
const ResearchScreen = lazy(() => import("./pages/ResearchScreen"));
const Login = lazy(() => import("./components/Login"));

function App() {
  const { setUserToken, screenPermissions, setScreenPermissions } =
    useContext(ResearchContext);
  const userToken = localStorage.getItem("user");
  const location = useLocation();
  const [permissions, setPermissions] = useState({
    online: false,
    print: false,
    dump: false,
    manual: false,
    nonTagged: false,
    Analytics: false,
    onlineQC1: false,
    printQc1: false,
    clientBasketCityPublication: false,
    PrintSimilarArticles: false,
    copyArticles: false,
    mailerSchedular: false,
    companySlicing: false,
    whatsappContact: false,
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
        const permissionData = sessionStorage.getItem("prmsn");

        if (permissionData) {
          const parsedPermissions = JSON.parse(permissionData);
          // Map permission values to boolean
          const mappedPermissions = Object.fromEntries(
            Object.entries(parsedPermissions).map(([key, value]) => [
              key,
              value === "Yes",
            ])
          );
          setScreenPermissions(mappedPermissions);
        }
      } catch (error) {
        if (error.request.statusText === "Unauthorized") {
          localStorage.clear();
        }
      } finally {
        setLoading(false);
      }
    };
    getPermission();
  }, []);

  useEffect(() => {
    setPermissions({
      online: screenPermissions["Online-QC2"],
      print: screenPermissions["Print-QC2"],
      dump: screenPermissions?.Dump,
      manual: screenPermissions["Manual-upload"],
      nonTagged: screenPermissions["Non-Tagged"],
      Analytics: screenPermissions.Analytics,
      onlineQC1: screenPermissions["QC1-Online"],
      printQc1: screenPermissions["QC1-Print"],
      clientBasketCityPublication:
        screenPermissions.clientBasketCityPublication,
      PrintSimilarArticles: screenPermissions["PrintSimilarArticles"],
      copyArticles: screenPermissions.CopyArticles,
      mailerSchedular: screenPermissions.MailerSchedular,
      companySlicing: screenPermissions.CompanySlicing,
      whatsappContact: screenPermissions.WhatsappContact,
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
      <Toaster position="top-right" reverseOrder={false} />
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
                path="/qc1/online"
                exact
                element={
                  permissions.onlineQC1 ? <Online /> : <div>Loading...</div>
                }
              />
              <Route
                path="/qc1/print"
                exact
                element={
                  permissions.printQc1 ? <Print /> : <div>Loading...</div>
                }
              />
              <Route
                path="qc1/print-similar-articles"
                exact
                element={
                  permissions.PrintSimilarArticles ? (
                    <PrintSimilarArticles />
                  ) : (
                    <div>Loading...</div>
                  )
                }
              />
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
              <Route
                path="/analytics"
                element={
                  permissions.Analytics ? (
                    <Analytics />
                  ) : loading ? (
                    <div>Loading...</div>
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route
                path="/client-basket-city-publication"
                element={
                  permissions.clientBasketCityPublication ? (
                    <BasketCityPub />
                  ) : loading ? (
                    <div>Loading...</div>
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route
                path="/copy-articles"
                element={
                  permissions.copyArticles ? (
                    <CopyArticles />
                  ) : loading ? (
                    <div>Loading...</div>
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route
                path="/online-mailer-schedular"
                element={
                  permissions.mailerSchedular ? (
                    <OnlineMailSchedular />
                  ) : loading ? (
                    <div>Loading...</div>
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route
                path="/company-slicing"
                element={
                  permissions.companySlicing ? (
                    <OnlineCompanySlicing />
                  ) : loading ? (
                    <div>Loading...</div>
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route
                path="/whatsapp-contact"
                element={
                  permissions.whatsappContact ? (
                    <WhatsAppContact />
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
