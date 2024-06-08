import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DynamicImport = ({ loadComponent }) => {
  const [Component, setComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const { default: loadedComponent } = await loadComponent();
        setComponent(() => loadedComponent);
      } catch (error) {
        console.error("Error loading component:", error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [loadComponent]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return Component ? <Component /> : <div>Component not found</div>;
};

DynamicImport.propTypes = {
  loadComponent: PropTypes.func.isRequired,
};

export default DynamicImport;
