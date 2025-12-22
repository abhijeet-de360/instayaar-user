import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  if (location.pathname !== "/") {
    return null;
  }


  return (
    <footer className="w-full border-t py-3 px-6 text-sm text-muted-foreground hidden md:block">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 text-center md:text-left">
          <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms&condition" className="hover:text-foreground transition-colors">
            Terms & Conditions
          </Link>
          <Link to="/data-deletion" className="hover:text-foreground transition-colors">
            Data Deletion Policy
          </Link>
        </div>

        <p className="text-xs text-center md:text-right">
          © {new Date().getFullYear()} InstaYaar. All rights reserved. Powered by Joshful Apps Private Limited.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
