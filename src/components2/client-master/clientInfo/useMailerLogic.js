import { useEffect, useState } from "react";
import axiosInstance from "../../../../axiosConfig";

const useMailerLogic = () => {
  const [mailerLogic, setMailerLogic] = useState([]);
  useEffect(() => {
    const fetchLogic = async () => {
      try {
        const response = await axiosInstance.get("clientMailerLogic");
        setMailerLogic(response.data.data.mailerLogic);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchLogic();
  }, []);
  return { mailerLogic };
};

export default useMailerLogic;
