import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Target, Calendar, Mail, Phone } from 'lucide-react';
import { MOCK_CLIENTS } from '../data/clients';

export const ClientsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = MOCK_CLIENTS.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500">Manage your active roster and check-ins.</p>
        </div>
        <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Filter size={18} /> Filter
            </button>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors shadow-sm">
                + Add Client
            </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <input 
            type="text" 
            placeholder="Search clients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => (
            <div key={client.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group relative">
                <div className="absolute top-4 right-4">
                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold border-2 border-white shadow-sm ring-2 ring-emerald-50">
                        {client.initials}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">{client.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${
                            client.status === 'Active' ? 'bg-green-100 text-green-700' :
                            client.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-500'
                        }`}>
                            {client.status}
                        </span>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Target size={16} className="text-slate-400" />
                        <span>Goal: <span className="font-medium text-slate-900">{client.goal}</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Calendar size={16} className="text-slate-400" />
                        <span>Last active: <span className="font-medium text-slate-900">{client.lastCheckIn}</span></span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <div className="w-4 flex justify-center text-slate-400 font-bold text-xs">Cal</div>
                        <span>Target: <span className="font-medium text-slate-900">{client.targetCalories} kcal</span></span>
                    </div>
                </div>

                <div className="flex gap-2 border-t border-slate-100 pt-4">
                     <button className="flex-1 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
                        View Profile
                     </button>
                     <button className="flex-1 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors">
                        Assign Plan
                     </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};