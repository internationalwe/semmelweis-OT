import React, { useState, useEffect } from 'react';
import { useTestStore, MOCK_USER } from '../store/useTestStore';
import { ArrowLeft, Globe, Lock, Users, Store, X, Plus } from 'lucide-react';
import type { Visibility } from '../types';

export const ManageScreen: React.FC = () => {
  const { questionSets, managingSetId, setTestState, updateSetVisibility } = useTestStore();
  const set = questionSets.find(s => s.id === managingSetId);

  const [visibility, setVisibility] = useState<Visibility>('PRIVATE');
  const [allowedIds, setAllowedIds] = useState<string[]>([]);
  const [newId, setNewId] = useState('');

  useEffect(() => {
    if (set) {
      setVisibility(set.visibility || 'PRIVATE');
      setAllowedIds(set.allowedIds || []);
    }
  }, [set]);

  if (!set) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Set not found</div>
        <button onClick={() => setTestState('HOME')} className="ml-4 text-blue-500 font-bold">Go Back</button>
      </div>
    );
  }

  const handleSave = () => {
    updateSetVisibility(set.id, visibility, allowedIds);
    setTestState('HOME');
  };

  const handleAddId = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newId.trim() && !allowedIds.includes(newId.trim())) {
      setAllowedIds([...allowedIds, newId.trim()]);
    }
    setNewId('');
  };

  const handleRemoveId = (idToRemove: string) => {
    setAllowedIds(allowedIds.filter(id => id !== idToRemove));
  };

  return (
    <div className="max-w-[800px] mx-auto min-h-screen p-6 md:p-10">
      <button 
        onClick={() => setTestState('HOME')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Question Set</h1>
          <p className="text-gray-600 font-medium text-lg">{set.name}</p>
        </div>

        <div className="p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Visibility Settings</h2>
          
          <div className="space-y-4 mb-8">
            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${visibility === 'PRIVATE' ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" checked={visibility === 'PRIVATE'} onChange={() => setVisibility('PRIVATE')} className="mt-1" />
              <div>
                <div className="font-bold text-gray-900 flex items-center gap-2"><Lock size={16}/> Private (Only Me)</div>
                <div className="text-sm text-gray-500 mt-1">Only you can see and take this test.</div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${visibility === 'RESTRICTED' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" checked={visibility === 'RESTRICTED'} onChange={() => setVisibility('RESTRICTED')} className="mt-1" />
              <div className="flex-grow w-full">
                <div className="font-bold text-gray-900 flex items-center gap-2"><Users size={16}/> Restricted (Specific IDs)</div>
                <div className="text-sm text-gray-500 mt-1 mb-3">Allow only specific users to access this test.</div>
                
                {visibility === 'RESTRICTED' && (
                  <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm w-full" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleAddId} className="flex gap-2 mb-3">
                      <input 
                        type="text" 
                        value={newId}
                        onChange={(e) => setNewId(e.target.value)}
                        placeholder="Search or enter User ID..."
                        className="flex-grow border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                      <button type="submit" className="bg-gray-800 text-white px-4 py-2.5 rounded-lg hover:bg-black transition-colors flex items-center gap-1 text-sm font-bold">
                        <Plus size={16} /> Add
                      </button>
                    </form>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {allowedIds.length === 0 && <span className="text-xs text-gray-400 italic">No users added yet.</span>}
                      {allowedIds.map(id => (
                        <div key={id} className="group flex items-center gap-1.5 bg-blue-100/50 text-blue-800 px-3 py-1.5 rounded-full text-sm font-bold border border-blue-200 hover:bg-blue-100 transition-colors">
                          {id}
                          <button type="button" onClick={() => handleRemoveId(id)} className="text-blue-400 hover:text-red-500 bg-blue-200/50 group-hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all opacity-60 cursor-not-allowed border-gray-200`}>
              <input type="radio" disabled checked={visibility === 'MARKETPLACE'} className="mt-1" />
              <div>
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <Store size={16}/> Marketplace 
                  <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ml-1 border border-purple-200">Coming Soon</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">Monetize or share your question set in the global marketplace.</div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${!MOCK_USER.isAdmin ? 'opacity-60 cursor-not-allowed border-gray-200' : visibility === 'PUBLIC' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300 cursor-pointer'}`}>
              <input type="radio" checked={visibility === 'PUBLIC'} disabled={!MOCK_USER.isAdmin} onChange={() => setVisibility('PUBLIC')} className="mt-1" />
              <div>
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <Globe size={16}/> Public (Everyone)
                  {!MOCK_USER.isAdmin && <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ml-1 border border-red-200">Admin Only</span>}
                </div>
                <div className="text-sm text-gray-500 mt-1">Make this test globally available to all users on the platform.</div>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
