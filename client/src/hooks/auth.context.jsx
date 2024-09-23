import { createContext, useState } from "react";

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        id: '',
        email: '',
        name: ''
    }
})

export const AuthWrapper = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        user: {
            id: '',
            name: '',
            email:''
        }
    })
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}


