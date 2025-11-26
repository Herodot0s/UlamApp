import React, { useState } from 'react';
import { 
  Moon, Sun, Mail, User, MessageSquare, Send, 
  MapPin, GraduationCap, Code2, ArrowLeft, Github, Globe 
} from 'lucide-react';

const AboutContact = ({ setView }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const themeClasses = {
    bg: darkMode ? 'bg-slate-900' : 'bg-slate-50',
    text: darkMode ? 'text-slate-100' : 'text-slate-900',
    card: darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
    input: darkMode ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-orange-500',
    subText: darkMode ? 'text-slate-400' : 'text-slate-500'
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ease-in-out ${themeClasses.bg} ${themeClasses.text} absolute top-0 left-0 w-full z-40 animate-in fade-in`}>
      
      {/* Navbar / Top Bar */}
      <div className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b transition-colors duration-500 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <button 
          onClick={() => setView('input')} 
          className={`flex items-center gap-2 text-sm font-bold transition-colors ${darkMode ? 'hover:text-orange-400' : 'hover:text-orange-600'}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

      </div>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20">
        
        {/* HERO / ABOUT SECTION */}
        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg shadow-orange-500/30 mb-4">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight">
             About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">UlamApp</span>
          </h1>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed ${themeClasses.subText}`}>
             We are students from <span className="font-semibold text-orange-500">Quezon City University</span>, 2nd Year SFIT2B.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
             <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${themeClasses.card} shadow-sm`}>
                <GraduationCap className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold">SFIT-2B</span>
             </div>
             <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${themeClasses.card} shadow-sm`}>
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-bold">Quezon City</span>
             </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* LEFT: MISSION & INFO */}
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className={`p-8 rounded-[2rem] border shadow-xl ${themeClasses.card}`}>
              <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" /> Our Vision
              </h2>
              <p className={`leading-relaxed ${themeClasses.subText}`}>
                To bridge the gap between traditional Filipino cooking and modern artificial intelligence. 
                We believe in making home cooking accessible, efficient, and personalized for every Filipino household. 
                -Stephen right?
              </p>
            </div>

            <div className={`p-8 rounded-[2rem] border shadow-xl ${themeClasses.card}`}>
              <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" /> Our Mission
              </h2>
              <p className={`leading-relaxed ${themeClasses.subText}`}>
                To bridge the gap between traditional Filipino cooking and modern artificial intelligence. 
                We believe in making home cooking accessible, efficient, and personalized for every Filipino household. 
                -Stephen right?
              </p>
            </div>
            
            

            <div className={`p-8 rounded-[2rem] border shadow-xl ${themeClasses.card}`}>
              <h2 className="font-serif text-2xl font-bold mb-6">Connect with Us</h2>
              <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="bg-slate-900 text-white p-2 rounded-lg"><Github className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-sm">GitHub</h3>
                    <p className={`text-xs ${themeClasses.subText}`}>Check our repositories</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 p-4 rounded-xl transition-all ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                  <div className="bg-blue-700 text-white p-2 rounded-lg"><Code2 className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-bold text-sm">University Project</h3>
                    <p className={`text-xs ${themeClasses.subText}`}>SFIT-2B Block</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTACT FORM */}
          <div className={`p-8 rounded-[2rem] border shadow-2xl relative overflow-hidden animate-in slide-in-from-right duration-700 ${themeClasses.card}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
            
            <h2 className="font-serif text-3xl font-bold mb-2">Contact Us</h2>
            <p className={`text-sm mb-8 ${themeClasses.subText}`}>Have a question, suggestions or proposal? Send us a message.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70 ml-1">Your Name</label>
                <div className="relative">
                  <User className={`absolute left-4 top-3.5 w-5 h-5 ${themeClasses.subText}`} />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Joshua Bogay"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${themeClasses.input}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-3.5 w-5 h-5 ${themeClasses.subText}`} />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Jushua.Bogay@qcu.com.ph"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${themeClasses.input}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider opacity-70 ml-1">Message</label>
                <div className="relative">
                  <MessageSquare className={`absolute left-4 top-3.5 w-5 h-5 ${themeClasses.subText}`} />
                  <textarea 
                    required
                    rows="4"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="How can we help you?"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all resize-none ${themeClasses.input}`}
                  ></textarea>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || submitted}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                  submitted 
                    ? 'bg-green-500 text-white shadow-green-500/25 shadow-lg' 
                    : 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-orange-500/25 shadow-lg hover:shadow-orange-500/40'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : submitted ? (
                  <>Message Sent! <Send className="w-4 h-4" /></>
                ) : (
                  <>Send Message <Send className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutContact;
