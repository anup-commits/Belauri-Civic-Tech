/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldAlert, AlertTriangle, Trash2, Loader2, Save, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPanel() {
  const { profile } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ status: '', resolution_note: '', assigned_to: '' });

  // Strictly enforce admin/volunteer view only (handled by Route wrapper potentially, but double check here)
  useEffect(() => {
    if (profile && (profile.role === 'admin' || profile.role === 'volunteer')) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsData, volunteersData] = await Promise.all([
        supabase.from('reports').select('*, assigned_to:profiles!assigned_to(full_name)').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id, full_name, email, role').in('role', ['admin', 'volunteer'])
      ]);

      if (reportsData.error) throw reportsData.error;
      setReports(reportsData.data || []);
      setVolunteers(volunteersData.data || []);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const payload: any = {
        status: editFormData.status,
        resolution_note: editFormData.resolution_note || null,
        updated_at: new Date().toISOString()
      };
      
      if (editFormData.assigned_to) {
         payload.assigned_to = editFormData.assigned_to;
      }

      const { error } = await supabase.from('reports').update(payload).eq('id', id);

      if (error) throw error;
      
      setEditingReport(null);
      fetchData();
    } catch (err: any) {
      alert('Error updating: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this case completely?")) return;
    try {
      const { error } = await supabase.from('reports').delete().eq('id', id);
      if (error) throw error;
      setReports(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    }
  };

  if (!profile || (profile.role !== 'admin' && profile.role !== 'volunteer')) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="glass-card p-12 text-center max-w-md">
          <ShieldAlert className="w-16 h-16 text-primary-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Access Restricted</h1>
          <p className="text-slate-400 font-medium">You do not have the required permissions. Please login with an authorized Volunteer or Admin account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-10 pb-20">
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-dark-surface/50 border-b border-dark-border py-8 mb-8 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
               <ShieldAlert className="w-8 h-8 text-primary-500" />
            </div>
            <div>
               <h1 className="text-3xl font-black text-white uppercase tracking-tight">Mission Control</h1>
               <p className="text-sm text-slate-400 font-mono">Role: {profile.role.toUpperCase()}</p>
            </div>
          </div>
          <div className="text-sm font-bold bg-dark-bg text-accent-500 px-6 py-3 rounded-md border border-dark-border shadow-[0_0_10px_rgba(0,153,255,0.1)]">
            {reports.length} Total Cases
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report.id} className="glass-card overflow-hidden transition-all border border-dark-border hover:border-slate-700 p-0">
                 <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/4 bg-[#0a0a0a] border-r border-dark-border p-6 flex flex-col justify-center">
                       {report.image_url ? (
                          <img src={report.image_url} alt="Evid" className="w-full h-32 object-cover rounded-md border border-dark-border mb-4 opacity-80 hover:opacity-100 transition-opacity" />
                       ) : (
                          <div className="w-full h-32 bg-dark-surface rounded-md border border-dark-border mb-4 flex items-center justify-center">
                             <FileText className="w-8 h-8 text-slate-600" />
                          </div>
                       )}
                       <div className="text-[10px] font-black uppercase text-accent-500 tracking-wider mb-1">Status</div>
                       <span className={`inline-block px-3 py-1 font-bold text-xs uppercase rounded
                         ${report.status === 'resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                          report.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                          report.status === 'under_review' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-primary-500/20 text-primary-400 border border-primary-500/30'}
                       `}>
                          {report.status.replace('_', ' ')}
                       </span>
                    </div>

                    <div className="lg:w-3/4 p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <h3 className="text-2xl font-bold text-white mb-2">{report.title}</h3>
                             <div className="flex gap-3 text-xs font-mono text-slate-500">
                                <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                <span className="bg-dark-bg px-2 py-0.5 rounded border border-dark-border">{report.category}</span>
                             </div>
                          </div>
                       </div>
                       <p className="text-slate-400 text-sm mb-6 leading-relaxed">{report.description}</p>
                       
                       {editingReport === report.id ? (
                         <div className="bg-dark-bg p-4 rounded-lg border border-dark-border space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Update Status</label>
                                  <select className="input-field py-2" value={editFormData.status} onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}>
                                     <option value="pending">Pending</option>
                                     <option value="under_review">Under Review</option>
                                     <option value="in_progress">In Progress</option>
                                     <option value="resolved">Resolved</option>
                                     <option value="rejected">Rejected (Spam)</option>
                                  </select>
                               </div>
                               <div>
                                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assign Volunteer</label>
                                  <select className="input-field py-2" value={editFormData.assigned_to} onChange={(e) => setEditFormData({...editFormData, assigned_to: e.target.value})}>
                                     <option value="">Unassigned</option>
                                     {volunteers.map(v => <option key={v.id} value={v.id}>{v.full_name || v.email} ({v.role})</option>)}
                                  </select>
                               </div>
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resolution Note (Public)</label>
                               <textarea className="input-field py-2" rows={2} value={editFormData.resolution_note} onChange={(e) => setEditFormData({...editFormData, resolution_note: e.target.value})} placeholder="Explain actions taken..." />
                            </div>
                            <div className="flex gap-3 pt-2">
                               <button onClick={() => handleUpdate(report.id)} className="btn-primary py-2 px-4 shadow-none hover:shadow-none flex items-center gap-2 text-sm"><Save className="w-4 h-4"/> Save Record</button>
                               <button onClick={() => setEditingReport(null)} className="btn-secondary py-2 px-4 flex items-center gap-2 text-sm text-slate-400">Cancel</button>
                            </div>
                         </div>
                       ) : (
                         <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-dark-border mt-auto">
                            <button 
                              onClick={() => {
                                setEditingReport(report.id);
                                setEditFormData({ status: report.status, resolution_note: report.resolution_note || '', assigned_to: report.assigned_to?.id || '' });
                              }}
                              className="px-4 py-2 bg-dark-bg border border-dark-border hover:border-accent-500 text-slate-300 hover:text-accent-400 rounded transition-colors text-sm font-bold flex items-center justify-center gap-2 shrink-0"
                            >
                              <AlertTriangle className="w-4 h-4" /> Manage Case
                            </button>
                            {profile.role === 'admin' && (
                              <button 
                                onClick={() => handleDelete(report.id)}
                                className="px-4 py-2 bg-dark-bg border border-dark-border hover:border-primary-500 text-slate-500 hover:text-primary-400 rounded transition-colors text-sm font-bold flex items-center justify-center gap-2 shrink-0"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            )}
                            <div className="ml-auto text-xs font-mono text-slate-500 bg-dark-bg px-3 py-2 rounded border border-dark-border self-center w-full sm:w-auto text-center truncate">
                               Assigned: <span className="text-white">{report.assigned_to?.full_name || 'Unassigned'}</span>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
