import { X, Sparkles, CheckCircle } from 'lucide-react';

export default function PaymentModal({ onClose, onSuccess }) {
  const handlePayment = () => {
    // Simulate a payment call
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 mx-auto">
          <Sparkles size={32} />
        </div>
        
        <h2 className="text-2xl font-extrabold text-slate-800 text-center mb-2">Upgrade to Premium</h2>
        <p className="text-slate-500 text-center mb-8">
          Unlock unlimited PDF downloads and ATS-friendly exports.
        </p>

        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-slate-700">Silver Plan</span>
            <span className="font-extrabold text-xl text-emerald-600">$9.99</span>
          </div>
          <ul className="text-sm font-semibold text-slate-500 space-y-3">
            <li className="flex gap-2 items-center"><CheckCircle size={16} className="text-emerald-500"/> Unlimited Resumes</li>
            <li className="flex gap-2 items-center"><CheckCircle size={16} className="text-emerald-500"/> ATS Optimization</li>
            <li className="flex gap-2 items-center"><CheckCircle size={16} className="text-emerald-500"/> Download as PDF</li>
          </ul>
        </div>
        
        <button 
          onClick={handlePayment}
          className="w-full bg-slate-900 text-white hover:bg-indigo-600 py-4 rounded-xl font-extrabold transition-all duration-300 shadow-md flex items-center justify-center gap-2 group"
        >
          <span>Pay Now (Mock)</span>
        </button>
      </div>
    </div>
  );
}
