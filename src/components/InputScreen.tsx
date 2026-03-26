import React, { useState, useRef } from 'react';
import { useTestStore } from '../store/useTestStore';
import Papa from 'papaparse';
import type { Question } from '../types';

export const InputScreen: React.FC = () => {
  const { addQuestionSet, setTestState, currentUser } = useTestStore();
  const [mode, setMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
  const [setName, setSetName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Manual Input State
  const [manualQs, setManualQs] = useState<Question[]>([]);
  const [qText, setQText] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [optE, setOptE] = useState('');
  const [correctKey, setCorrectKey] = useState('A');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!setName.trim()) {
      alert("Please enter a Set Name first!");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedQuestions: Question[] = results.data.map((row: any, idx) => {
          return {
            id: `q-${idx}-${Date.now()}`,
            text: row['Question'] || 'Empty Question',
            correctAnswerId: row['정답'] || row['Answer'] || 'A',
            options: [
              { id: 'A', text: row['A'] || '' },
              { id: 'B', text: row['B'] || '' },
              { id: 'C', text: row['C'] || '' },
              { id: 'D', text: row['D'] || '' },
              { id: 'E', text: row['E'] || '' },
            ]
          };
        });
        
        addQuestionSet({
          id: `set-${Date.now()}`,
          name: setName,
          ownerId: currentUser?.id || 'unknown',
          coAdminIds: [],
          questions: parsedQuestions,
          visibility: 'PRIVATE',
          allowedIds: []
        });
      }
    });
  };

  const addManualQuestion = () => {
    if (!qText.trim()) return;
    const newQ: Question = {
      id: `m-${Date.now()}`,
      text: qText,
      correctAnswerId: correctKey,
      options: [
        { id: 'A', text: optA },
        { id: 'B', text: optB },
        { id: 'C', text: optC },
        { id: 'D', text: optD },
        { id: 'E', text: optE },
      ]
    };
    setManualQs(prev => [...prev, newQ]);
    
    // Reset Form
    setQText('');
    setOptA(''); setOptB(''); setOptC(''); setOptD(''); setOptE('');
    setCorrectKey('A');
  };

  const saveManualSet = () => {
    if (!setName.trim()) {
      alert("Please enter a Set Name!");
      return;
    }
    addQuestionSet({
      id: `set-${Date.now()}`,
      name: setName,
      ownerId: currentUser?.id || 'unknown',
      coAdminIds: [],
      questions: manualQs,
      visibility: 'PRIVATE',
      allowedIds: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-gray-900 p-8 text-white flex flex-col relative">
          <button 
            onClick={() => setTestState('HOME')}
            className="absolute top-4 left-4 text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          <h2 className="text-3xl font-bold mb-2 mt-4">Test Setup</h2>
          <p className="text-gray-400 mb-8">Prepare your question set.</p>
          
          <div className="space-y-4 mt-auto md:mt-0 flex-grow">
            <button 
              onClick={() => setMode('AUTO')}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                mode === 'AUTO' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="font-bold text-lg">Automatic Upload</div>
              <div className="text-sm opacity-80 mt-1">Upload CSV or Excel file</div>
            </button>
            <button 
              onClick={() => setMode('MANUAL')}
              className={`w-full text-left p-4 rounded-xl transition-all ${
                mode === 'MANUAL' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <div className="font-bold text-lg">Manual Entry</div>
              <div className="text-sm opacity-80 mt-1">Type questions one by one</div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full md:w-2/3 p-8 md:p-12 overflow-y-auto max-h-screen">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Question Set Name</label>
              <input 
                type="text" 
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                placeholder="e.g. Biology Midterm"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <hr className="my-6 border-gray-100" />

          {mode === 'AUTO' ? (
            <div className="h-[300px] flex flex-col justify-center items-center text-center">
              <div className={`border-2 border-dashed border-gray-300 rounded-2xl p-12 w-full transition-colors relative
                ${!setName.trim() ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-gray-50 hover:bg-gray-100 hover:border-blue-400 cursor-pointer'}
              `}>
                <input 
                  type="file" 
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  disabled={!setName.trim()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="text-4xl mb-4">📄</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Upload CSV File</h3>
                <p className="text-gray-500 text-sm">
                  File must contain columns: Question, A, B, C, D, E, <strong className="text-red-500">정답</strong>
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Add Question</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                  {manualQs.length} Added
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <textarea 
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="Enter question text..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    rows={2}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D', 'E'].map((letter) => {
                    const val = letter === 'A' ? optA : letter === 'B' ? optB : letter === 'C' ? optC : letter === 'D' ? optD : optE;
                    const setter = letter === 'A' ? setOptA : letter === 'B' ? setOptB : letter === 'C' ? setOptC : letter === 'D' ? setOptD : setOptE;
                    
                    return (
                      <div key={letter} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                        <div className="w-6 h-6 rounded shrink-0 bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-600 text-xs">
                          {letter}
                        </div>
                        <input 
                          type="text" 
                          value={val}
                          onChange={(e) => setter(e.target.value)}
                          placeholder={`Option ${letter}`}
                          className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-gray-800"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center mt-2 border-b border-gray-100 pb-4">
                   <div className="flex items-center gap-3">
                     <label className="text-sm font-semibold text-gray-700">Correct Answer:</label>
                     <select 
                       value={correctKey} 
                       onChange={(e) => setCorrectKey(e.target.value)}
                       className="border border-gray-300 rounded p-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                     >
                       {['A', 'B', 'C', 'D', 'E'].map(o => <option key={o} value={o}>{o}</option>)}
                     </select>
                   </div>
                   <button 
                     onClick={addManualQuestion}
                     className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                   >
                     + Add to Set
                   </button>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={saveManualSet}
                    disabled={manualQs.length === 0 || !setName.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-500/30"
                  >
                    Save Set ({manualQs.length} questions)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
