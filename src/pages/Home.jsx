import { useEffect } from "react";
import ResearchScreen from "./ResearchScreen";

const Home = () => {
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
    <div className="flex flex-col h-screen">
      <ResearchScreen />
    </div>
  );
};

export default Home;
