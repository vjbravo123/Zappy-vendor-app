"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Clock, Camera, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

// 1. Move the logic into a separate internal component
function SummaryContent() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendorId');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (vendorId) {
      fetch(`/api/event?vendorId=${vendorId}`)
        .then(res => res.json())
        .then(json => setData(json));
    }
  }, [vendorId]);

  if (!data) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-4 md:p-8 font-sans relative overflow-hidden text-slate-900">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 blur-[100px] rounded-full" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Success Header */}
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-10"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Assignment Verified</h1>
          <p className="text-slate-400 mt-2">Vendor: <span className="text-indigo-400 font-bold">{vendorId}</span></p>
        </motion.div>

        {/* Execution Dashboard Card */}
        <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-8 bg-indigo-500/10 w-fit px-4 py-2 rounded-full border border-indigo-500/20">
            <Zap size={16} className="text-indigo-400" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Completion Report</span>
          </div>

          {/* Image Masonry Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="md:col-span-2 relative h-64 rounded-3xl overflow-hidden border border-white/10 group">
                <img src={data.checkIn?.photo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Arrival" />
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-2">
                    <Camera size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-bold uppercase text-white">Arrival Verification</span>
                </div>
            </div>
            
            <div className="relative h-48 rounded-3xl overflow-hidden border border-white/10 group">
                <img src={data.setup?.prePhoto} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Pre" />
                <div className="absolute top-4 left-4 bg-indigo-600 px-3 py-1 rounded-full text-[9px] font-black uppercase text-white">Pre-Setup</div>
            </div>
            <div className="relative h-48 rounded-3xl overflow-hidden border border-white/10 group">
                <img src={data.setup?.postPhoto} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Post" />
                <div className="absolute top-4 left-4 bg-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase text-white">Post-Setup</div>
            </div>
          </div>

          {/* Details & Location Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 rounded-3xl p-6 border border-white/5">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Venue Coordinates</p>
                        <p className="text-sm font-bold text-white">{data.checkIn?.location?.lat?.toFixed(4)}, {data.checkIn?.location?.lng?.toFixed(4)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Arrival Time</p>
                        <p className="text-sm font-bold text-white">{new Date(data.checkIn?.timestamp).toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>
            <div className="border-l border-white/10 pl-0 md:pl-6">
                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Vendor Notes</p>
                <p className="text-sm text-slate-300 italic">"{data.setup?.notes || 'No notes provided for this session.'}"</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-xl border border-green-400/20">
                <ShieldCheck size={18} />
                <span className="text-xs font-bold uppercase">Verified Entry</span>
            </div>
            <Link href="/" className="group flex items-center gap-2 text-indigo-400 font-black text-sm uppercase tracking-widest hover:text-white transition-colors">
                Back to Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// 2. Export the main page wrapped in Suspense
export default function SummaryPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
        </div>
    }>
      <SummaryContent />
    </Suspense>
  );
}