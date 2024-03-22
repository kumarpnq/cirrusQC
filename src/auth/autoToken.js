// AutoTokenRefresh.js

import { useEffect, useContext } from "react";
import { url } from "../constants/baseUrl";
import { ResearchContext } from "../context/ContextProvider";
import axios from "axios";

const AutoTokenRefresh = () => {
  const { name, password, userToken, setUserToken, setLogoutTimer } =
    useContext(ResearchContext);

  const getAutoToken = async () => {
    try {
      const res = await axios.post(`${url}authenticate/`, {
        loginname: name,
        password: password,
      });
      localStorage.setItem("user", res.data.access_token);
      setUserToken(localStorage.getItem("user"));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setUserToken("");
      getAutoToken();
    }, 2 * 60 * 60 * 1000); // Two hours

    setLogoutTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [userToken, setUserToken, setLogoutTimer]);

  return null; // This component doesn't render anything
};

export default AutoTokenRefresh;
