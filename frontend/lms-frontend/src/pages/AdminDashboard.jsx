import { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import toast from 'react-hot-toast';

function StatCard({ icon, label, value, color, change }) {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ background: `${color}20` }}>
                <span style={{ fontSize: 24 }}>{icon}</span>
            </div>
            <div>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value ?? '—'}</div>
                {change && <div className={`stat-change ${change > 0 ? 'up' : 'down'}`}>
                    {change > 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
                </div>}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardAPI.admin()
            .then(r => setStats(r.data.data))
            .catch(() => toast.error('Failed to load dashboard'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="loading-center"><div className="spinner" /></div>
    );

    const cards = [
        { icon: '👥', label: 'Total Users', value: stats?.totalUsers, color: '#6366f1' },
        { icon: '🎓', label: 'Total Students', value: stats?.totalStudents, color: '#f97316' },
        { icon: '🎯', label: 'Total Leads', value: stats?.totalLeads, color: '#8b5cf6' },
        { icon: '✅', label: 'Converted Leads', value: stats?.convertedLeads, color: '#22c55e' },
        { icon: '📚', label: 'Active Batches', value: stats?.activeBatches, color: '#06b6d4' },
        { icon: '👨‍🏫', label: 'Trainers', value: stats?.totalTrainers, color: '#f59e0b' },
        { icon: '💰', label: 'Fees Collected', value: `₹${Number(stats?.totalFeesCollected || 0).toLocaleString('en-IN')}`, color: '#10b981' },
        { icon: '⏳', label: 'Fees Pending', value: `₹${Number(stats?.totalFeesPending || 0).toLocaleString('en-IN')}`, color: '#ef4444' },
        { icon: '🏢', label: 'Students Placed', value: stats?.placedStudents, color: '#f97316' },
    ];

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Admin Dashboard</h1>
                    <p className="page-subtitle">Real-time overview of the institute</p>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    Last updated: {new Date().toLocaleString('en-IN')}
                </div>
            </div>

            <div className="grid grid-3" style={{ marginBottom: 28 }}>
                {cards.map(c => <StatCard key={c.label} {...c} />)}
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-2">
                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        📊 Lead Conversion Rate
                    </h3>
                    <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--primary)', textAlign: 'center', padding: '20px 0' }}>
                        {stats?.totalLeads > 0
                            ? `${Math.round((stats.convertedLeads / stats.totalLeads) * 100)}%`
                            : '—'
                        }
                    </div>
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                        {stats?.convertedLeads} of {stats?.totalLeads} leads converted
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        💸 Fee Collection Status
                    </h3>
                    <div style={{ marginTop: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                            <span>Collected</span>
                            <span style={{ fontWeight: 600, color: '#22c55e' }}>₹{Number(stats?.totalFeesCollected || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="progress-bar" style={{ height: 12, marginBottom: 12 }}>
                            <div className="progress-fill high" style={{
                                width: stats?.totalFeesCollected && stats?.totalFeesPending
                                    ? `${(stats.totalFeesCollected / (parseFloat(stats.totalFeesCollected) + parseFloat(stats.totalFeesPending))) * 100}%`
                                    : '0%'
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span>Pending</span>
                            <span style={{ fontWeight: 600, color: '#ef4444' }}>₹{Number(stats?.totalFeesPending || 0).toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
