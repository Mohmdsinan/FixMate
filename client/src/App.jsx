import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import CustomerLogin from './pages/CustomerLogin';
import CustomerRegister from './pages/CustomerRegister';
import WorkerLogin from './pages/WorkerLogin';
import WorkerRegister from './pages/WorkerRegister';
import AdminLogin from './pages/AdminLogin';
import WorkersPage from './pages/WorkersPage';
import WorkerDetailPage from './pages/WorkerDetailPage';
import NewBookingPage from './pages/NewBookingPage';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F6F8FB] text-[#222222] selection:bg-[#39A8C7]/30 selection:text-[#1B225B]">
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login/customer" element={<CustomerLogin />} />
          <Route path="/register/customer" element={<CustomerRegister />} />
          <Route path="/login/worker" element={<WorkerLogin />} />
          <Route path="/register/worker" element={<WorkerRegister />} />
          <Route path="/login/admin" element={<AdminLogin />} />

          <Route path="/workers" element={<WorkersPage />} />
          <Route path="/workers/:id" element={<WorkerDetailPage />} />

          {/* Protected Customer Routes */}
          <Route
            path="/booking/new/:workerId"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <NewBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Worker Routes */}
          <Route
            path="/dashboard/worker"
            element={
              <ProtectedRoute allowedRoles={['worker']}>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
