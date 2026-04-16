import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Layout from './components/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Users from './pages/Users';
import Leads from './pages/Leads';
import Students from './pages/Students';
import Batches from './pages/Batches';
import Syllabus from './pages/Syllabus';
import Attendance from './pages/Attendance';
import Placements from './pages/Placements';
import Reports from './pages/Reports';

// Lazy placeholder for pages not yet built
const Placeholder = ({ title }) => (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🚧</div>
        <h2 style={{ fontWeight: 700, marginBottom: 8 }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)' }}>This section is ready — connect your backend API to see live data.</p>
    </div>
);

const ROLE_DASHBOARDS = {
    ADMIN: '/dashboard/admin', SUPER_ADMIN: '/dashboard/admin',
    SEO: '/dashboard/seo', SALES_HEAD: '/dashboard/sales',
    SALES_EMPLOYEE: '/dashboard/sales', TRAINER_HEAD: '/dashboard/trainer',
    TRAINER: '/dashboard/trainer', HR: '/dashboard/hr',
    PLACEMENT_HR: '/dashboard/placement', STUDENT: '/dashboard/student',
};

function PrivateRoute({ children, roles }) {
    const { user, loading } = useAuth();
    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>;
    
    if (!user) return <Navigate to="/login" replace />;
    
    // Redirect to their specific dashboard if they fail a role check, avoiding the /dashboard/admin loop
    if (roles && !roles.includes(user.role)) {
        return <Navigate to={ROLE_DASHBOARDS[user.role] || '/dashboard/admin'} replace />;
    }
    
    return children;
}

function AppRoutes() {
    const { user } = useAuth();
    const homePath = user ? (ROLE_DASHBOARDS[user.role] || '/dashboard/admin') : '/login';

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to={homePath} replace /> : <Login />} />
            <Route path="/" element={<Navigate to={homePath} replace />} />

            <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                {/* Dashboards */}
                <Route path="/dashboard/admin" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN', 'HR', 'PLACEMENT_HR']}><AdminDashboard /></PrivateRoute>} />
                <Route path="/dashboard/student" element={<PrivateRoute roles={['STUDENT']}><StudentDashboard /></PrivateRoute>} />
                <Route path="/dashboard/sales" element={<PrivateRoute roles={['SALES_HEAD', 'SALES_EMPLOYEE']}><AdminDashboard /></PrivateRoute>} />
                <Route path="/dashboard/trainer" element={<PrivateRoute roles={['TRAINER_HEAD', 'TRAINER']}><AdminDashboard /></PrivateRoute>} />
                <Route path="/dashboard/seo" element={<PrivateRoute roles={['SEO']}><AdminDashboard /></PrivateRoute>} />
                
                {/* ... existing routes ... */}
                <Route path="/users" element={<PrivateRoute roles={['ADMIN', 'SUPER_ADMIN', 'HR']}><Users /></PrivateRoute>} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/students" element={<Students />} />
                <Route path="/batches" element={<Batches />} />
                <Route path="/courses" element={<Placeholder title="Course Management" />} />
                <Route path="/syllabus" element={<Syllabus />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/evaluation" element={<Placeholder title="Evaluation — Weekly Tests & Mock Interviews" />} />
                <Route path="/payments" element={<Placeholder title="Payment Management" />} />
                <Route path="/placements" element={<Placements />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/queries" element={<Placeholder title="Student Queries" />} />

                <Route path="/my-attendance" element={<Placeholder title="My Attendance" />} />
                <Route path="/my-marks" element={<Placeholder title="My Marks & Evaluations" />} />
                <Route path="/my-fees" element={<Placeholder title="My Fee Status" />} />
                <Route path="/my-syllabus" element={<Placeholder title="My Syllabus" />} />
                <Route path="/my-queries" element={<Placeholder title="Raise a Query" />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ThemeProvider>
                <AuthProvider>
                    <AppRoutes />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 3000,
                            style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '14px' },
                            success: { iconTheme: { primary: '#22c55e', secondary: 'white' } },
                            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
                        }}
                    />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}
