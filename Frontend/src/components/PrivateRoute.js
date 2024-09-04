import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const jwtToken = localStorage.getItem('jwtToken');

  return (
    <Route
      {...rest}
      element={
        jwtToken ? (
          Component
        ) : (
          <Navigate to="/error" />
        )
      }
    />
  );
};

export default PrivateRoute;
