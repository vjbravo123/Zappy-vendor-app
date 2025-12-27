"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, MapPin, LayoutGrid, List, ArrowLeft, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/event')
      .then(res => res.json())
      .then(data => {
        setLogs(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-indigo-400 font-bold mb-4 hover:text-indigo-300 transition-colors">
              <ArrowLeft size={18} /> Back to Portal
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Archive</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Monitoring real-time vendor execution data.</p>
          </div>
          <div className="flex gap-3 bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            <button className="p-3 bg-white/10 rounded-xl text-white shadow-xl"><LayoutGrid size={20}/></button>
            <button className="p-3 text-slate-500 hover:text-white transition-colors"><List size={20}/></button>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white/5 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {logs.map((log, index) => (
              <motion.div 
                key={log._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-500"
              >
                {/* Main Image (Check-in Photo) */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-80" />
                  <img 
                    src={log.checkIn?.photo || 'https://via.placeholder.com/400x300?text=No+Photo'} 
                    alt="Check-in" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      {log.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 -mt-12 relative z-20">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">
                        <User size={16} className="text-indigo-400" />
                        {log.vendorId}
                      </h3>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                        <Calendar size={12} /> {new Date(log.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 cursor-pointer">
                      <ExternalLink size={20} />
                    </div>
                  </div>

                  {/* Setup Preview Thumbnails */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="h-20 rounded-2xl bg-white/5 border border-white/5 overflow-hidden group/thumb">
                        <img src={log.setup?.prePhoto} className="w-full h-full object-cover opacity-60 group-hover/thumb:opacity-100 transition-opacity" />
                    </div>
                    <div className="h-20 rounded-2xl bg-white/5 border border-white/5 overflow-hidden group/thumb">
                        <img src={log.setup?.postPhoto} className="w-full h-full object-cover opacity-60 group-hover/thumb:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Stats Footer */}
                  <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-cyan-400" />
                        Lat: {log.checkIn?.location?.lat?.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-orange-400" />
                        {new Date(log.checkIn?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && logs.length === 0 && (
          <div className="text-center py-40">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 mb-6 text-slate-600">
               <List size={48} />
            </div>
            <h2 className="text-2xl font-bold text-white">No logs found</h2>
            <p className="text-slate-500">Complete an event execution to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}