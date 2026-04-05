/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldAlert, Crosshair, TrendingUp, Users, Activity } from 'lucide-react';
import ImpactCharts from '../components/dashboard/ImpactCharts';

export default function Impact() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase.from('reports').select('*');
      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalReports = reports.length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;
  const resolutionRate = totalReports ? Math.round((resolvedReports / totalReports) * 100) : 0;
  const activeIssues = reports.filter(r => ['pending', 'under_review', 'in_progress'].includes(r.status)).length;

  return (
    <div className="bg-dark-bg min-h-screen pb-20 pt-10">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 animate-fade-in relative z-10">
        <div className="mb-12 border-b border-dark-border pb-8">
          <h1 className="text-5xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-4">
            <TrendingUp className="w-12 h-12 text-primary-500" /> Impact Dashboard
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-3xl leading-relaxed">
            Real-time analytics and transparency tracking. We believe in showing exact numbers, ensuring every report is tracked until resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 flex items-start gap-4 hover:border-primary-500 transition-colors">
               <div className="p-3 bg-dark-bg rounded-lg border border-dark-border text-primary-500">
                  <ShieldAlert className="w-8 h-8" />
               </div>
               <div>
                  <div className="text-3xl font-black text-white">{totalReports}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Total Reports</div>
               </div>
            </div>

            <div className="glass-card p-6 flex items-start gap-4 hover:border-green-500 transition-colors">
               <div className="p-3 bg-dark-bg rounded-lg border border-dark-border text-green-500">
                  <Activity className="w-8 h-8" />
               </div>
               <div>
                  <div className="text-3xl font-black text-white">{resolutionRate}%</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Resolution Rate</div>
               </div>
            </div>

            <div className="glass-card p-6 flex items-start gap-4 hover:border-accent-500 transition-colors">
               <div className="p-3 bg-dark-bg rounded-lg border border-dark-border text-accent-500">
                  <Crosshair className="w-8 h-8" />
               </div>
               <div>
                  <div className="text-3xl font-black text-white">{activeIssues}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Active Cases</div>
               </div>
            </div>

            <div className="glass-card p-6 flex items-start gap-4 hover:border-purple-500 transition-colors">
               <div className="p-3 bg-dark-bg rounded-lg border border-dark-border text-purple-500">
                  <Users className="w-8 h-8" />
               </div>
               <div>
                  <div className="text-3xl font-black text-white">Public</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Transparency Index</div>
               </div>
            </div>
        </div>

        {!loading && <ImpactCharts reports={reports} />}

      </main>
    </div>
  );
}
