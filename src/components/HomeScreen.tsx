import React from 'react';
import { useTestStore } from '../store/useTestStore';
import { BookOpen, PlusCircle, Play, Trash2 } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { questionSets, setTestState, selectSetAndStart, deleteQuestionSet } = useTestStore();

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
          {questionSets.map((set) => (
            <div key={set.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800 truncate pr-2" title={set.name}>{set.name}</h3>
                <button 
                  onClick={() => deleteQuestionSet(set.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1 -mt-1 -mr-1"
                  title="Delete Set"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-gray-500 mb-6">{set.questions.length} questions</p>
              
              <button
                onClick={() => selectSetAndStart(set.id)}
                className="mt-auto w-full bg-gray-900 hover:bg-black text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Play size={18} /> Start Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
