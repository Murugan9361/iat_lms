import { useEffect, useState } from 'react';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

const ROLES = ['SUPER_ADMIN', 'SEO', 'SALES_HEAD', 'SALES_EMPLOYEE', 'TRAINER_HEAD', 'TRAINER', 'HR', 'PLACEMENT_HR', 'STUDENT'];

function UserModal({ roles, onSave, onClose, editUser }) {
    const [form, setForm] = useState(editUser
        ? { name: editUser.name, phone: editUser.phone || '', isActive: editUser.isActive, roleId: '' }
        : { name: '', email: '', password: '', phone: '', roleId: '' }
    );

    const handleSubmit = (e) => { e.preventDefault(); onSave(form); };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{editUser ? 'Edit User' : 'Create New User'}</h3>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group">
                            <label className="form-label">Full Name *</label>
                            <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        {!editUser && <>
                            <div className="form-group">
                                <label className="form-label">Email *</label>
                                <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password * (min 6 chars)</label>
                                <input className="form-control" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                            </div>
                        </>}
                        <div className="grid grid-2">
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Role *</label>
                                <select className="form-control" value={form.roleId} onChange={e => setForm({ ...form, roleId: e.target.value })} required={!editUser}>
                                    <option value="">Select Role</option>
                                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                        </div>
                        {editUser && (
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-control" value={String(form.isActive)} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{editUser ? 'Update' : 'Create'} User</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function Users() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const fetchUsers = () => {
        userAPI.getAll().then(r => setUsers(r.data.data || [])).catch(() => toast.error('Failed')).finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
        // Load roles from API (simplified: use hardcoded for display)
        setRoles([{ id: 1, name: 'ADMIN' }, { id: 2, name: 'SUPER_ADMIN' }, { id: 3, name: 'SEO' },
        { id: 4, name: 'SALES_HEAD' }, { id: 5, name: 'SALES_EMPLOYEE' }, { id: 6, name: 'TRAINER_HEAD' },
        { id: 7, name: 'TRAINER' }, { id: 8, name: 'HR' }, { id: 9, name: 'PLACEMENT_HR' }, { id: 10, name: 'STUDENT' }]);
    }, []);

    const handleSave = async (form) => {
        try {
            if (editUser) {
                await userAPI.update(editUser.id, form);
                toast.success('User updated!');
            } else {
                await userAPI.create({ ...form, roleId: Number(form.roleId) });
                toast.success('User created!');
            }
            setShowModal(false); setEditUser(null); fetchUsers();
        } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Deactivate this user?')) return;
        try { await userAPI.delete(id); toast.success('User deactivated'); fetchUsers(); }
        catch (e) { toast.error('Failed'); }
    };

    const ROLE_BADGE = {
        ADMIN: 'badge-danger', SUPER_ADMIN: 'badge-danger', SEO: 'badge-purple',
        SALES_HEAD: 'badge-orange', SALES_EMPLOYEE: 'badge-warning', TRAINER_HEAD: 'badge-info',
        TRAINER: 'badge-info', HR: 'badge-success', PLACEMENT_HR: 'badge-success', STUDENT: 'badge-info'
    };

    const filtered = users.filter(u =>
        (roleFilter === 'ALL' || u.role === roleFilter) &&
        (u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">{users.length} users registered</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setEditUser(null); setShowModal(true); }}>➕ Create User</button>
            </div>

            <div className="card" style={{ marginBottom: 20, padding: '14px 20px' }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="search-bar">
                        <span>🔍</span>
                        <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
                    </div>
                    <select className="form-control" style={{ width: 'auto' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                        <option value="ALL">All Roles</option>
                        {['ADMIN', 'SUPER_ADMIN', 'SEO', 'SALES_HEAD', 'SALES_EMPLOYEE', 'TRAINER_HEAD', 'TRAINER', 'HR', 'PLACEMENT_HR', 'STUDENT'].map(r =>
                            <option key={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                {loading ? <div className="loading-center"><div className="spinner" /></div>
                    : filtered.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">👥</div>
                            <div className="empty-state-text">No users found</div>
                        </div>
                    ) : (
                        <div className="table-container" style={{ border: 'none', borderRadius: 16 }}>
                            <table className="table">
                                <thead><tr>
                                    <th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {filtered.map(u => (
                                        <tr key={u.id}>
                                            <td><div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0
                                                }}>
                                                    {u.name?.charAt(0).toUpperCase()}
                                                </div>
                                                {u.name}
                                            </div></td>
                                            <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{u.email}</td>
                                            <td style={{ fontSize: 13 }}>{u.phone || '—'}</td>
                                            <td><span className={`badge ${ROLE_BADGE[u.role] || 'badge-info'}`}>{u.role}</span></td>
                                            <td>
                                                <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                    <span className={`status-dot ${u.isActive ? 'active' : 'inactive'}`} />
                                                    {u.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditUser(u); setShowModal(true); }}>✏️ Edit</button>
                                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u.id)}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
            </div>

            {showModal && <UserModal roles={roles} onSave={handleSave} onClose={() => { setShowModal(false); setEditUser(null); }} editUser={editUser} />}
        </div>
    );
}
