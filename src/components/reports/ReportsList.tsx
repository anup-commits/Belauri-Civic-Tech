import { useEffect, useState } from 'react';
import { MapPin, Calendar, ThumbsUp, MessageCircle, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';

type Report = Database['public']['Tables']['reports']['Row'];

export default function ReportsList() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'corruption' | 'infrastructure' | 'public_service' | 'other'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'resolved'>('approved');

  useEffect(() => {
    fetchReports();
  }, [filter, statusFilter, user]);

  const fetchReports = async () => {
    setLoading(true);
    let query = supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (!user) {
      query = query.in('status', ['approved', 'resolved']);
    } else if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }

    if (filter !== 'all') {
      query = query.eq('category', filter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setReports(data);
    }
    setLoading(false);
  };

  const handleUpvote = async (reportId: string) => {
    if (!user) {
      alert('Please sign in to upvote reports');
      return;
    }

    const { error } = await supabase.from('report_votes').insert({
      report_id: reportId,
      user_id: user.id,
    });

    if (!error) {
      fetchReports();
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      corruption: 'bg-red-100 text-red-800 border-red-300',
      infrastructure: 'bg-blue-100 text-blue-800 border-blue-300',
      public_service: 'bg-green-100 text-green-800 border-green-300',
      other: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      resolved: 'bg-blue-100 text-blue-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Citizen Reports
          </h2>
          <p className="text-xl text-gray-600">
            Community-verified issues demanding accountability and action
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Category
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'corruption' | 'infrastructure' | 'public_service' | 'other')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="corruption">Corruption</option>
              <option value="infrastructure">Infrastructure</option>
              <option value="public_service">Public Service</option>
              <option value="other">Other</option>
            </select>
          </div>

          {user && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved' | 'resolved')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="text-gray-600 mt-4">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No reports found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(report.category)}`}>
                    {report.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{report.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{report.description}</p>

                {report.location && (
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {report.location}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleUpvote(report.id)}
                      className="flex items-center hover:text-red-600 transition-colors"
                      disabled={!user}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {report.upvotes_count}
                    </button>
                    <button className="flex items-center hover:text-red-600 transition-colors">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
