import React from 'react';
import { useTestStore } from '../store/useTestStore';
import { BookOpen, PlusCircle, Play, Globe, Lock, Users, Store, Settings, LogOut, UserCircle } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { questionSets, setTestState, selectSetAndStart, openManageSet, currentUser, logout, users } = useTestStore();

  const getOwnerName = (ownerId: string) => {
    return users.find(u => u.id === ownerId)?.name || ownerId;
  };

  return (
    <div className="max-w-[1000px] mx-auto min-h-screen p-6 md:p-10">
      
      {/* Top Navigation Bar with User Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
            <UserCircle size={24} />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Logged in as</div>
            <div className="font-bold text-gray-900">{currentUser?.name} <span className="text-sm font-normal text-gray-400">@{currentUser?.id}</span></div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-red-50"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen className="text-blue-600" /> My Question Sets
        </h1>
        <button
          onClick={() => setTestState('INPUT')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow flex items-center gap-2 transition-colors"
        >
          <PlusCircle size={20} /> Create New Set
        </button>
      </div>

      {questionSets.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          <BookOpen size={48} className="mx-auto mb-4 opacity-50 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">No Question Sets Found</h2>
          <p className="mb-6">You haven't created any question sets yet.</p>
          <button
            onClick={() => setTestState('INPUT')}
            className="text-blue-600 font-bold hover:underline"
          >
            Create your first test set
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionSets.filter(set => {
            // Admins and Owners/Co-Admins see everything related to them or globally
            if (currentUser?.isAdmin) return true;
            if (currentUser?.id === set.ownerId) return true;
            if (set.coAdminIds?.includes(currentUser?.id || '')) return true;
            
            // For normal users, check visibility rules
            if (set.visibility === 'PUBLIC') return true;
            if (set.visibility === 'RESTRICTED' && set.allowedIds?.includes(currentUser?.id || '')) return true;
            
            // Private and Marketplace are hidden from normal users by default
            return false;
          }).map((set) => {
            const VisibilityIcon = set.visibility === 'PUBLIC' ? Globe : 
                                   set.visibility === 'PRIVATE' ? Lock : 
                                   set.visibility === 'MARKETPLACE' ? Store : Users;
            const visibilityColor = set.visibility === 'PUBLIC' ? 'text-green-600 bg-green-50' :
                                  set.visibility === 'PRIVATE' ? 'text-gray-600 bg-gray-100' : 
                                  set.visibility === 'MARKETPLACE' ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50';
            const visibilityLabel = set.visibility === 'PUBLIC' ? 'Public' :
                                  set.visibility === 'PRIVATE' ? 'Private' : 
                                  set.visibility === 'MARKETPLACE' ? 'Marketplace' : 'Restricted';

            const canManage = currentUser?.isAdmin || currentUser?.id === set.ownerId || set.coAdminIds?.includes(currentUser?.id || '');

            return (
              <div key={set.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow relative group mt-4">
                <div className={`absolute -top-3 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border border-white ${visibilityColor}`}>
                  <VisibilityIcon size={12} /> {visibilityLabel}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-1 truncate pr-20" title={set.name}>{set.name}</h3>
                <p className="text-xs text-gray-400 mb-4 font-medium flex items-center gap-1">
                  <UserCircle size={12} /> by {getOwnerName(set.ownerId)}
                </p>
                <p className="text-gray-500 mb-6 font-medium">{set.questions.length} questions</p>
                
                <div className="mt-auto flex gap-2">
                  {canManage && (
                    <button
                      onClick={() => openManageSet(set.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 text-sm rounded-lg font-bold flex items-center justify-center transition-colors"
                      title="Manage Set"
                    >
                      <Settings size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => selectSetAndStart(set.id)}
                    className="flex-grow bg-gray-900 hover:bg-black text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Play size={18} /> Start Test
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
