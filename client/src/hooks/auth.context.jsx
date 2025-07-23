import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        id: '',
        email: '',
        name: '',
        role: ''
    },
    login: () => {}
});

export const AuthWrapper = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            id: '',
            name: '',
            email: '',
            role: ''
        }
    });

    const [isLoadingAuth, setLoadingAuth] = useState(true);

    const login = (decodedToken) => {
        setAuth({
            isAuthenticated: true,
            user: {
                id: decodedToken.id || '',
                name: decodedToken.name || '',
                email: decodedToken.email || '',
                role: decodedToken.role || ''
            }
        });
    };

    return (
      <AuthContext.Provider value={{ auth, setAuth, login, isLoadingAuth, setLoadingAuth }}>
          {children}
      </AuthContext.Provider>
    );
};

AuthWrapper.propTypes = {
    children: PropTypes.node.isRequired
};