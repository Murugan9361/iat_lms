import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_CONFIG = {
    ADMIN: [
        {
            section: 'Main', items: [
                { path: '/dashboard/admin', icon: '📊', label: 'Dashboard' },
                { path: '/users', icon: '👥', label: 'User Management' },
                { path: '/leads', icon: '🎯', label: 'Leads' },
                { path: '/students', icon: '🎓', label: 'Students' },
                { path: '/batches', icon: '📚', label: 'Batches' },
                { path: '/courses', icon: '📖', label: 'Courses' },
            ]
        },
        {
            section: 'Training', items: [
                { path: '/syllabus', icon: '📋', label: 'Syllabus' },
                { path: '/attendance', icon: '✅', label: 'Attendance' },
                { path: '/evaluation', icon: '🧠', label: 'Evaluation' },
            ]
        },
        {
            section: 'Finance & HR', items: [
                { path: '/payments', icon: '💰', label: 'Payments' },
                { path: '/placements', icon: '🏢', label: 'Placements' },
                { path: '/reports', icon: '📈', label: 'Reports' },
            ]
        },
    ],
    SUPER_ADMIN: [
        {
            section: 'Main', items: [
                { path: '/dashboard/admin', icon: '📊', label: 'Dashboard' },
                { path: '/users', icon: '👥', label: 'Users' },
                { path: '/leads', icon: '🎯', label: 'Leads' },
                { path: '/students', icon: '🎓', label: 'Students' },
                { path: '/batches', icon: '📚', label: 'Batches' },
                { path: '/courses', icon: '📖', label: 'Courses' },
            ]
        },
        {
            section: 'Training', items: [
                { path: '/syllabus', icon: '📋', label: 'Syllabus' },
                { path: '/attendance', icon: '✅', label: 'Attendance' },
                { path: '/evaluation', icon: '🧠', label: 'Evaluation' },
            ]
        },
        {
            section: 'Operations', items: [
                { path: '/payments', icon: '💰', label: 'Payments' },
                { path: '/placements', icon: '🏢', label: 'Placements' },
                { path: '/reports', icon: '📈', label: 'Reports' },
            ]
        },
    ],
    SEO: [
        {
            section: 'Lead Management', items: [
                { path: '/dashboard/seo', icon: '📊', label: 'Dashboard' },
                { path: '/leads', icon: '🎯', label: 'My Leads' },
                { path: '/reports', icon: '📈', label: 'My Reports' },
            ]
        },
    ],
    SALES_HEAD: [
        {
            section: 'Sales', items: [
                { path: '/dashboard/sales', icon: '📊', label: 'Dashboard' },
                { path: '/leads', icon: '🎯', label: 'All Leads' },
                { path: '/students', icon: '🎓', label: 'Students' },
                { path: '/batches', icon: '📚', label: 'Batches' },
                { path: '/payments', icon: '💰', label: 'Payments' },
                { path: '/reports', icon: '📈', label: 'Reports' },
            ]
        },
    ],
    SALES_EMPLOYEE: [
        {
            section: 'Sales', items: [
                { path: '/dashboard/sales', icon: '📊', label: 'Dashboard' },
                { path: '/leads', icon: '🎯', label: 'My Leads' },
            ]
        },
    ],
    TRAINER_HEAD: [
        {
            section: 'Training', items: [
                { path: '/dashboard/trainer', icon: '📊', label: 'Dashboard' },
                { path: '/batches', icon: '📚', label: 'Batches' },
                { path: '/courses', icon: '📖', label: 'Courses' },
                { path: '/syllabus', icon: '📋', label: 'Syllabus' },
                { path: '/attendance', icon: '✅', label: 'Attendance' },
                { path: '/evaluation', icon: '🧠', label: 'Evaluation' },
            ]
        },
    ],
    TRAINER: [
        {
            section: 'Training', items: [
                { path: '/dashboard/trainer', icon: '📊', label: 'Dashboard' },
                { path: '/batches', icon: '📚', label: 'My Batches' },
                { path: '/syllabus', icon: '📋', label: 'Syllabus' },
                { path: '/attendance', icon: '✅', label: 'Attendance' },
                { path: '/queries', icon: '💬', label: 'Student Queries' },
            ]
        },
    ],
    STUDENT: [
        {
            section: 'My Portal', items: [
                { path: '/dashboard/student', icon: '📊', label: 'Dashboard' },
                { path: '/my-attendance', icon: '✅', label: 'Attendance' },
                { path: '/my-marks', icon: '📝', label: 'Marks' },
                { path: '/my-fees', icon: '💰', label: 'Fee Status' },
                { path: '/my-syllabus', icon: '📋', label: 'Syllabus' },
                { path: '/my-queries', icon: '💬', label: 'Raise Query' },
            ]
        },
    ],
    PLACEMENT_HR: [
        {
            section: 'Placement', items: [
                { path: '/dashboard/admin', icon: '📊', label: 'Dashboard' },
                { path: '/placements', icon: '🏢', label: 'Placements' },
                { path: '/students', icon: '🎓', label: 'Students' },
            ]
        },
    ],
    HR: [
        {
            section: 'HR', items: [
                { path: '/dashboard/admin', icon: '📊', label: 'Dashboard' },
                { path: '/users', icon: '👥', label: 'Users' },
            ]
        },
    ],
};

export default function Layout() {
    const { user, logout } = useAuth();
    const { theme, toggle } = useTheme();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const navSections = NAV_CONFIG[user?.role] || NAV_CONFIG['ADMIN'];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <div className="logo-icon">🎓</div>
                    <div>
                        <div className="logo-text">IAT LMS</div>
                        <div className="logo-sub">Management Portal</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navSections.map(section => (
                        <div key={section.section} className="nav-section">
                            <div className="nav-section-title">{section.section}</div>
                            {section.items.map(item => (
                                <NavLink key={item.path} to={item.path}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', marginBottom: 8 }}>
                        <div className="user-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>{initials}</div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.role}</div>
                        </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={handleLogout}
                        style={{ width: '100%', justifyContent: 'center' }}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="main-content">
                <header className="topbar">
                    <div className="topbar-left">
                        <h2 className="topbar-title">Welcome, {user?.name?.split(' ')[0]} 👋</h2>
                    </div>
                    <div className="topbar-right">
                        <button className="theme-toggle" onClick={toggle} title="Toggle theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                        <div className="user-avatar">{initials}</div>
                    </div>
                </header>

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
