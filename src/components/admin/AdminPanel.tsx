import { useEffect, useState } from 'react';
import { FileText, Users, Calendar, Image, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/database.types';

type Report = Database['public']['Tables']['reports']['Row'];

export default function AdminPanel() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'reports' | 'posts' | 'events' | 'gallery' | 'users'>('reports');
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    totalUsers: 0,
    totalPosts: 0,
  });

  useEffect(() => {
    if (profile?.is_admin) {
      fetchStats();
      fetchPendingReports();
    }
  }, [profile]);

  const fetchStats = async () => {
    const [reportsCount, usersCount, postsCount, pendingCount] = await Promise.all([
      supabase.from('reports').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    setStats({
      totalReports: reportsCount.count || 0,
      pendingReports: pendingCount.count || 0,
      totalUsers: usersCount.count || 0,
      totalPosts: postsCount.count || 0,
    });
  };

  const fetchPendingReports = async () => {
    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (data) {
      setPendingReports(data);
    }
  };

  const updateReportStatus = async (reportId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', reportId);

    if (!error) {
      fetchPendingReports();
      fetchStats();
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <section id="admin" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Admin Panel
          </h2>
          <p className="text-xl text-gray-600">
            Manage content and moderate reports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalReports}</div>
            <div className="text-sm text-gray-600">Total Reports</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.pendingReports}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalPosts}</div>
            <div className="text-sm text-gray-600">Published Posts</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['reports', 'posts', 'events', 'gallery', 'users'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-4 text-sm font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-red-600 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'reports' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Pending Reports ({pendingReports.length})
                </h3>

                {pendingReports.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No pending reports</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingReports.map((report) => (
                      <div
                        key={report.id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                {report.category.toUpperCase()}
                              </span>
                              {report.is_anonymous && (
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  ANONYMOUS
                                </span>
                              )}
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">
                              {report.title}
                            </h4>
                            <p className="text-gray-600 mb-2">{report.description}</p>
                            {report.location && (
                              <p className="text-sm text-gray-500">Location: {report.location}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              Submitted: {new Date(report.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => updateReportStatus(report.id, 'approved')}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => updateReportStatus(report.id, 'rejected')}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'posts' && (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Post Management</h3>
                <p className="text-gray-600 mb-6">Create and manage blog posts and news articles</p>
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  Create New Post
                </button>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Event Management</h3>
                <p className="text-gray-600 mb-6">Create and manage activism events and campaigns</p>
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  Create New Event
                </button>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Gallery Management</h3>
                <p className="text-gray-600 mb-6">Upload and manage photos and videos</p>
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  Upload Media
                </button>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">User Management</h3>
                <p className="text-gray-600">Manage user accounts and permissions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
