import React from 'react';
import { useTestStore } from '../store/useTestStore';

export const RightPanel: React.FC = () => {
  const { questions, answers, finishTest } = useTestStore();

  return (
    <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded p-4 text-sm">
      <h3 className="font-bold text-gray-800 mb-4">Quiz navigation</h3>
      
      <div className="grid grid-cols-5 gap-2 mb-6">
        {questions.map((q, idx) => {
          const isAnswered = answers.find(a => a.questionId === q.id)?.selectedOptionId;
          return (
            <div 
              key={q.id} 
              className={`
                h-10 w-8 border flex items-center justify-center font-bold text-xs
                ${isAnswered ? 'border-gray-800 bg-gray-300 border-b-4' : 'border-gray-300 bg-white'}
              `}
              title={isAnswered ? "Answered" : "Not yet answered"}
            >
              {idx + 1}
            </div>
          );
        })}
      </div>

      <button 
        onClick={finishTest}
        className="text-[#0052cc] hover:underline focus:outline-none"
      >
        Finish attempt ...
      </button>
    </div>
  );
};
