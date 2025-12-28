import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

//components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
//Pages
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ChatInterface from "./pages/ChatInterfacePage";

const Layout=()=>{
    return(
        <>
        <Navbar />
        <Outlet />
        <Footer />
        </>
    )
}

function AppRoutes() {


    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                {/* Routes with Navbar and Footer */}
                    <Route path="/" element={<HomePage />} />
                </Route>
                {/* Routes without Navbar and Footer */}
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/chat" element={<ChatInterface />} />

            </Routes>
        </Router>
    );
}

export default AppRoutes;