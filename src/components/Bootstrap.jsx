'use client'
import { useEffect } from "react";

const Bootstrap = ({ children }) => {
  useEffect(() => {
    import("bootstrap");
    document.body.scrollTo(0, 0);
  }, []);
  return <>{children}</>;
};

export default Bootstrap;
