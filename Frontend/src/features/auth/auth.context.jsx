// import { createContext,useState } from "react";


// export const AuthContext = createContext()


// export const AuthProvider = ({ children }) => { 

//     const [user, setUser] = useState(null)
//     const [loading, setLoading] = useState(true)

    


//     return (
//         <AuthContext.Provider value={{user,setUser,loading,setLoading}} >
//             {children}
//         </AuthContext.Provider>
//     )
    
// }


import { createContext, useState, useCallback } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [clearInterviewFn, setClearInterviewFn] = useState(null)

    const registerClearInterview = useCallback((fn) => {
        setClearInterviewFn(() => fn)
    }, [])

    const clearInterview = useCallback(() => {
        if (clearInterviewFn) clearInterviewFn()
    }, [clearInterviewFn])

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading, clearInterview, registerClearInterview }}>
            {children}
        </AuthContext.Provider>
    )
}