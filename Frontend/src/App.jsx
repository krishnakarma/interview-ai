// import { RouterProvider } from "react-router"
// import { router } from "./app.routes.jsx"
// import { AuthProvider } from "./features/auth/auth.context.jsx"
// import { InterviewProvider } from "./features/interview/interview.context.jsx"

// function App() {

//   return (
//     <AuthProvider>
//       <InterviewProvider>
//         <RouterProvider router={router} />
//       </InterviewProvider>
//     </AuthProvider>
//   )
// }

// export default App

import { RouterProvider } from 'react-router'
import { router } from './app.routes.jsx'
import { AuthProvider } from './features/auth/auth.context.jsx'
import { InterviewProvider } from './features/interview/interview.context.jsx'
import { ToastProvider } from './components/Toast'
import './style.scss'

// Set saved theme before first render
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)

function App() {
  return (
    <AuthProvider>
      <InterviewProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </InterviewProvider>
    </AuthProvider>
  )
}

export default App