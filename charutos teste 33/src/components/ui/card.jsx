import React from 'react';

const Card = ({ children, ...props }) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, ...props }) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, ...props }) => {
  return (
    <h2 {...props}>
      {children}
    </h2>
  );
};

const CardDescription = ({ children, ...props }) => {
  return (
    <p {...props}>
      {children}
    </p>
  );
};

const CardContent = ({ children, ...props }) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, ...props }) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
