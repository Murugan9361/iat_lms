import { useEffect, useState } from 'react';
import { placementAPI, studentAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_BADGES = { PASSED: 'badge-success', IN_PROCESS: 'badge-warning', REJECTED: 'badge-danger' };

function PlacementModal({ onClose, onSave }) {
    const [students, setStudents] = useState([]);
    const [form, setForm] = useState({
        studentId: '', companyName: '', position: '', interviewDate: '',
        resultStatus: 'IN_PROCESS', packageLpa: '', feedback: ''
    });

    useEffect(() => {
        studentAPI.getAll().then(r => setStudents(r.data.data || [])).catch(() => { });
    }, []);

    const handleSubmit = (e) => { e.preventDefault(); onSave({ ...form, studentId: Number(form.studentId), packageLpa: form.packageLpa ? Number(form.packageLpa) : null }); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Add Interview Result</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Student *</label>
                            <select className="form-control" value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} required>
                                <option value="">Select Student</option>
                                {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
                            </select>
                        </div>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Company *</label>
                                <input className="form-control" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Position</label>
                                <input className="form-control" placeholder="e.g. Java Developer" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Interview Date</label>
                                <input className="form-control" type="date" value={form.interviewDate} onChange={e => setForm({ ...form, interviewDate: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Result *</label>
                                <select className="form-control" value={form.resultStatus} onChange={e => setForm({ ...form, resultStatus: e.target.value })}>
                                    <option>PASSED</option><option>IN_PROCESS</option><option>REJECTED</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Package (LPA)</label>
                            <input className="form-control" type="number" step="0.1" placeholder="e.g. 4.5" value={form.packageLpa} onChange={e => setForm({ ...form, packageLpa: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Feedback / Notes</label>
                            <textarea className="form-control" rows={3} value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Result</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Placements() {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchPlacements = () => {
        placementAPI.getAll().then(r => setPlacements(r.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
    };
    useEffect(() => { fetchPlacements(); }, []);

    const handleSave = async (form) => {
        try { await placementAPI.add(form); toast.success('Placement result added!'); setShowModal(false); fetchPlacements(); }
        catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    };

    const passed = placements.filter(p => p.resultStatus === 'PASSED');
    const inProcess = placements.filter(p => p.resultStatus === 'IN_PROCESS');
    const rejected = placements.filter(p => p.resultStatus === 'REJECTED');

    const filtered = placements.filter(p => statusFilter === 'ALL' || p.resultStatus === statusFilter);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Placement Tracking</h1>
                    <p className="page-subtitle">Monitor student interview outcomes</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ Add Interview Result</button>
            </div>

            <div className="grid grid-3" style={{ marginBottom: 24 }}>
                <div className="stat-card" onClick={() => setStatusFilter('PASSED')} style={{ cursor: 'pointer', borderLeft: '4px solid #22c55e' }}>
                    <div className="stat-icon" style={{ background: '#22c55e20' }}><span style={{ fontSize: 22 }}>✅</span></div>
                    <div><div className="stat-label">Placed</div><div className="stat-value" style={{ color: '#22c55e' }}>{passed.length}</div></div>
                </div>
                <div className="stat-card" onClick={() => setStatusFilter('IN_PROCESS')} style={{ cursor: 'pointer', borderLeft: '4px solid #f59e0b' }}>
                    <div className="stat-icon" style={{ background: '#f59e0b20' }}><span style={{ fontSize: 22 }}>⏳</span></div>
                    <div><div className="stat-label">In Process</div><div className="stat-value" style={{ color: '#f59e0b' }}>{inProcess.length}</div></div>
                </div>
                <div className="stat-card" onClick={() => setStatusFilter('REJECTED')} style={{ cursor: 'pointer', borderLeft: '4px solid #ef4444' }}>
                    <div className="stat-icon" style={{ background: '#ef444420' }}><span style={{ fontSize: 22 }}>❌</span></div>
                    <div><div className="stat-label">Rejected</div><div className="stat-value" style={{ color: '#ef4444' }}>{rejected.length}</div></div>
                </div>
            </div>

            <div className="tabs">
                {['ALL', 'PASSED', 'IN_PROCESS', 'REJECTED'].map(s =>
                    <button key={s} className={`tab ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>{s}</button>)}
            </div>

            <div className="card" style={{ padding: 0 }}>
                {loading ? <div className="loading-center"><div className="spinner" /></div>
                    : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🏢</div>
                            <div className="empty-state-text">No placement records</div>
                        </div>
                    ) : (
                        <div className="table-container" style={{ border: 'none', borderRadius: 16 }}>
                            <table className="table">
                                <thead><tr>
                                    <th>Student</th><th>Company</th><th>Position</th>
                                    <th>Interview Date</th><th>Package</th><th>Status</th>
                                </tr></thead>
                                <tbody>
                                    {filtered.map(p => (
                                        <tr key={p.id}>
                                            <td style={{ fontWeight: 600 }}>{p.studentName || `Student #${p.studentId}`}</td>
                                            <td>{p.companyName || '—'}</td>
                                            <td style={{ fontSize: 13 }}>{p.position || '—'}</td>
                                            <td style={{ fontSize: 13 }}>{p.interviewDate || '—'}</td>
                                            <td style={{ fontWeight: 600, color: '#22c55e' }}>{p.packageLpa ? `${p.packageLpa} LPA` : '—'}</td>
                                            <td><span className={`badge ${STATUS_BADGES[p.resultStatus]}`}>{p.resultStatus}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>

            {showModal && <PlacementModal onClose={() => setShowModal(false)} onSave={handleSave} />}
        </div>
    );
}
