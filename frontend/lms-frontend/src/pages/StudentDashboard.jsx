import { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardAPI.student()
            .then(r => setData(r.data.data))
            .catch(() => toast.error('Failed to load dashboard'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="loading-center"><div className="spinner" /></div>;

    const pct = data?.attendancePercentage || 0;
    const pctColor = pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">My Dashboard</h1>
                    <p className="page-subtitle">Student ID: <strong style={{ color: 'var(--primary)' }}>{data?.studentId}</strong></p>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-4" style={{ marginBottom: 24 }}>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#f97316' + '20' }}>
                        <span style={{ fontSize: 22 }}>📅</span>
                    </div>
                    <div>
                        <div className="stat-label">Attendance</div>
                        <div className="stat-value" style={{ color: pctColor }}>{pct}%</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{data?.presentDays}/{data?.totalDays} days</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#22c55e20' }}>
                        <span style={{ fontSize: 22 }}>💰</span>
                    </div>
                    <div>
                        <div className="stat-label">Fees Paid</div>
                        <div className="stat-value">₹{Number(data?.paidFees || 0).toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>of ₹{Number(data?.totalFees || 0).toLocaleString('en-IN')}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#ef444420' }}>
                        <span style={{ fontSize: 22 }}>⏳</span>
                    </div>
                    <div>
                        <div className="stat-label">Fees Pending</div>
                        <div className="stat-value" style={{ color: '#ef4444' }}>₹{Number(data?.pendingFees || 0).toLocaleString('en-IN')}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#6366f120' }}>
                        <span style={{ fontSize: 22 }}>💬</span>
                    </div>
                    <div>
                        <div className="stat-label">Open Queries</div>
                        <div className="stat-value">{data?.pendingQueries || 0}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-2">
                {/* Attendance Card */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>📊 Attendance Overview</h3>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={{ fontSize: 56, fontWeight: 900, color: pctColor }}>{pct}%</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                            {data?.presentDays} Present / {data?.totalDays} Total Days
                        </div>
                        <div className="progress-bar" style={{ height: 12 }}>
                            <div className={`progress-fill ${pct >= 75 ? 'high' : pct >= 50 ? 'medium' : 'low'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <div style={{ marginTop: 10, fontSize: 13, color: pct >= 75 ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                            {pct >= 75 ? '✅ Good Standing' : '⚠️ Below Required 75%'}
                        </div>
                    </div>
                </div>

                {/* Batch info */}
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>🎓 My Batch</h3>
                    {data?.batchName ? (
                        <div style={{ padding: '20px', background: 'var(--gradient-card)', borderRadius: 12 }}>
                            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>{data.batchName}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div>📝 Weekly Tests: <strong>{data?.weeklyTestCount || 0}</strong></div>
                                <div>🎤 Mock Interviews: <strong>{data?.mockInterviewCount || 0}</strong></div>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state" style={{ padding: 20 }}>
                            <div className="empty-state-text">Not enrolled in any batch yet</div>
                        </div>
                    )}

                    <div style={{ marginTop: 20 }}>
                        <h4 style={{ fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Fee Summary</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Total Fees</span>
                            <strong>₹{Number(data?.totalFees || 0).toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Paid</span>
                            <strong style={{ color: '#22c55e' }}>₹{Number(data?.paidFees || 0).toLocaleString('en-IN')}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Pending</span>
                            <strong style={{ color: '#ef4444' }}>₹{Number(data?.pendingFees || 0).toLocaleString('en-IN')}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
