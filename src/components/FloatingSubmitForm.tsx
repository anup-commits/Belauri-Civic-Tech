
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { PenLine, X, Upload, Loader2, CheckCircle2, Send } from 'lucide-react';

export default function FloatingSubmitForm() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Environment',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Ensure anonymous authentication first
      const { data: { session } } = await supabase.auth.getSession();
      let user = session?.user || null;
      
      if (!user) {
        const { data: authData, error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) throw signInError;
        user = authData.user || null;
      }

      if (!user) throw new Error("Could not authenticate anonymously");

      let imageUrl = null;

      // 2. Upload image if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }

      // 3. Insert Post
      const { error: insertError } = await supabase.from('posts').insert([
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image_url: imageUrl,
          created_by: user.id,
          status: 'pending'
        }
      ]);

      if (insertError) throw insertError;

      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
        setFormData({ title: '', description: '', category: 'Environment' });
        setImageFile(null);
      }, 3000);

    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || err.error_description || t('form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ['Anti-Corruption', 'Community Help', 'Environment', 'Education', 'Others'];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-30 bg-primary-600 hover:bg-primary-500 text-white rounded p-4 shadow-xl hover:-translate-y-1 transition-all duration-300 md:px-6 md:py-4 flex items-center gap-3 border border-primary-500/50 group"
      >
        <PenLine className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span className="hidden md:inline font-bold tracking-wide uppercase text-sm">{t('form.fab')}</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-dark-surface border border-dark-border rounded-lg w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up my-auto">
            <div className="flex justify-between items-center p-6 border-b border-dark-border bg-black/50">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">{t('form.modal_title')}</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Success!</h3>
                  <p className="text-slate-600 font-medium">
                    {t('form.success')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {t('form.field.incident_title')}
                    </label>
                    <input
                      required
                      type="text"
                      className="input-field"
                      placeholder={t('form.field.placeholder_title')}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {t('form.field.details')}
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="input-field resize-none"
                      placeholder={t('form.field.placeholder_details')}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                       {t('form.field.category')}
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {categories.map((cat) => {
                        const catKey = `category.${cat.toLowerCase().replace(/ /g, '_').replace('-', '_')}` as any;
                        const translated = t(catKey) || cat;
                        const isSelected = formData.category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat })}
                            className={`px-3 py-2 text-sm rounded border text-center font-bold transition-colors ${
                              isSelected
                                ? 'bg-primary-600/20 border-primary-500 text-primary-400 shadow-sm' 
                                : 'bg-[#1a1a1a] border-dark-border text-slate-400 hover:bg-[#222]'
                            }`}
                          >
                            {translated}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {t('form.field.evidence')}
                    </label>
                    <div className="relative border border-dashed border-dark-border bg-[#1a1a1a] rounded px-6 py-8 hover:bg-[#222] hover:border-primary-500/50 transition-colors text-center cursor-pointer group">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                      />
                      {imageFile ? (
                        <div className="flex items-center justify-between bg-dark-surface p-2 rounded border border-dark-border">
                          <span className="text-sm text-slate-300 truncate">{imageFile.name}</span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setImageFile(null); }}
                            className="p-1 text-slate-500 hover:text-white transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-slate-400 group-hover:text-primary-400 transition-colors">
                          <Upload className="w-8 h-8 mx-auto mb-2 opacity-50 group-hover:opacity-100" />
                          <span className="text-sm font-medium">{t('form.upload.drag')}</span>
                          <p className="text-xs text-slate-500 mt-1">{t('form.upload.limits')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 mt-8 rounded"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('form.submitting')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t('form.submit')}
                      </>
                    )}
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
