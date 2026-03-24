import React from 'react';
import { useTestStore } from '../store/useTestStore';
import { Flag } from 'lucide-react';

export const LeftPanel: React.FC = () => {
  const { currentQuestionIndex, answers, questions } = useTestStore();
  const currentQuestion = questions[currentQuestionIndex];
  
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);
  const isAnswered = !!currentAnswer?.selectedOptionId;

  return (
    <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded p-4 text-sm">
      <div className="mb-4">
        <h3 className="font-bold text-red-800 text-lg mb-2">
          Question <span className="font-black text-xl">{currentQuestionIndex + 1}</span>
        </h3>
        <p className="text-gray-700 font-medium">
          {isAnswered ? 'Answer saved' : 'Not yet answered'}
        </p>
      </div>
      
      <div className="mb-4 text-gray-600">
        Marked out of 1.00
      </div>

      <button className="flex items-center gap-2 text-[#0052cc] hover:underline focus:outline-none">
        <Flag size={14} />
        <span>Flag question</span>
      </button>
    </div>
  );
};
