import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import NewTicket from './pages/NewTicket';
import Equipments from './pages/Equipments';
import NewEquipment from './pages/NewEquipment';
import EditEquipment from './pages/EditEquipment';
import Users from './pages/Users';
import NewUser from './pages/NewUser';
import Settings from './pages/Settings';
import Network from './pages/Network';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string | string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="tickets" element={<Tickets />} />
              <Route path="tickets/new" element={<NewTicket />} />
              
              {/* Rotas restritas para Técnicos e Administradores */}
              <Route path="equipments" element={
                <ProtectedRoute requiredRole={['Técnico', 'Administrador']}>
                  <Equipments />
                </ProtectedRoute>
              } />
              <Route path="equipments/new" element={
                <ProtectedRoute requiredRole={['Técnico', 'Administrador']}>
                  <NewEquipment />
                </ProtectedRoute>
              } />
              <Route path="equipments/edit/:id" element={
                <ProtectedRoute requiredRole={['Técnico', 'Administrador']}>
                  <EditEquipment />
                </ProtectedRoute>
              } />
              <Route path="network" element={
                <ProtectedRoute requiredRole={['Técnico', 'Administrador']}>
                  <Network />
                </ProtectedRoute>
              } />

              {/* Rotas restritas apenas para Administradores */}
              <Route path="users" element={
                <ProtectedRoute requiredRole="Administrador">
                  <Users />
                </ProtectedRoute>
              } />
              <Route path="users/new" element={
                <ProtectedRoute requiredRole="Administrador">
                  <NewUser />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute requiredRole="Administrador">
                  <Settings />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
