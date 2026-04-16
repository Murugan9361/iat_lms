import { useEffect, useState } from 'react';
import { studentAPI } from '../services/api';
import toast from 'react-hot-toast';

function EnrollModal({ onEnroll, onClose }) {
    const [form, setForm] = useState({
        name: '', email: '', password: '', phone: '', leadId: '',
        dob: '', gender: 'MALE', aadharNumber: '',
        addressLine1: '', city: '', state: '', pincode: '',
        emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '',
        enrollmentDate: new Date().toISOString().split('T')[0]
    });
    const [tab, setTab] = useState(0);
    const tabs = ['Personal', 'Address', 'Emergency', 'Enrollment'];

    const handleSubmit = (e) => { e.preventDefault(); onEnroll(form); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Enroll New Student</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="tabs" style={{ margin: '16px 28px 0', padding: '4px' }}>
                    {tabs.map((t, i) => <button key={t} className={`tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>)}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {tab === 0 && <>
                            <div className="grid grid-2">
                                <div className="form-group"><label className="form-label">Full Name *</label>
                                    <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                                <div className="form-group"><label className="form-label">Email *</label>
                                    <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
                            </div>
                            <div className="grid grid-2">
                                <div className="form-group"><label className="form-label">Password *</label>
                                    <input className="form-control" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div>
                                <div className="form-group"><label className="form-label">Phone</label>
                                    <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                            </div>
                            <div className="grid grid-2">
                                <div className="form-group"><label className="form-label">Date of Birth</label>
                                    <input className="form-control" type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>
                                <div className="form-group"><label className="form-label">Gender</label>
                                    <select className="form-control" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                                        <option>MALE</option><option>FEMALE</option><option>OTHER</option>
                                    </select></div>
                            </div>
                            <div className="form-group"><label className="form-label">Aadhar Number</label>
                                <input className="form-control" placeholder="12-digit Aadhar" maxLength={12} value={form.aadharNumber}
                                    onChange={e => setForm({ ...form, aadharNumber: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Lead ID (if converting from lead)</label>
                                <input className="form-control" type="number" placeholder="Optional" value={form.leadId}
                                    onChange={e => setForm({ ...form, leadId: e.target.value })} /></div>
                        </>}
                        {tab === 1 && <>
                            <div className="form-group"><label className="form-label">Address Line 1</label>
                                <input className="form-control" value={form.addressLine1} onChange={e => setForm({ ...form, addressLine1: e.target.value })} /></div>
                            <div className="grid grid-2">
                                <div className="form-group"><label className="form-label">City</label>
                                    <input className="form-control" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
                                <div className="form-group"><label className="form-label">State</label>
                                    <input className="form-control" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} /></div>
                            </div>
                            <div className="form-group"><label className="form-label">Pincode</label>
                                <input className="form-control" maxLength={6} value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} /></div>
                        </>}
                        {tab === 2 && <>
                            <div className="form-group"><label className="form-label">Contact Name</label>
                                <input className="form-control" value={form.emergencyContactName} onChange={e => setForm({ ...form, emergencyContactName: e.target.value })} /></div>
                            <div className="grid grid-2">
                                <div className="form-group"><label className="form-label">Phone</label>
                                    <input className="form-control" value={form.emergencyContactPhone} onChange={e => setForm({ ...form, emergencyContactPhone: e.target.value })} /></div>
                                <div className="form-group"><label className="form-label">Relation</label>
                                    <input className="form-control" placeholder="e.g. Father" value={form.emergencyContactRelation}
                                        onChange={e => setForm({ ...form, emergencyContactRelation: e.target.value })} /></div>
                            </div>
                        </>}
                        {tab === 3 && <>
                            <div className="form-group"><label className="form-label">Enrollment Date</label>
                                <input className="form-control" type="date" value={form.enrollmentDate} onChange={e => setForm({ ...form, enrollmentDate: e.target.value })} /></div>
                            <div className="form-group"><label className="form-label">Terms & Conditions</label>
                                <textarea className="form-control" rows={4}
                                    defaultValue="I agree to abide by the institute rules and pay fees on time."
                                    onChange={e => setForm({ ...form, enrollmentTerms: e.target.value })} /></div>
                        </>}
                    </div>
                    <div className="modal-footer">
                        {tab > 0 && <button type="button" className="btn btn-secondary" onClick={() => setTab(tab - 1)}>← Back</button>}
                        {tab < tabs.length - 1 && <button type="button" className="btn btn-primary" onClick={() => setTab(tab + 1)}>Next →</button>}
                        {tab === tabs.length - 1 && <button type="submit" className="btn btn-primary">✅ Enroll Student</button>}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showEnroll, setShowEnroll] = useState(false);

    const fetchStudents = () => {
        studentAPI.getAll().then(r => setStudents(r.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
    };

    useEffect(() => { fetchStudents(); }, []);

    const handleEnroll = async (form) => {
        try {
            const payload = { ...form, leadId: form.leadId ? Number(form.leadId) : null };
            await studentAPI.enroll(payload);
            toast.success('Student enrolled successfully!');
            setShowEnroll(false); fetchStudents();
        } catch (e) { toast.error(e.response?.data?.message || 'Enrollment failed'); }
    };

    const filtered = students.filter(s =>
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Students</h1>
                    <p className="page-subtitle">{students.length} students enrolled</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowEnroll(true)}>➕ Enroll Student</button>
            </div>

            <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
                <div className="search-bar">
                    <span>🔍</span>
                    <input placeholder="Search by name, ID or email..." value={search} onChange={e => setSearch(e.target.value)}
                        style={{ width: 300 }} />
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                {loading ? <div className="loading-center"><div className="spinner" /></div>
                    : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🎓</div>
                            <div className="empty-state-text">No students found</div>
                        </div>
                    ) : (
                        <div className="table-container" style={{ borderRadius: 16, border: 'none' }}>
                            <table className="table">
                                <thead><tr>
                                    <th>Student ID</th><th>Name</th><th>Email</th><th>Phone</th>
                                    <th>City</th><th>Enrolled On</th><th>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {filtered.map(s => (
                                        <tr key={s.id}>
                                            <td><span className="badge badge-orange" style={{ fontSize: 12 }}>{s.studentId}</span></td>
                                            <td><div style={{ fontWeight: 600 }}>{s.name}</div></td>
                                            <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.email}</td>
                                            <td style={{ fontSize: 13 }}>{s.phone || '—'}</td>
                                            <td style={{ fontSize: 13 }}>{s.city || '—'}</td>
                                            <td style={{ fontSize: 13 }}>{s.enrollmentDate || '—'}</td>
                                            <td><button className="btn btn-secondary btn-sm">View</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>

            {showEnroll && <EnrollModal onEnroll={handleEnroll} onClose={() => setShowEnroll(false)} />}
        </div>
    );
}
