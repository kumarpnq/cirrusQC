import { useContext, useEffect, useState } from "react";
import { ResearchContext } from "../context/ContextProvider";

const Home = () => {
  const { screenPermissions } = useContext(ResearchContext);
  const [HomeComponent, setHomeComponent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const componentsMapping = {
      "Online-QC2": () => import("./ResearchScreen"),
      "Print-QC2": () => import("./Qc2Print"),
      Dump: () => import("./Dump"),
      "Manual-upload": () => import("./ManualUpload"),
      "Non-Tagged": () => import("./NonTagged"),
    };

    const loadHomeComponent = async () => {
      for (const screen in screenPermissions) {
        if (screenPermissions[screen]) {
          const Component = componentsMapping[screen];
          if (Component) {
            const module = await Component();
            setHomeComponent(() => module.default);
            setLoading(false);
            return;
          }
        }
      }
      setLoading(false);
    };

    loadHomeComponent();
  }, [screenPermissions]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      {HomeComponent ? <HomeComponent /> : <p>Loading...</p>}
    </div>
  );
};

export default Home;
