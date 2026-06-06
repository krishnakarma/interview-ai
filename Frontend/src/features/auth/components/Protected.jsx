import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if (loading) {
    return (
        <main style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
        }}>
            <h1>Loading...</h1>
        </main>
    )
}

    if(!user){
        return <Navigate to={'/login'} />
    }
    
    return children
}

export default Protected