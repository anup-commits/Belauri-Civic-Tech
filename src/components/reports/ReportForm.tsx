import { useState } from 'react';
import { AlertCircle, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export default function ReportForm() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'corruption' | 'infrastructure' | 'public_service' | 'other'>('corruption');
  const [location, setLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('reports').insert({
        user_id: isAnonymous ? null : user?.id,
        title,
        description,
        category,
        location: location || null,
        is_anonymous: isAnonymous,
        status: 'pending',
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setTitle('');
      setDescription('');
      setLocation('');
      setCategory('corruption');
      setIsAnonymous(false);

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reports" className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-red-100 border border-red-300 rounded-full mb-4">
            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
            <span className="text-sm font-medium text-red-800">Confidential & Secure</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Report Corruption
          </h2>
          <p className="text-xl text-gray-600">
            Your voice matters. Report corruption and civic issues safely and anonymously.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              Report submitted successfully! It will be reviewed by our team.
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Report Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Brief summary of the issue"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                required
              >
                <option value="corruption">Corruption</option>
                <option value="infrastructure">Infrastructure Issues</option>
                <option value="public_service">Public Service Problems</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Provide detailed information about the issue, including when and where it occurred, who was involved, and any evidence you have..."
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="e.g., Ward No. 5, Near Municipal Office"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-600"
              />
              <label htmlFor="anonymous" className="ml-3 text-sm text-gray-700">
                <span className="font-medium">Submit anonymously</span>
                <p className="text-gray-500 mt-1">
                  Your identity will not be stored or revealed. Use this option if you're concerned about your safety.
                </p>
              </label>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please provide accurate information. False reports harm the credibility of our movement and will be removed.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting Report...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
