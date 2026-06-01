// import { createContext,useState } from "react";


// export const InterviewContext = createContext()

// export const InterviewProvider = ({ children }) => {
//     const [loading, setLoading] = useState(false)
//     const [report, setReport] = useState(null)
//     const [reports, setReports] = useState([])

//     return (
//         <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
//             {children}
//         </InterviewContext.Provider>
//     )
// }


import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../auth/auth.context";

export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])

    const { registerClearInterview } = useContext(AuthContext)

    const clearInterview = useCallback(() => {
        setReport(null)
        setReports([])
        setLoading(false)
    }, [])

    useEffect(() => {
        registerClearInterview(clearInterview)
    }, [clearInterview, registerClearInterview])

    return (
        <InterviewContext.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
            {children}
        </InterviewContext.Provider>
    )
}