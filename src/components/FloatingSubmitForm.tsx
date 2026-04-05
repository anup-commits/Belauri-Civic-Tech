import { useState } from 'react';

import { supabase } from '../lib/supabase';
import { PenLine, X, Upload, Loader2, CheckCircle2, Send, MapPin } from 'lucide-react';

export default function FloatingSubmitForm() {

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    location_text: '',
    lat: null as number | null,
    lng: null as number | null,
    is_anonymous: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            location_text: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
          }));
        },
        (err) => {
          console.error(err);
          alert("Could not get location. Please enter manually.");
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      let user = session?.user || null;
      
      if (!user) {
        const { data: authData, error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) throw signInError;
        user = authData.user || null;
      }

      if (!user) throw new Error("Could not authenticate");

      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('report-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('report-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from('reports').insert([
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location_text: formData.location_text,
          lat: formData.lat,
          lng: formData.lng,
          image_url: imageUrl,
          user_id: user.id,
          is_anonymous: formData.is_anonymous,
          status: 'pending'
        }
      ]);

      if (insertError) throw insertError;

      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setFormData({ title: '', description: '', category: 'Infrastructure', location_text: '', lat: null, lng: null, is_anonymous: false });
        setImageFile(null);
      }, 3000);

    } catch (err: unknown) {
      console.error('Submission error:', err);
      const eObj = err as Record<string, string>;
      setError(eObj.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Corruption', 'Infrastructure', 'Public Service', 'Environment', 'Education', 'Other'];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-30 bg-primary-500 hover:bg-primary-400 text-white rounded p-4 shadow-neon hover:-translate-y-1 transition-all duration-300 md:px-6 md:py-4 flex items-center gap-3 border border-primary-500/50 group"
      >
        <PenLine className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="hidden md:inline font-bold tracking-wide uppercase text-sm">Report Issue</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-dark-surface border border-dark-border rounded-xl w-full max-w-2xl shadow-neon overflow-hidden animate-slide-up my-auto">
            <div className="flex justify-between items-center p-6 border-b border-dark-border bg-dark-surface">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_#ff4500]"></span>
                Report an Issue
              </h2>
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Issue Reported!</h3>
                  <p className="text-slate-400 font-medium">Your report is extremely vital. It is now pending review.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && <div className="p-4 bg-primary-500/10 border border-primary-500/50 text-primary-400 rounded-md font-medium text-sm">{error}</div>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Issue Title</label>
                      <input required type="text" className="input-field" placeholder="Brief summary..." value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                      <select required className="input-field cursor-pointer" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                    <textarea required rows={4} className="input-field resize-none" placeholder="Elaborate on the issue..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                    <div className="flex flex-col md:flex-row gap-3">
                      <input type="text" className="input-field flex-grow" placeholder="Neighborhood, Street, etc." value={formData.location_text} onChange={(e) => setFormData({ ...formData, location_text: e.target.value })} />
                      <button type="button" onClick={handleGetLocation} className="btn-secondary flex items-center justify-center gap-2 shrink-0">
                        <MapPin className="w-4 h-4 text-accent-500" /> GPS Pin
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Visual Evidence (Optional)</label>
                    <div className="relative border border-dashed border-dark-border bg-dark-bg rounded-md px-6 py-6 hover:bg-dark-surface hover:border-primary-500 transition-colors text-center cursor-pointer group">
                      <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => e.target.files && setImageFile(e.target.files[0])} />
                      {imageFile ? (
                        <div className="flex items-center justify-between p-2">
                          <span className="text-sm text-slate-300 truncate font-semibold">{imageFile.name}</span>
                          <X className="w-5 h-5 text-slate-500" onClick={(e) => { e.preventDefault(); setImageFile(null); }}/>
                        </div>
                      ) : (
                        <div className="text-slate-500 group-hover:text-primary-400 transition-colors flex flex-col items-center">
                          <Upload className="w-6 h-6 mb-2" />
                          <span className="text-sm font-medium">Click or drag image</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-dark-bg p-4 rounded-md border border-dark-border">
                    <input type="checkbox" id="anon" checked={formData.is_anonymous} onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })} className="w-5 h-5 rounded border-dark-border bg-dark-surface text-primary-500 focus:ring-primary-500 focus:ring-offset-dark-surface" />
                    <label htmlFor="anon" className="text-sm text-slate-300">
                      <strong className="text-white">Submit Anonymously</strong> — Your identity will be hidden from the public feed.
                    </label>
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full btn-primary flex items-center justify-center gap-2">
                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Send className="w-5 h-5" /> Submit Report to Belauri First</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
