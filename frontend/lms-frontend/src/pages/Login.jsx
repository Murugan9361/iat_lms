import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const ROLE_DASHBOARDS = {
    ADMIN: '/dashboard/admin', SUPER_ADMIN: '/dashboard/admin',
    SEO: '/dashboard/seo', SALES_HEAD: '/dashboard/sales',
    SALES_EMPLOYEE: '/dashboard/sales', TRAINER_HEAD: '/dashboard/trainer',
    TRAINER: '/dashboard/trainer', HR: '/dashboard/hr',
    PLACEMENT_HR: '/dashboard/placement', STUDENT: '/dashboard/student',
};

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const { login } = useAuth();
    const { theme, toggle } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            toast.success(`Welcome back, ${user.name}!`);
            navigate(ROLE_DASHBOARDS[user.role] || '/dashboard/admin');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            {/* Background Orbs */}
            <div className="login-bg-orb" style={{ width: 400, height: 400, background: 'var(--primary)', top: -100, right: -100 }} />
            <div className="login-bg-orb" style={{ width: 300, height: 300, background: 'var(--accent)', bottom: -80, left: -80 }} />

            <button className="theme-toggle" style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}
                onClick={toggle} title="Toggle theme">
                {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-icon">🎓</div>
                    <h1 className="login-title">IAT Learning Portal</h1>
                    <p className="login-subtitle">Institute Management System</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            className="form-control"
                            type="email" placeholder="admin@iat.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="form-control"
                                type={showPass ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                                style={{ paddingRight: 44 }}
                            />
                            <button type="button"
                                onClick={() => setShowPass(!showPass)}
                                style={{
                                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-muted)'
                                }}>
                                {showPass ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={loading}
                        style={{ width: '100%', justifyContent: 'center', height: 48, fontSize: 15, marginTop: 8 }}>
                        {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</>
                            : '🚀 Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: 24, padding: '16px', background: 'var(--bg-secondary)', borderRadius: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                    <strong style={{ color: 'var(--primary)' }}>Demo Credentials:</strong><br />
                    Admin: admin@iat.com / admin123
                </div>
            </div>
        </div>
    );
}
