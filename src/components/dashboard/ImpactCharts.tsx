import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#ff4500', '#0099ff', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ImpactCharts({ reports }: { reports: any[] }) {
  const categoryData = useMemo(() => {
    const counts = reports.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [reports]);

  const statusData = useMemo(() => {
    const counts = reports.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { name: 'Resolved', value: counts['resolved'] || 0, fill: '#10b981' },
      { name: 'In Progress', value: counts['in_progress'] || 0, fill: '#0099ff' },
      { name: 'Under Review', value: counts['under_review'] || 0, fill: '#f59e0b' },
      { name: 'Pending', value: counts['pending'] || 0, fill: '#ef4444' }
    ];
  }, [reports]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 w-full">
      <div className="glass-card p-6 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Reports by Category</h3>
        <div className="flex-grow w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="rgba(255,255,255,0.05)"
              >
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {categoryData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
              {entry.name.toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Status Distribution</h3>
        <div className="flex-grow w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
              <XAxis type="number" stroke="#64748b" />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 12, fontWeight: 'bold' }} />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#121212', borderColor: '#2a2a2a', color: '#fff', borderRadius: '8px' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
