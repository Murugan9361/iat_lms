import { useEffect, useState } from 'react';
import { leadAPI, studentAPI, batchAPI, paymentAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Reports() {
    const [tab, setTab] = useState('leads');
    const [leads, setLeads] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            leadAPI.getAll().then(r => setLeads(r.data.data || [])),
            studentAPI.getAll().then(r => setStudents(r.data.data || [])),
        ]).catch(() => toast.error('Failed')).finally(() => setLoading(false));
    }, []);

    const exportCSV = (data, filename) => {
        if (!data.length) return toast.error('No data to export');
        const keys = Object.keys(data[0]);
        const csv = [keys.join(','), ...data.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click();
        toast.success('CSV downloaded!');
    };

    const leadStats = {
        total: leads.length,
        bySource: leads.reduce((acc, l) => ({ ...acc, [l.source]: (acc[l.source] || 0) + 1 }), {}),
        byStatus: leads.reduce((acc, l) => ({ ...acc, [l.status]: (acc[l.status] || 0) + 1 }), {}),
        conversionRate: leads.length ? Math.round((leads.filter(l => l.status === 'CONVERTED').length / leads.length) * 100) : 0
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Comprehensive institute performance data</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={() => exportCSV(leads, 'leads_report')}>📥 Export Leads CSV</button>
                    <button className="btn btn-primary" onClick={() => exportCSV(students, 'students_report')}>📥 Export Students CSV</button>
                </div>
            </div>

            <div className="tabs">
                {[{ id: 'leads', label: '📊 Leads' }, { id: 'students', label: '🎓 Students' }, { id: 'fees', label: '💰 Fees' }].map(t =>
                    <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
            </div>

            {loading ? <div className="loading-center"><div className="spinner" /></div> : <>

                {tab === 'leads' && (
                    <div>
                        <div className="grid grid-4" style={{ marginBottom: 24 }}>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#6366f120' }}><span>🎯</span></div>
                                <div><div className="stat-label">Total Leads</div><div className="stat-value">{leadStats.total}</div></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#22c55e20' }}><span>✅</span></div>
                                <div><div className="stat-label">Converted</div><div className="stat-value" style={{ color: '#22c55e' }}>{leadStats.byStatus?.CONVERTED || 0}</div></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#f97316' + '20' }}><span>📈</span></div>
                                <div><div className="stat-label">Conversion Rate</div><div className="stat-value">{leadStats.conversionRate}%</div></div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon" style={{ background: '#f59e0b20' }}><span>⏳</span></div>
                                <div><div className="stat-label">Follow-ups</div><div className="stat-value">{leadStats.byStatus?.FOLLOW_UP || 0}</div></div>
                            </div>
                        </div>

                        <div className="grid grid-2">
                            <div className="card">
                                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Leads by Source</h3>
                                {Object.entries(leadStats.bySource).map(([src, count]) => (
                                    <div key={src} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <span style={{ fontSize: 13 }}>{src}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 120, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${(count / leadStats.total) * 100}%`, background: 'var(--primary)', borderRadius: 4 }} />
                                            </div>
                                            <span style={{ fontWeight: 700, fontSize: 13, minWidth: 24 }}>{count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="card">
                                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Leads by Status</h3>
                                {Object.entries(leadStats.byStatus).map(([status, count]) => (
                                    <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <span style={{ fontSize: 13 }}>{status}</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 120, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${(count / leadStats.total) * 100}%`, background: 'var(--primary)', borderRadius: 4 }} />
                                            </div>
                                            <span style={{ fontWeight: 700, fontSize: 13, minWidth: 24 }}>{count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'students' && (
                    <div className="card" style={{ padding: 0 }}>
                        <div className="table-container" style={{ border: 'none', borderRadius: 16 }}>
                            <table className="table">
                                <thead><tr><th>Student ID</th><th>Name</th><th>Email</th><th>City</th><th>Enrolled On</th></tr></thead>
                                <tbody>
                                    {students.map(s => (
                                        <tr key={s.id}>
                                            <td><span className="badge badge-orange">{s.studentId}</span></td>
                                            <td style={{ fontWeight: 600 }}>{s.name}</td>
                                            <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.email}</td>
                                            <td style={{ fontSize: 13 }}>{s.city || '—'}</td>
                                            <td style={{ fontSize: 13 }}>{s.enrollmentDate || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === 'fees' && (
                    <div className="card">
                        <div className="empty-state">
                            <div className="empty-state-icon">💰</div>
                            <div className="empty-state-text">Fee reports</div>
                            <div className="empty-state-sub">Select students and batches to generate fee reports</div>
                        </div>
                    </div>
                )}
            </>}
        </div>
    );
}
