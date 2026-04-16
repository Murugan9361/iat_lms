import { useEffect, useState } from 'react';
import { batchAPI, courseAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';

function CreateBatchModal({ onClose, onCreate }) {
    const [courses, setCourses] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [form, setForm] = useState({
        batchName: '', courseId: '', trainerId: '', batchType: 'WEEKDAY',
        timing: '', startDate: '', endDate: ''
    });

    useEffect(() => {
        courseAPI.getAll().then(r => setCourses(r.data.data || [])).catch(() => { });
        userAPI.getByRole('TRAINER').then(r => setTrainers(r.data.data || [])).catch(() => { });
    }, []);

    const handleSubmit = (e) => { e.preventDefault(); onCreate(form); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Create New Batch</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Batch Name *</label>
                            <input className="form-control" placeholder="e.g. Java Batch Aug 2024" value={form.batchName}
                                onChange={e => setForm({ ...form, batchName: e.target.value })} required />
                        </div>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Course *</label>
                                <select className="form-control" value={form.courseId}
                                    onChange={e => setForm({ ...form, courseId: e.target.value })} required>
                                    <option value="">Select Course</option>
                                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Trainer</label>
                                <select className="form-control" value={form.trainerId}
                                    onChange={e => setForm({ ...form, trainerId: e.target.value })}>
                                    <option value="">Select Trainer</option>
                                    {trainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Batch Type *</label>
                                <select className="form-control" value={form.batchType}
                                    onChange={e => setForm({ ...form, batchType: e.target.value })}>
                                    <option value="WEEKDAY">📅 Weekday (Mon–Fri, 1.5h/day)</option>
                                    <option value="WEEKEND">🗓️ Weekend (Sat–Sun, 3h/day)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Timing</label>
                                <input className="form-control" placeholder="e.g. 10:00 AM – 11:30 AM" value={form.timing}
                                    onChange={e => setForm({ ...form, timing: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Start Date *</label>
                                <input className="form-control" type="date" value={form.startDate}
                                    onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">End Date *</label>
                                <input className="form-control" type="date" value={form.endDate}
                                    onChange={e => setForm({ ...form, endDate: e.target.value })} required />
                            </div>
                        </div>
                        <div className="alert alert-warning" style={{ marginBottom: 0 }}>
                            💡 After creating the batch, use <strong>Generate Syllabus</strong> to auto-schedule topics based on batch type.
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Create Batch</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Batches() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [filter, setFilter] = useState('ALL');

    const fetchBatches = () => {
        batchAPI.getAll()
            .then(r => setBatches(r.data.data || []))
            .catch(() => toast.error('Failed to load batches'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchBatches(); }, []);

    const handleCreate = async (form) => {
        try {
            const payload = {
                ...form,
                courseId: Number(form.courseId),
                trainerId: form.trainerId ? Number(form.trainerId) : null
            };
            await batchAPI.create(payload);
            toast.success('Batch created! Go to Syllabus → Generate Syllabus.');
            setShowCreate(false);
            fetchBatches();
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to create batch');
        }
    };

    const filtered = batches.filter(b => filter === 'ALL' || b.batchType === filter);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Batch Management</h1>
                    <p className="page-subtitle">{batches.length} batches • {batches.filter(b => b.isActive).length} active</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>➕ Create Batch</button>
            </div>

            <div className="tabs">
                {['ALL', 'WEEKDAY', 'WEEKEND'].map(t => (
                    <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>
                        {t === 'WEEKDAY' ? '📅 Weekday' : t === 'WEEKEND' ? '🗓️ Weekend' : '📚 All'}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="loading-center"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">📚</div>
                    <div className="empty-state-text">No batches found</div>
                    <div className="empty-state-sub">Create your first batch to get started</div>
                </div>
            ) : (
                <div className="grid grid-2">
                    {filtered.map(batch => (
                        <div key={batch.id} className="card" style={{ borderTop: `3px solid ${batch.batchType === 'WEEKDAY' ? '#3b82f6' : '#8b5cf6'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                                <div>
                                    <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{batch.batchName}</h3>
                                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{batch.courseName || 'No Course Assigned'}</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                                    <span className={`badge ${batch.isActive ? 'badge-success' : 'badge-danger'}`}>
                                        {batch.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className={`badge ${batch.batchType === 'WEEKDAY' ? 'badge-info' : 'badge-purple'}`}>
                                        {batch.batchType}
                                    </span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', fontSize: 13 }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Trainer: </span>
                                    <strong>{batch.trainerName || 'Not Assigned'}</strong>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Students: </span>
                                    <strong style={{ color: 'var(--primary)' }}>{batch.studentCount}</strong>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>Start: </span>
                                    <strong>{batch.startDate}</strong>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)' }}>End: </span>
                                    <strong>{batch.endDate}</strong>
                                </div>
                                {batch.timing && (
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>⏱ Timing: </span>
                                        <strong>{batch.timing}</strong>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
                                <button className="btn btn-secondary btn-sm">👁 View Students</button>
                                <button className="btn btn-primary btn-sm">📋 Syllabus</button>
                                <button className="btn btn-secondary btn-sm">✅ Attendance</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showCreate && (
                <CreateBatchModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
            )}
        </div>
    );
}
