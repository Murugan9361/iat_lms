import { useEffect, useState } from 'react';
import { batchAPI, syllabusAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_BADGES = { PENDING: 'badge-warning', COMPLETED: 'badge-success', SKIPPED: 'badge-danger' };

export default function Syllabus() {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [syllabus, setSyllabus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        batchAPI.getAll().then(r => setBatches(r.data.data || [])).catch(() => { });
    }, []);

    const loadSyllabus = (batchId) => {
        setLoading(true);
        syllabusAPI.getByBatch(batchId)
            .then(r => setSyllabus(r.data.data || []))
            .catch(() => toast.error('Failed to load syllabus'))
            .finally(() => setLoading(false));
    };

    const handleBatchChange = (id) => {
        setSelectedBatch(id);
        if (id) loadSyllabus(id);
        else setSyllabus([]);
    };

    const generateSyllabus = async () => {
        if (!selectedBatch) return toast.error('Select a batch first');
        setGenerating(true);
        try {
            await syllabusAPI.generate(selectedBatch);
            toast.success('Syllabus generated!');
            loadSyllabus(selectedBatch);
        } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
        finally { setGenerating(false); }
    };

    const updateStatus = async (syllabusId, status) => {
        try {
            await syllabusAPI.updateStatus(syllabusId, { status });
            toast.success('Status updated!');
            loadSyllabus(selectedBatch);
        } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    };

    const updateTopic = async (syllabusId, topic) => {
        try {
            await syllabusAPI.updateTopic(syllabusId, { topic });
            toast.success('Topic updated!');
        } catch (e) { toast.error('Failed'); }
    };

    const batch = batches.find(b => String(b.id) === String(selectedBatch));
    const completed = syllabus.filter(s => s.status === 'COMPLETED').length;
    const pct = syllabus.length > 0 ? Math.round((completed / syllabus.length) * 100) : 0;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Syllabus Management</h1>
                    <p className="page-subtitle">Dynamic scheduling with weekday/weekend logic</p>
                </div>
                {selectedBatch && (
                    <button className="btn btn-primary" onClick={generateSyllabus} disabled={generating}>
                        {generating ? '⏳ Generating...' : '⚡ Generate Syllabus'}
                    </button>
                )}
            </div>

            {/* Batch selector */}
            <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <label className="form-label">Select Batch</label>
                    <select className="form-control" value={selectedBatch} onChange={e => handleBatchChange(e.target.value)}>
                        <option value="">-- Select a Batch --</option>
                        {batches.map(b => <option key={b.id} value={b.id}>{b.batchName} ({b.batchType})</option>)}
                    </select>
                </div>
                {batch && (
                    <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                        <span className={`badge ${batch.batchType === 'WEEKDAY' ? 'badge-info' : 'badge-purple'}`}>{batch.batchType}</span>
                        <span style={{ color: 'var(--text-muted)' }}>📅 {batch.startDate} → {batch.endDate}</span>
                    </div>
                )}
            </div>

            {selectedBatch && syllabus.length > 0 && (
                <div className="card" style={{ marginBottom: 20, display: 'flex', gap: 24, alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--primary)' }}>{pct}%</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Complete</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                            <span>{completed} of {syllabus.length} topics completed</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{syllabus.length - completed} remaining</span>
                        </div>
                        <div className="progress-bar" style={{ height: 10 }}>
                            <div className="progress-fill high" style={{ width: `${pct}%` }} />
                        </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {batch?.batchType === 'WEEKDAY' ? '⏱ 1.5h/day • Mon–Fri' : '⏱ 3h/day • Sat–Sun'}
                    </div>
                </div>
            )}

            {loading ? <div className="loading-center"><div className="spinner" /></div>
                : syllabus.length === 0 && selectedBatch ? (
                    <div className="empty-state card">
                        <div className="empty-state-icon">📋</div>
                        <div className="empty-state-text">No syllabus yet</div>
                        <div className="empty-state-sub">Click "Generate Syllabus" to auto-schedule based on batch type</div>
                    </div>
                ) : syllabus.length > 0 ? (
                    <div className="card" style={{ padding: 0 }}>
                        <div className="table-container" style={{ borderRadius: 16, border: 'none' }}>
                            <table className="table">
                                <thead><tr>
                                    <th>Day</th><th>Date</th><th>Day of Week</th><th>Topic</th><th>Status</th><th>Action</th>
                                </tr></thead>
                                <tbody>
                                    {syllabus.map(s => {
                                        const d = new Date(s.date);
                                        const dayName = d.toLocaleDateString('en-IN', { weekday: 'long' });
                                        return (
                                            <tr key={s.id} style={s.status === 'COMPLETED' ? { background: 'rgba(34,197,94,0.05)' } : {}}>
                                                <td><strong style={{ color: 'var(--primary)' }}>#{s.dayNumber}</strong></td>
                                                <td style={{ fontSize: 13 }}>{s.date}</td>
                                                <td><span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>{dayName}</span></td>
                                                <td>
                                                    <input style={{
                                                        background: 'none', border: 'none', outline: 'none', width: '100%',
                                                        fontSize: 13, color: 'var(--text-primary)', fontFamily: 'inherit'
                                                    }}
                                                        defaultValue={s.topic}
                                                        onBlur={e => { if (e.target.value !== s.topic) updateTopic(s.id, e.target.value); }}
                                                    />
                                                </td>
                                                <td><span className={`badge ${STATUS_BADGES[s.status]}`}>{s.status}</span></td>
                                                <td>
                                                    <select className="form-control" style={{ padding: '4px 8px', fontSize: 12, width: 'auto', height: 30 }}
                                                        value={s.status} onChange={e => updateStatus(s.id, e.target.value)}>
                                                        <option>PENDING</option>
                                                        <option>COMPLETED</option>
                                                        <option>SKIPPED</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="empty-state card">
                        <div className="empty-state-icon">📋</div>
                        <div className="empty-state-text">Select a batch to view syllabus</div>
                    </div>
                )}
        </div>
    );
}
