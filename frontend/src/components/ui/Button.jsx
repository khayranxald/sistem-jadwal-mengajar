import React from "react";
import { motion } from "framer-motion";

const Button = ({ children, variant = "primary", type = "button", onClick, disabled = false, className = "", ...props }) => {
  const baseClasses = "font-medium py-2.5 px-5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl",
  };

  return (
    <motion.button whileHover={{ scale: disabled ? 1 : 1.02 }} whileTap={{ scale: disabled ? 1 : 0.98 }} type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </motion.button>
  );
};

export default Button;
