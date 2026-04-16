import { useEffect, useState } from 'react';
import { attendanceAPI, batchAPI, syllabusAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLOR = { PRESENT: 'badge-success', ABSENT: 'badge-danger', LATE: 'badge-warning' };

export default function Attendance() {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [syllabusEntries, setSyllabusEntries] = useState([]);
    const [selectedSyllabus, setSelectedSyllabus] = useState('');
    const [batchStudents, setBatchStudents] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [summaryMode, setSummaryMode] = useState(false);
    const [summary, setSummary] = useState([]);
    const [marking, setMarking] = useState(false);

    useEffect(() => {
        batchAPI.getAll().then(r => setBatches(r.data.data || [])).catch(() => { });
    }, []);

    const loadBatchData = async (batchId) => {
        setSelectedBatch(batchId);
        setSelectedSyllabus('');
        setBatchStudents([]);
        setSyllabusEntries([]);
        if (!batchId) return;
        try {
            const syl = await syllabusAPI.getByBatch(batchId);
            setSyllabusEntries(syl.data.data || []);
        } catch (e) { toast.error('Failed to load syllabus'); }
    };

    const loadAttendance = async () => {
        if (!selectedBatch || !date) return;
        try {
            const res = await attendanceAPI.getByDate(selectedBatch, date);
            const map = {};
            (res.data.data || []).forEach(a => { map[a.studentId] = a.status; });
            setAttendanceMap(map);
        } catch (e) { }
    };

    const loadSummary = async () => {
        if (!selectedBatch) return toast.error('Select a batch first');
        try {
            const res = await attendanceAPI.batchSummary(selectedBatch);
            setSummary(res.data.data || []);
            setSummaryMode(true);
        } catch (e) { toast.error('Failed'); }
    };

    const toggleStatus = (studentId) => {
        const cycle = { PRESENT: 'ABSENT', ABSENT: 'LATE', LATE: 'PRESENT' };
        setAttendanceMap(prev => ({ ...prev, [studentId]: cycle[prev[studentId] || 'ABSENT'] || 'PRESENT' }));
    };

    const markAll = (status) => {
        const m = {};
        batchStudents.forEach(s => { m[s.studentId] = status; }); // simplified
        setAttendanceMap(m);
    };

    const submitAttendance = async () => {
        if (!selectedSyllabus) return toast.error('Select syllabus entry (topic must be COMPLETED)');
        const syl = syllabusEntries.find(s => String(s.id) === String(selectedSyllabus));
        if (!syl || syl.status !== 'COMPLETED') {
            return toast.error('🚫 BLOCKED: Topic is not marked as COMPLETED yet!');
        }
        if (Object.keys(attendanceMap).length === 0) return toast.error('No attendance data to submit');
        setMarking(true);
        try {
            const payload = {
                batchId: Number(selectedBatch),
                syllabusId: Number(selectedSyllabus),
                date,
                students: Object.entries(attendanceMap).map(([sid, status]) => ({
                    studentId: Number(sid), status
                }))
            };
            await attendanceAPI.mark(payload);
            toast.success('Attendance marked successfully!');
        } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
        finally { setMarking(false); }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Attendance</h1>
                    <p className="page-subtitle">Mark and track student attendance</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-secondary" onClick={() => setSummaryMode(!summaryMode)}>
                        {summaryMode ? '📋 Mark Mode' : '📊 Summary Mode'}
                    </button>
                    {summaryMode && selectedBatch && <button className="btn btn-primary" onClick={loadSummary}>Load Summary</button>}
                </div>
            </div>

            {/* Controls */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <label className="form-label">Batch</label>
                        <select className="form-control" value={selectedBatch} onChange={e => loadBatchData(e.target.value)}>
                            <option value="">Select Batch</option>
                            {batches.map(b => <option key={b.id} value={b.id}>{b.batchName}</option>)}
                        </select>
                    </div>
                    {!summaryMode && <>
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <label className="form-label">Syllabus Entry (Topic)</label>
                            <select className="form-control" value={selectedSyllabus} onChange={e => { setSelectedSyllabus(e.target.value); loadAttendance(); }}>
                                <option value="">Select Topic</option>
                                {syllabusEntries.map(s => (
                                    <option key={s.id} value={s.id} style={{ color: s.status !== 'COMPLETED' ? '#ef4444' : 'inherit' }}>
                                        Day {s.dayNumber} - {s.topic} [{s.status}]
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Date</label>
                            <input className="form-control" type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>
                    </>}
                </div>

                {selectedSyllabus && (() => {
                    const syl = syllabusEntries.find(s => String(s.id) === String(selectedSyllabus));
                    if (!syl) return null;
                    return (
                        <div className={`alert ${syl.status === 'COMPLETED' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: 16, marginBottom: 0 }}>
                            {syl.status === 'COMPLETED'
                                ? `✅ Topic "${syl.topic}" is COMPLETED — Attendance marking is ALLOWED`
                                : `🚫 Topic "${syl.topic}" is ${syl.status} — Attendance is BLOCKED until topic is completed`}
                        </div>
                    );
                })()}
            </div>

            {/* Summary Mode */}
            {summaryMode && summary.length > 0 && (
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', fontWeight: 700, borderBottom: '1px solid var(--border)' }}>Attendance Summary</div>
                    <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                        <table className="table">
                            <thead><tr>
                                <th>Student ID</th><th>Name</th><th>Total Days</th><th>Present</th><th>Attendance %</th>
                            </tr></thead>
                            <tbody>
                                {summary.map(s => {
                                    const pct = s.attendancePercentage;
                                    return (
                                        <tr key={s.studentId}>
                                            <td><span className="badge badge-orange">{s.studentCode}</span></td>
                                            <td style={{ fontWeight: 600 }}>{s.studentName}</td>
                                            <td>{s.totalDays}</td>
                                            <td>{s.presentDays}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div className="progress-bar" style={{ width: 80, margin: 0 }}>
                                                        <div className={`progress-fill ${pct >= 75 ? 'high' : pct >= 50 ? 'medium' : 'low'}`} style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444' }}>
                                                        {pct}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Mark Mode */}
            {!summaryMode && selectedBatch && (
                <div className="card" style={{ padding: 0 }}>
                    <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ fontWeight: 700 }}>Mark Attendance</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => markAll('PRESENT')}>All Present</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => markAll('ABSENT')}>All Absent</button>
                            <button className="btn btn-primary btn-sm" onClick={submitAttendance} disabled={marking}>
                                {marking ? 'Saving...' : '💾 Save'}
                            </button>
                        </div>
                    </div>
                    {batchStudents.length === 0 ? (
                        <div className="empty-state" style={{ padding: 40 }}>
                            <div className="empty-state-icon">👥</div>
                            <div className="empty-state-text">Select a batch to load students</div>
                            <div className="empty-state-sub">Students will appear here for attendance marking</div>
                        </div>
                    ) : (
                        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                            <table className="table">
                                <thead><tr><th>Student ID</th><th>Name</th><th>Status</th></tr></thead>
                                <tbody>
                                    {batchStudents.map(s => {
                                        const status = attendanceMap[s.id] || 'ABSENT';
                                        return (
                                            <tr key={s.id}>
                                                <td><span className="badge badge-orange">{s.studentId}</span></td>
                                                <td style={{ fontWeight: 600 }}>{s.name}</td>
                                                <td>
                                                    <button className={`badge ${STATUS_COLOR[status]}`} style={{ cursor: 'pointer', border: 'none', padding: '6px 14px' }}
                                                        onClick={() => toggleStatus(s.id)}>
                                                        {status}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
