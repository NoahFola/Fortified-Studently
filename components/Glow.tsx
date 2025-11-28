import React from "react";

const Glow = () => {
  return (
    <div className="absolute inset-0 rounded-2xl opacity-40 blur-[6px] z-0 transition-all duration-500 border-none  group-hover:opacity-70 group-hover:blur-sm bg-linear-to-br from-[#0078ff] to-red-300 dark:from-green-200 dark:to-red-700 animate-pulse"></div>
  );
};

export default Glow;
