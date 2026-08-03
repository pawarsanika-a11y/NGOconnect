import { Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Search from "@/pages/Search";
import OrganizationDetail from "@/pages/OrganizationDetail";
import Compare from "@/pages/Compare";
import DonorDashboard from "@/pages/DonorDashboard";
import OrgDashboard from "@/pages/OrgDashboard";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-paper dark:bg-ink">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search" element={<Search />} />
          <Route path="/organizations/:id" element={<OrganizationDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/dashboard/*" element={<DonorDashboard />} />
          <Route path="/org-dashboard/*" element={<OrgDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
