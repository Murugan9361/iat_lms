import { useEffect, useState } from 'react';
import { leadAPI, userAPI } from '../services/api';
import toast from 'react-hot-toast';

const SOURCE_BADGES = {
    INSTAGRAM: 'badge-purple', WALK_IN: 'badge-info',
    FACEBOOK: 'badge-info', WEBSITE: 'badge-success',
    REFERRAL: 'badge-orange', OTHER: 'badge-warning',
};
const STATUS_BADGES = {
    NEW: 'badge-info', ASSIGNED: 'badge-orange', INTERESTED: 'badge-success',
    FOLLOW_UP: 'badge-warning', CONVERTED: 'badge-success', LOST: 'badge-danger',
};

function AssignModal({ lead, salesEmployees, onAssign, onClose }) {
    const [empId, setEmpId] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); onAssign(lead.id, empId); };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Assign Lead: {lead.name}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Select Sales Employee</label>
                            <select className="form-control" value={empId} onChange={e => setEmpId(e.target.value)} required>
                                <option value="">-- Select Employee --</option>
                                {salesEmployees.map(e => <option key={e.id} value={e.id}>{e.name} ({e.email})</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Assign</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function AddLeadModal({ onAdd, onClose }) {
    const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'WALK_IN', courseInterest: '', notes: '' });
    const handleSubmit = (e) => { e.preventDefault(); onAdd(form); };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Add New Lead</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Full Name *</label>
                                <input className="form-control" placeholder="John Doe" value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone *</label>
                                <input className="form-control" placeholder="9876543210" value={form.phone}
                                    onChange={e => setForm({ ...form, phone: e.target.value })} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input className="form-control" type="email" placeholder="john@example.com" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Source</label>
                                <select className="form-control" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                                    {['INSTAGRAM', 'WALK_IN', 'FACEBOOK', 'WEBSITE', 'REFERRAL', 'OTHER'].map(s =>
                                        <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Course Interest</label>
                                <input className="form-control" placeholder="e.g. Full Stack" value={form.courseInterest}
                                    onChange={e => setForm({ ...form, courseInterest: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Notes</label>
                            <textarea className="form-control" rows={3} placeholder="Any additional notes..."
                                value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Add Lead</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Leads() {
    const [leads, setLeads] = useState([]);
    const [salesEmployees, setSalesEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showAdd, setShowAdd] = useState(false);
    const [assignLead, setAssignLead] = useState(null);

    const fetchLeads = () => {
        leadAPI.getAll().then(r => setLeads(r.data.data || [])).catch(() => toast.error('Failed to load leads')).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchLeads();
        userAPI.getByRole('SALES_EMPLOYEE').then(r => setSalesEmployees(r.data.data || [])).catch(() => { });
    }, []);

    const handleAdd = async (form) => {
        try { await leadAPI.create(form); toast.success('Lead added!'); setShowAdd(false); fetchLeads(); }
        catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    };

    const handleAssign = async (leadId, empId) => {
        try { await leadAPI.assign(leadId, { salesEmployeeId: Number(empId) }); toast.success('Lead assigned!'); setAssignLead(null); fetchLeads(); }
        catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    };

    const handleStatusChange = async (leadId, status) => {
        try { await leadAPI.updateStatus(leadId, { status }); toast.success('Status updated!'); fetchLeads(); }
        catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    };

    const filtered = leads.filter(l =>
        (statusFilter === 'ALL' || l.status === statusFilter) &&
        (l.name?.toLowerCase().includes(search.toLowerCase()) ||
            l.phone?.includes(search) || l.email?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Lead Management</h1>
                    <p className="page-subtitle">{leads.length} total leads tracked</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}>➕ Add Lead</button>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="search-bar">
                        <span>🔍</span>
                        <input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="tabs" style={{ margin: 0, background: 'none', gap: 6 }}>
                        {['ALL', 'NEW', 'ASSIGNED', 'INTERESTED', 'FOLLOW_UP', 'CONVERTED', 'LOST'].map(s =>
                            <button key={s} className={`tab ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
                                {s}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                {loading ? <div className="loading-center"><div className="spinner" /></div>
                    : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🎯</div>
                            <div className="empty-state-text">No leads found</div>
                            <div className="empty-state-sub">Add your first lead to get started</div>
                        </div>
                    ) : (
                        <div className="table-container" style={{ borderRadius: 16, border: 'none' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th><th>Contact</th><th>Source</th>
                                        <th>Course</th><th>Assigned To</th><th>Status</th><th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(lead => (
                                        <tr key={lead.id}>
                                            <td><div style={{ fontWeight: 600 }}>{lead.name}</div></td>
                                            <td>
                                                <div style={{ fontSize: 13 }}>{lead.phone}</div>
                                                {lead.email && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lead.email}</div>}
                                            </td>
                                            <td><span className={`badge ${SOURCE_BADGES[lead.source] || 'badge-info'}`}>{lead.source}</span></td>
                                            <td style={{ fontSize: 13 }}>{lead.courseInterest || '—'}</td>
                                            <td style={{ fontSize: 13 }}>{lead.assignedTo || <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}</td>
                                            <td><span className={`badge ${STATUS_BADGES[lead.status] || 'badge-info'}`}>{lead.status}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => setAssignLead(lead)}>Assign</button>
                                                    <select className="form-control" style={{ padding: '4px 8px', fontSize: 12, width: 'auto', height: 30 }}
                                                        value={lead.status} onChange={e => handleStatusChange(lead.id, e.target.value)}>
                                                        {['NEW', 'ASSIGNED', 'INTERESTED', 'FOLLOW_UP', 'CONVERTED', 'LOST'].map(s => <option key={s}>{s}</option>)}
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>

            {showAdd && <AddLeadModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />}
            {assignLead && <AssignModal lead={assignLead} salesEmployees={salesEmployees}
                onAssign={handleAssign} onClose={() => setAssignLead(null)} />}
        </div>
    );
}
