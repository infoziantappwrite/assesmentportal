// hooks/useIsMobileOrTablet.js
import { useEffect, useState } from "react";

export default function useIsMobileOrTablet() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    const check = () => setIsMobileOrTablet(window.innerWidth < 1024); // < 1024 = mobile/tablet
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobileOrTablet;
}
