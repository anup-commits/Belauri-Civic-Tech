import { useEffect, useState } from 'react';
import { FileText, Users, CheckCircle, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Stats() {
  const [stats, setStats] = useState({
    reports: 0,
    members: 0,
    resolved: 0,
    events: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [reportsCount, membersCount, resolvedCount, eventsCount] = await Promise.all([
        supabase.from('reports').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
        supabase.from('events').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        reports: reportsCount.count || 0,
        members: membersCount.count || 0,
        resolved: resolvedCount.count || 0,
        events: eventsCount.count || 0,
      });
    };

    fetchStats();
  }, []);

  const statItems = [
    { icon: FileText, label: 'Reports Submitted', value: stats.reports, color: 'text-red-400' },
    { icon: Users, label: 'Active Members', value: stats.members, color: 'text-blue-400' },
    { icon: CheckCircle, label: 'Issues Resolved', value: stats.resolved, color: 'text-green-400' },
    { icon: Calendar, label: 'Events Organized', value: stats.events, color: 'text-yellow-400' },
  ];

  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real results from our collective action towards a corruption-free Belauri
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4`}>
                  <Icon className={`w-8 h-8 ${item.color}`} />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{item.value}</div>
                <div className="text-sm font-medium text-gray-600">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
