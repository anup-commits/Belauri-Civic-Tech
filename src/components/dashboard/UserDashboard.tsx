import { useEffect, useState } from 'react';
import { FileText, ThumbsUp, MessageCircle, CreditCard as Edit2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';

type Report = Database['public']['Tables']['reports']['Row'];

export default function UserDashboard() {
  const { user, profile } = useAuth();
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user]);

  const fetchMyReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMyReports(data);
    }
    setLoading(false);
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

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Please sign in to view your dashboard</p>
      </div>
    );
  }

  return (
    <section id="dashboard" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {profile?.full_name}
          </h2>
          <p className="text-xl text-gray-600">
            Track your reports and stay engaged with the movement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{myReports.length}</div>
            <div className="text-sm text-gray-600">Total Reports</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {myReports.filter((r) => r.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {myReports.filter((r) => r.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {myReports.filter((r) => r.status === 'resolved').length}
            </div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Reports</h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : myReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't submitted any reports yet</p>
              <a
                href="#reports"
                className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Submit Your First Report
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {myReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {report.title}
                      </h4>
                      <p className="text-gray-600 line-clamp-2">{report.description}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ml-4 ${getStatusColor(report.status)}`}>
                      {report.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {report.upvotes_count}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        0
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                      {report.status === 'pending' && (
                        <button className="text-red-600 hover:text-red-700">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
