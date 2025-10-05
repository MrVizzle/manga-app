import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthRedirect = ({children }) => {
    const { user } = useContext(AuthContext);
    
    //if user logged in, redirect to browse
    if (user){
        return <Navigate to="/search" replace />;
    }

    return children;
};

export default AuthRedirect;