import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

//components
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
//Pages
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ChatInterface from "../pages/ChatPage";
//Protected Routes
import ProtectedRoutes from "./ProtectedRoutes";
import FeaturesPage from "../pages/FeaturesPage";
import DocsPage from "../pages/DocsPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
const Layout = () => {
    return (
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
                    <Route path='/features' element={<FeaturesPage />} />
                    <Route path='/docs' element={<DocsPage />} />
                    <Route path='/about' element={<AboutPage />} />
                    <Route path='/contact' element={<ContactPage />} />



                </Route>
                {/* Routes without Navbar and Footer */}
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/chat" element={
                    <ProtectedRoutes>
                        <ChatInterface />
                    </ProtectedRoutes>
                } />
                <Route path='/chat/:chatId' element={
                    <ProtectedRoutes>
                        <ChatInterface />
                    </ProtectedRoutes>
                } />

            </Routes>
        </Router>
    );
}

export default AppRoutes;