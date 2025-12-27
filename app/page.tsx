"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Key, CheckCircle2, Image as ImageIcon, ArrowRight, Loader2, ShieldCheck, Zap, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ZappyTracker() {
  const [step, setStep] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', password: '', otp: '', notes: '',
    checkInPhoto: '', prePhoto: '', postPhoto: ''
  });
  
  const router = useRouter();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => setStep(s => s + 1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username === 'zappy_vendor' && formData.password === 'password123') nextStep();
    else alert("Invalid Credentials (zappy_vendor / password123)");
  };

  // STEP 1: Sync Check-in
  const handleCheckIn = async () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await fetch('/api/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            vendorId: formData.username,
            step: 'check-in',
            data: {
              photo: formData.checkInPhoto,
              location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
              timestamp: new Date()
            }
          })
        });
        nextStep();
      } catch (err) {
        alert("Upload failed. Check console.");
      } finally {
        setLoading(false);
      }
    });
  };

  // STEP 3: Sync Photos & Notes (THE FIX FOR IMAGES NOT UPLOADING)
  const handleSetupSync = async () => {
    setLoading(true);
    try {
      await fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId: formData.username,
          step: 'progress',
          data: {
            prePhoto: formData.prePhoto,
            postPhoto: formData.postPhoto,
            notes: formData.notes
          }
        })
      });
      nextStep();
    } catch (err) {
      alert("Failed to save photos.");
    } finally {
      setLoading(false);
    }
  };

  // OTP Logic (THE FIX FOR OTP INPUT PERSISTING)
  const verifyOTP = async (type: 'start' | 'complete', correctOTP: string) => {
    if (formData.otp === correctOTP) {
      // CLEAR OTP IMMEDIATELY FOR THE NEXT STEP
      setFormData(prev => ({ ...prev, otp: '' }));
      
      if (type === 'complete') {
        setLoading(true);
        await fetch('/api/event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vendorId: formData.username, step: 'complete' })
        });
        router.push(`/summary?vendorId=${formData.username}`);
      } else {
        // Step 2 logic: Just update status to started in DB
        await fetch('/api/event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vendorId: formData.username, step: 'start' })
        });
        setStep(3); 
      }
    } else {
      alert(`Wrong OTP! Try ${correctOTP}`);
    }
  };

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex justify-center items-center p-4 font-sans relative overflow-hidden text-slate-900">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden relative">

        {/* Dynamic Header Progress */}
        <div className="px-8 pt-8 flex justify-between items-end">
            <div>
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Zap size={18} fill="currentColor" />
                    <span className="text-xs font-black uppercase tracking-widest">Live Session</span>
                </motion.div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Zappy<span className="text-indigo-600">.</span></h1>
            </div>
            <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Progress</span>
                <span className="text-lg font-black text-slate-900">{Math.round((step / 5) * 100)}%</span>
            </div>
        </div>

        <div className="px-8 mt-4">
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(step / 5) * 100}%` }}
                />
            </div>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">

            {/* STEP 0: LOGIN */}
            {step === 0 && (
              <motion.div key="s0" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.95 }}>
                <motion.p variants={itemVariants} className="text-slate-500 font-medium mb-6">Enter credentials (zappy_vendor / password123)</motion.p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <motion.div variants={itemVariants}>
                    <input
                        type="text" placeholder="Vendor Username"
                        className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all shadow-sm"
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <input
                        type="password" placeholder="Secure Password"
                        className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-indigo-500 outline-none transition-all shadow-sm"
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                  </motion.div>
                  <motion.button className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold flex justify-center items-center gap-2 shadow-xl shadow-slate-200">
                    Authorize Session <ArrowRight size={18} />
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 1: CHECK-IN */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-xl font-bold mb-1">Check-in Required</h2>
                <p className="text-sm text-slate-500 mb-6">Arrival verification via GPS & Photo.</p>

                <div className="space-y-5">
                  <div className="relative group h-52 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden transition-all">
                    {formData.checkInPhoto ? (
                      <img src={formData.checkInPhoto} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="text-center">
                        <Camera className="text-indigo-600 mx-auto mb-2" size={32} />
                        <span className="text-xs font-bold text-slate-400 uppercase">Capture Venue</span>
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, 'checkInPhoto')} />
                      </div>
                    )}
                  </div>
                  <button onClick={handleCheckIn} disabled={!formData.checkInPhoto || loading} className="w-full bg-indigo-600 text-white p-5 rounded-3xl font-black flex justify-center items-center gap-3">
                    {loading ? <Loader2 className="animate-spin" /> : <>Verify Arrival</>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: START OTP */}
            {step === 2 && (
              <motion.div key="s2" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="text-orange-600" size={40} />
                </div>
                <h2 className="text-2xl font-black mb-2 text-slate-900">Start Code</h2>
                <p className="text-slate-500 text-sm mb-8">Enter the 4-digit code (1234)</p>
                <input
                  type="text" maxLength={4} placeholder="----"
                  className="w-full text-center text-5xl font-black tracking-[1.5rem] p-6 bg-slate-50 border-2 rounded-[2rem] mb-6 focus:border-orange-500 outline-none transition-all"
                  value={formData.otp}
                  onChange={e => setFormData({ ...formData, otp: e.target.value })}
                />
                <button onClick={() => verifyOTP('start', '1234')} className="w-full bg-orange-500 text-white p-5 rounded-3xl font-black uppercase tracking-widest text-sm">
                  Initialize Setup
                </button>
              </motion.div>
            )}

            {/* STEP 3: SETUP PROGRESS */}
            {step === 3 && (
              <motion.div key="s3" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Setup Records</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {['prePhoto', 'postPhoto'].map((id) => (
                    <div key={id} className="h-36 bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-slate-200 relative flex flex-col items-center justify-center overflow-hidden">
                        {formData[id as keyof typeof formData] ? (
                            <img src={formData[id as keyof typeof formData]} className="w-full h-full object-cover" alt="Setup" />
                        ) : (
                            <div className="text-center">
                                <ImageIcon className="text-slate-300 mx-auto mb-1" size={24} />
                                <span className="text-[10px] text-slate-400 font-black uppercase">{id === 'prePhoto' ? 'Before' : 'After'}</span>
                            </div>
                        )}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleFileUpload(e, id)} />
                    </div>
                  ))}
                </div>
                <textarea 
                    placeholder="Log setup details..."
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl h-28 outline-none mb-6 resize-none"
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                />
                <button onClick={handleSetupSync} disabled={loading} className="w-full bg-indigo-600 text-white p-5 rounded-3xl font-black flex justify-center items-center gap-2 transition-transform">
                  {loading ? <Loader2 className="animate-spin" /> : <>Finalize & Sync <Zap size={18} fill="currentColor" /></>}
                </button>
              </motion.div>
            )}

            {/* STEP 4: CLOSING OTP */}
            {step === 4 && (
              <motion.div key="s4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h2 className="text-2xl font-black mb-2 text-slate-900">Event Sign-off</h2>
                <p className="text-slate-500 text-sm mb-8">Enter Completion OTP (5678)</p>
                <input
                  type="text" maxLength={4} placeholder="----"
                  className="w-full text-center text-5xl font-black tracking-[1.5rem] p-6 bg-slate-50 border-2 rounded-[2rem] mb-6 focus:border-green-500 outline-none transition-all shadow-sm"
                  value={formData.otp}
                  onChange={e => setFormData({ ...formData, otp: e.target.value })}
                />
                <button onClick={() => verifyOTP('complete', '5678')} className="w-full bg-green-600 text-white p-5 rounded-3xl font-black uppercase shadow-xl">
                  {loading ? <Loader2 className="animate-spin mx-auto" /> : "Finish Assignment"}
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}