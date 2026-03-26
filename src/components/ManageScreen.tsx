import React, { useState, useEffect } from 'react';
import { useTestStore } from '../store/useTestStore';
import { ArrowLeft, Globe, Lock, Users as UsersIcon, Store, X, Plus, AlertCircle, Shield, Pencil } from 'lucide-react';
import type { Visibility } from '../types';

export const ManageScreen: React.FC = () => {
  const { questionSets, managingSetId, setTestState, updateSetVisibility, currentUser, users, transferOwnership, addCoAdmin, removeCoAdmin } = useTestStore();
  const set = questionSets.find(s => s.id === managingSetId);

  const [visibility, setVisibility] = useState<Visibility>('PRIVATE');
  const [allowedIds, setAllowedIds] = useState<string[]>([]);
  const [newId, setNewId] = useState('');
  const [idError, setIdError] = useState('');
  
  const [transferId, setTransferId] = useState('');
  const [transferError, setTransferError] = useState('');
  const [transferSuccess, setTransferSuccess] = useState('');

  const [coAdminId, setCoAdminId] = useState('');
  const [coAdminError, setCoAdminError] = useState('');

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
    setIdError('');
    const idToAdd = newId.trim();
    if (!idToAdd) return;
    
    // Check if user exists
    const userExists = users.some(u => u.id === idToAdd);
    if (!userExists) {
      setIdError('User ID not found in the system.');
      return;
    }

    if (!allowedIds.includes(idToAdd)) {
      setAllowedIds([...allowedIds, idToAdd]);
    } else {
      setIdError('User already added.');
      return;
    }
    setNewId('');
  };

  const handleTransfer = () => {
    setTransferError('');
    setTransferSuccess('');
    const idToTransfer = transferId.trim();
    if (!idToTransfer) return;

    if (idToTransfer === currentUser?.id) {
      setTransferError('You already own this set.');
      return;
    }

    const success = transferOwnership(set.id, idToTransfer);
    if (success) {
      setTransferSuccess(`Ownership successfully transferred to ${idToTransfer}.`);
      setTransferId('');
    } else {
      setTransferError('User ID not found or invalid.');
    }
  };

  const handleAddCoAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setCoAdminError('');
    const idToAdd = coAdminId.trim();
    if (!idToAdd) return;
    
    if (idToAdd === set.ownerId) return setCoAdminError('User is already the primary owner.');
    if (set.coAdminIds?.includes(idToAdd)) return setCoAdminError('User is already a Co-Admin.');

    const success = addCoAdmin(set.id, idToAdd);
    if (success) {
      setCoAdminId('');
    } else {
      setCoAdminError('User ID not found.');
    }
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
                <div className="font-bold text-gray-900 flex items-center gap-2"><UsersIcon size={16}/> Restricted (Specific IDs)</div>
                <div className="text-sm text-gray-500 mt-1 mb-3">Allow only specific users to access this test.</div>
                
                {visibility === 'RESTRICTED' && (
                  <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm w-full" onClick={(e) => e.stopPropagation()}>
                    <form onSubmit={handleAddId} className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={newId}
                        onChange={(e) => { setNewId(e.target.value); setIdError(''); }}
                        placeholder="Search User ID to add..."
                        className="flex-grow border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      />
                      <button type="submit" className="bg-gray-800 text-white px-4 py-2.5 rounded-lg hover:bg-black transition-colors flex items-center gap-1 text-sm font-bold">
                        <Plus size={16} /> Add
                      </button>
                    </form>
                    {idError && <p className="text-red-500 text-xs font-bold mb-3 flex items-center gap-1"><AlertCircle size={12}/> {idError}</p>}
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

            <label className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${!currentUser?.isAdmin ? 'opacity-60 cursor-not-allowed border-gray-200' : visibility === 'PUBLIC' ? 'border-green-600 bg-green-50' : 'border-gray-200 hover:border-gray-300 cursor-pointer'}`}>
              <input type="radio" checked={visibility === 'PUBLIC'} disabled={!currentUser?.isAdmin} onChange={() => setVisibility('PUBLIC')} className="mt-1" />
              <div>
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <Globe size={16}/> Public (Everyone)
                  {!currentUser?.isAdmin && <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ml-1 border border-red-200">Admin Only</span>}
                </div>
                <div className="text-sm text-gray-500 mt-1">Make this test globally available to all users on the platform.</div>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100 mb-8">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-500/20"
            >
              Save Changes
            </button>
          </div>

          {/* Edit Questions Area */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mt-8 mb-8 shadow-sm">
            <div className="bg-white p-6 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1">
                  <Pencil size={18} className="text-blue-500" /> Edit Questions
                </h3>
                <p className="text-sm text-gray-500">Modify existing questions or delete them.</p>
              </div>
              <button 
                onClick={() => alert("Edit questions feature coming soon!")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg font-bold transition-colors shadow-sm"
              >
                Edit ({set.questions.length})
              </button>
            </div>
          </div>

          {/* Danger Zone / Admin Panel */}
          {currentUser?.id === set.ownerId && (
            <div className="border border-red-200 rounded-xl overflow-hidden mt-8">
              <div className="bg-red-50 p-4 border-b border-red-200">
                <h3 className="font-bold text-red-800 flex items-center gap-2">
                  <AlertCircle size={18} /> Danger Zone: Transfer Ownership
                </h3>
              </div>
              <div className="p-6 bg-white">
                <p className="text-sm text-gray-600 mb-4">
                  Transferring ownership will give another user complete control over this Question Set. 
                  You will lose Administrative access unless the new owner grants it back explicitly.
                </p>
                <div className="flex gap-3">
                  <div className="flex-grow">
                    <input 
                      type="text" 
                      value={transferId}
                      onChange={(e) => { setTransferId(e.target.value); setTransferError(''); setTransferSuccess(''); }}
                      placeholder="Enter new owner's User ID..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    />
                    {transferError && <p className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1"><AlertCircle size={12}/> {transferError}</p>}
                    {transferSuccess && <p className="text-green-600 text-xs font-bold mt-2">✓ {transferSuccess}</p>}
                  </div>
                  <button 
                    onClick={handleTransfer}
                    disabled={!transferId.trim()}
                    className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-bold disabled:opacity-50 h-fit"
                  >
                    Transfer
                  </button>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-red-100">
                <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                  <Shield size={16} className="text-gray-500" /> Add Co-Admin (관리자 추가)
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Co-Admins can edit questions, change visibility, and add other admins.
                </p>
                <form onSubmit={handleAddCoAdmin} className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={coAdminId}
                    onChange={(e) => { setCoAdminId(e.target.value); setCoAdminError(''); }}
                    placeholder="Enter User ID..."
                    className="flex-grow border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
                  />
                  <button type="submit" className="bg-gray-800 text-white px-4 py-2.5 rounded-lg hover:bg-black font-bold text-sm">
                    Add
                  </button>
                </form>
                {coAdminError && <p className="text-red-500 text-xs font-bold -mt-2 mb-3">{coAdminError}</p>}
                
                <div className="flex flex-wrap gap-2">
                  {(!set.coAdminIds || set.coAdminIds.length === 0) && <span className="text-xs text-gray-400 italic">No co-admins.</span>}
                  {set.coAdminIds?.map(id => (
                    <div key={id} className="group flex items-center gap-1.5 bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-sm font-bold border border-gray-300">
                      {id}
                      <button onClick={() => removeCoAdmin(set.id, id)} className="text-gray-500 hover:text-red-500 hover:bg-gray-300 rounded-full p-0.5 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
