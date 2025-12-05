import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Globe, Leaf, Users, Save, 
  ArrowLeft, Shield, Trash2, Check, AlertCircle 
} from 'lucide-react';
import { supabase, TABLES } from '../services/supabase';

const UserSettings = ({ 
  user, 
  setUser, 
  language, 
  setLanguage, 
  isHealthyMode, 
  setIsHealthyMode, 
  pax, 
  setPax, 
  setView 
}) => {
  // Local state for form management
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync local state if props change (optional safety)
  useEffect(() => {
    if (user) setFormData({ name: user.name || '', email: user.email || '' });
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (!user?.id) {
        throw new Error('User not logged in');
      }

      // Update user profile in Supabase
      const { error: updateError } = await supabase
        .from(TABLES.USER_PROFILES)
        .update({
          name: formData.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Update global user state
      setUser({ ...user, name: formData.name });
      
      setSuccessMsg(language === 'ph' ? 'Nai-save na ang settings!' : 'Settings saved successfully!');
      
      // Clear success message after 3s
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setErrorMsg(language === 'ph' 
        ? 'Hindi ma-save ang settings. Subukan ulit.' 
        : 'Failed to save settings. Please try again.');
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header / Nav */}
      <button 
        onClick={() => setView('input')}
        className="mb-6 text-sm text-slate-400 hover:text-slate-800 flex items-center gap-2 transition-colors pl-1"
      >
        <ArrowLeft className="w-4 h-4" /> {language === 'ph' ? 'Bumalik' : 'Back to Home'}
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-serif text-3xl text-slate-900 font-bold">
            {language === 'ph' ? 'Settings ng Account' : 'Account Settings'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {language === 'ph' ? 'I-manage ang iyong profile at preferences.' : 'Manage your profile and app preferences.'}
          </p>
        </div>
        <div className="bg-slate-100 p-3 rounded-full">
           <User className="w-6 h-6 text-slate-600" />
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
          <Check className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
          <AlertCircle className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: Profile Information */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
             <Shield className="w-4 h-4" /> Profile Info
           </h3>
           
           <div className="space-y-5">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-medium text-slate-700"
                  />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    value={formData.email || user?.email || ''}
                    disabled
                    className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-400 ml-1">Email cannot be changed via settings currently.</p>
             </div>
           </div>
        </div>

        {/* SECTION 2: App Preferences */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
             <Globe className="w-4 h-4" /> Preferences
           </h3>

           <div className="space-y-6">
             
             {/* Language Toggle */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                     <Globe className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-700 text-sm">Language</p>
                     <p className="text-xs text-slate-400">English / Filipino</p>
                   </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setLanguage(l => l === 'en' ? 'ph' : 'en')}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all w-24"
                >
                  {language === 'en' ? 'English' : 'Filipino'}
                </button>
             </div>

             <hr className="border-slate-50" />

             {/* Healthy Mode Toggle */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg transition-colors ${isHealthyMode ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                     <Leaf className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-700 text-sm">Healthy Mode</p>
                     <p className="text-xs text-slate-400">Prioritize veggie options</p>
                   </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsHealthyMode(!isHealthyMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${isHealthyMode ? 'bg-green-500 justify-end' : 'bg-slate-200 justify-start'}`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </button>
             </div>

             <hr className="border-slate-50" />

             {/* Pax Counter */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                     <Users className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="font-bold text-slate-700 text-sm">Default Pax</p>
                     <p className="text-xs text-slate-400">People to cook for</p>
                   </div>
                </div>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                   <button type="button" onClick={() => setPax(Math.max(1, pax - 1))} className="px-3 py-1 hover:bg-slate-200 text-slate-500 transition-colors">-</button>
                   <span className="text-sm font-bold w-8 text-center">{pax}</span>
                   <button type="button" onClick={() => setPax(pax + 1)} className="px-3 py-1 hover:bg-slate-200 text-slate-500 transition-colors">+</button>
                </div>
             </div>

           </div>
        </div>

        {/* SECTION 3: Danger Zone */}
        <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-red-500 shadow-sm">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-red-900 text-sm">
                  {language === 'ph' ? 'Tanggalin ang Account' : 'Delete Account'}
                </p>
                <p className="text-xs text-red-700/60">
                  {language === 'ph' ? 'Permanenteng tanggalin ang data' : 'Permanently remove data'}
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={async () => {
                const confirmMsg = language === 'ph' 
                  ? 'Sigurado ka ba? Matatanggal ang lahat ng iyong data.'
                  : 'Are you sure? This will permanently delete all your data.';
                
                if (window.confirm(confirmMsg)) {
                  try {
                    // Delete user data from Supabase
                    const { error } = await supabase
                      .from(TABLES.USER_PROFILES)
                      .delete()
                      .eq('id', user.id);

                    if (error) throw error;

                    // Sign out and redirect
                    await supabase.auth.signOut();
                    setView('login');
                  } catch (err) {
                    console.error('Error deleting account:', err);
                    alert(language === 'ph' 
                      ? 'Hindi ma-delete ang account. Subukan ulit.'
                      : 'Failed to delete account. Please try again.');
                  }
                }
              }}
              className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={isSaving}
            className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>

      </form>
      <div className="h-12"></div>
    </div>
  );
};

export default UserSettings;
