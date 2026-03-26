import React from 'react';
import { useTestStore } from '../store/useTestStore';
import { BookOpen, PlusCircle, Play, Globe, Lock, Users, Store, Settings } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { questionSets, setTestState, selectSetAndStart, openManageSet } = useTestStore();

  return (
    <div className="max-w-[1000px] mx-auto min-h-screen p-6 md:p-10">
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
          {questionSets.map((set) => {
            const VisibilityIcon = set.visibility === 'PUBLIC' ? Globe : 
                                   set.visibility === 'PRIVATE' ? Lock : 
                                   set.visibility === 'MARKETPLACE' ? Store : Users;
            const visibilityColor = set.visibility === 'PUBLIC' ? 'text-green-600 bg-green-50' :
                                  set.visibility === 'PRIVATE' ? 'text-gray-600 bg-gray-100' : 
                                  set.visibility === 'MARKETPLACE' ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50';
            const visibilityLabel = set.visibility === 'PUBLIC' ? 'Public' :
                                  set.visibility === 'PRIVATE' ? 'Private' : 
                                  set.visibility === 'MARKETPLACE' ? 'Marketplace' : 'Restricted';

            return (
              <div key={set.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow relative group">
                <div className={`absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${visibilityColor}`}>
                  <VisibilityIcon size={12} /> {visibilityLabel}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate pr-20" title={set.name}>{set.name}</h3>
                <p className="text-gray-500 mb-6">{set.questions.length} questions</p>
                
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => openManageSet(set.id)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 text-sm rounded-lg font-bold flex items-center justify-center transition-colors"
                    title="Manage Set"
                  >
                    <Settings size={18} />
                  </button>
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
