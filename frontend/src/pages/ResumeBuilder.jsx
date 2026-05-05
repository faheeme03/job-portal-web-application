import { useState, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FileText, Sparkles, Download, ArrowRight, CheckCircle, Loader2, Eye, Edit2, ExternalLink } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import PaymentModal from '../components/PaymentModal';

// Require html2pdf only in browser
import html2pdf from 'html2pdf.js';

export default function ResumeBuilder() {
  const { user, login } = useContext(AuthContext); // Note: we don't have a setUser exposed directly, we might need a workaround if not re-logging. 
  // Actually, login is for login. Let's just track premium locally to avoid context reload complexity for the mock.
  const [isPremiumLocally, setIsPremiumLocally] = useState(user?.isPremium || false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    dob: '',
    desiredJobTitle: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    hobbies: ''
  });

  const [loading, setLoading] = useState(false);
  const [resumeHtml, setResumeHtml] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const resumeRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateResume = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/resume/generate', formData);
      setResumeHtml(res.data.htmlContent);
      toast.success('Resume generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate resume. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = () => {
    if (!isPremiumLocally) {
      setShowPaymentModal(true);
      return;
    }
    downloadPdf();
  };

  const handlePaymentSuccess = async () => {
    try {
      await api.post('/users/upgrade');
      setIsPremiumLocally(true);
      setShowPaymentModal(false);
      toast.success('Payment successful! You are now a Premium user.');
      // Auto download after success
      downloadPdf();
    } catch (error) {
      toast.error('Payment verification failed.');
    }
  };

  const downloadPdf = () => {
    if (!resumeRef.current) return;
    const element = resumeRef.current;
    
    // Config for PDF
    const opt = {
      margin:       [10, 10, 10, 10], // top, left, bottom, right in mm
      filename:     `${formData.name.replace(/\s+/g, '_')}_Resume.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(element).set(opt).save();
    toast.success('Downloading your professional resume!');
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 flex items-center justify-center gap-3">
          <Sparkles className="text-amber-500" size={40} /> AI Resume Builder
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Provide your details below and our AI will craft a perfectly aligned, ATS-friendly professional resume in seconds.
        </p>
      </div>

      {!resumeHtml ? (
        <form onSubmit={generateResume} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 mb-10 overflow-hidden relative">
          
          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4">Personal & Professional Info</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone</label>
              <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="+1 234 567 890" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Desired Job Title</label>
              <input required name="desiredJobTitle" value={formData.desiredJobTitle} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="e.g. Senior Frontend Developer" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b pb-4 mt-12">Detailed Background</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Professional Summary</label>
              <textarea name="summary" value={formData.summary} onChange={handleChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Briefly describe your career objectives and top strengths..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Work Experience</label>
              <textarea required name="experience" value={formData.experience} onChange={handleChange} rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="List companies, roles, and dates..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Education</label>
              <textarea required name="education" value={formData.education} onChange={handleChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Degrees, universities, graduation years..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Key Skills</label>
              <textarea required name="skills" value={formData.skills} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="React, Node.js, Project Management..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Projects</label>
              <textarea name="projects" value={formData.projects} onChange={handleChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Notable projects, technologies used and your impact..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Hobbies & Interests</label>
              <textarea name="hobbies" value={formData.hobbies} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Reading, Open Source Contribution, Chess..."></textarea>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className={`bg-slate-900 text-white px-8 py-4 rounded-xl font-extrabold text-lg shadow-xl shadow-slate-200 hover:shadow-indigo-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 w-full md:w-auto ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-600'}`}
            >
              {loading ? <><Loader2 className="animate-spin" /> Generating Magic...</> : <><Sparkles size={20}/> Generate AI Resume <ArrowRight size={20}/></>}
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-500">
          <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-start items-center bg-white rounded-t-xl border-b border-slate-200 mb-8 shadow-sm overflow-hidden">
            <button className="flex-1 min-w-[160px] py-4 md:py-5 flex items-center justify-center gap-2 font-bold text-[#1bb88d] border-b-[3px] border-[#1bb88d] bg-emerald-50/30">
              <Eye size={20} /> Resume Preview
            </button>
            
            <button 
              onClick={() => setResumeHtml(null)}
              className="flex-1 min-w-[160px] py-4 md:py-5 flex items-center justify-center gap-2 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors border-b-[3px] border-transparent"
            >
              <Edit2 size={20} /> Update Info
            </button>
            
            <button 
              onClick={handleDownloadClick}
              className="flex-1 min-w-[180px] py-3 md:py-4 flex flex-col items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors border-b-[3px] border-transparent"
            >
              <div className="flex items-center gap-2 font-medium">
                <Download size={20} /> Download
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 mt-1">Available in <strong className="text-slate-800">PDF</strong></span>
            </button>

            <button className="flex-1 min-w-[170px] py-4 md:py-5 flex items-center justify-center gap-2 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors border-b-[3px] border-transparent hidden sm:flex">
              <ExternalLink size={20} /> Open in Browser
            </button>
          </div>

          {/* The A4 Resume Preview Container */}
          <div className="flex justify-center bg-slate-100 p-8 rounded-3xl overflow-hidden">
            <div 
              ref={resumeRef}
              className="bg-white text-black shadow-2xl p-10 md:p-14 w-full max-w-[210mm] min-h-[297mm] mx-auto text-left relative"
              style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '1.5' }}
            >
              <style dangerouslySetInnerHTML={{__html: `
                h1 { font-size: 24pt; font-weight: bold; text-align: center; margin-bottom: 5px; text-transform: uppercase; color: #111; }
                h2 { font-size: 14pt; font-weight: bold; border-bottom: 2px solid #333; margin-top: 20px; margin-bottom: 10px; padding-bottom: 3px; color: #222; text-transform: uppercase;}
                h3 { font-size: 12pt; font-weight: bold; margin-top: 10px; margin-bottom: 5px; color: #333; }
                p { margin-bottom: 8px; color: #444; }
                ul { margin-left: 20px; margin-bottom: 10px; color: #444; }
                li { margin-bottom: 5px; line-height: 1.4;}
                .contact-info { text-align: center; font-size: 10pt; color: #555; margin-bottom: 20px;}
                strong { color: #111; }
              `}} />
              
              <div dangerouslySetInnerHTML={{ __html: resumeHtml }} />

              {!isPremiumLocally && (
                <div className="absolute bottom-0 left-0 right-0 h-[65%] backdrop-blur-md bg-white/40 z-10 flex flex-col items-center justify-center p-8">
                  <div className="bg-[#1bb88d] text-white p-8 rounded-2xl max-w-sm text-center shadow-2xl">
                    <p className="text-xl font-medium mb-6 leading-snug">To view your resume and download a PDF version, upgrade to our Silver Plan.</p>
                    <button 
                      onClick={() => setShowPaymentModal(true)} 
                      className="bg-white text-[#1bb88d] px-8 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors shadow-md"
                    >
                      Upgrade Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <PaymentModal 
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
