import { Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Dashboard from "./dashboard/Dashboard"

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>

            <Toaster position="top-right" richColors closeButton expand={true} duration={4000} />
        </>
    )
}

export default App
