import { createContext, useState } from "react";

export const AuthContext = createContext({
    isAuthenticated: false,
    user: {
        id: '',
        email: '',
        name: ''
    },
    login:()=>{}
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

    const login=(decodedToken)=>{
        setAuth({
            isAuthenticated:true,
            user:{
                id:decodedToken.id ||'',
                name:decodedToken.name ||'',
                email:decodedToken.email ||'',
                role:decodedToken.role ||''
            }
        })
    }
    return (
        <AuthContext.Provider value={{ auth,setAuth,login }}>
            {children}
        </AuthContext.Provider>
    )
}


