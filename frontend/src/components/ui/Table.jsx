import React from "react";
import { motion } from "framer-motion";

const Table = ({ children, className = "" }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>{children}</table>
    </div>
  );
};

const TableHeader = ({ children }) => {
  return (
    <thead className="bg-gray-50 dark:bg-gray-800">
      <tr>{children}</tr>
    </thead>
  );
};

const TableHead = ({ children, className = "" }) => {
  return (
    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  );
};

const TableBody = ({ children }) => {
  return <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>;
};

const TableRow = ({ children, onClick, className = "" }) => {
  return (
    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${onClick ? "cursor-pointer" : ""} ${className}`} onClick={onClick}>
      {children}
    </motion.tr>
  );
};

const TableCell = ({ children, className = "" }) => {
  return <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 ${className}`}>{children}</td>;
};

Table.Header = TableHeader;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
