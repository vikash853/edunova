// src/components/common/Skeleton.jsx
import React from 'react';

const Skeleton = ({ className = '', height = 'h-64', rounded = 'rounded-2xl' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${height} ${rounded} ${className}`}
    />
  );
};

export default Skeleton;