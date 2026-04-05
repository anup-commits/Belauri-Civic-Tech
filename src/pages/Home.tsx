/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Hero from '../components/Hero';
import PostCard from '../components/PostCard';
import IssuesMap from '../components/map/IssuesMap';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`*, assigned_to:profiles!assigned_to(full_name, role)`)
        .neq('status', 'rejected') // optionally only fetch approved/resolved/in_progress
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-bg min-h-screen">
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-dark-border pb-6">
          <div className="max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
              Community Map
            </h2>
            <p className="text-xl text-slate-400 font-medium">
              Explore reported civic issues mapped across our neighborhoods. Transparent, real-time tracking for action.
            </p>
          </div>
        </div>

        <div className="mb-24">
           {!loading && <IssuesMap reports={reports} />}
        </div>

        <div className="flex justify-between items-end mb-12 border-b border-dark-border pb-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
              Live Feed
            </h2>
            <p className="text-xl text-slate-400 font-medium">
              Latest cases, discussions, and resolved issues in Belauri.
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
             <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <PostCard key={report.id} post={report} />
            ))}
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="text-center py-20 bg-dark-surface border border-dark-border rounded-xl">
            <h3 className="text-2xl font-bold text-white mb-2">No active reports found</h3>
            <p className="text-slate-500">The platform feed is currently empty. Be the first to report an issue!</p>
          </div>
        )}
      </main>
    </div>
  );
}
