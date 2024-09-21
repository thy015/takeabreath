import React, { useState } from "react";
 import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa";

const DashboardView = () => {
  const [open, setOpen] = useState(false);

  const showProfile = () => {
    setOpen(!open);
  };

  return (
    <div className="h-full text-red-800 text-9xl">
     EHE
    </div>
  );
};

export default DashboardView;
