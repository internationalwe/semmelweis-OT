import React, { useEffect } from 'react';
import { useTestStore } from '../store/useTestStore';

export const CenterPanel: React.FC = () => {
  const { 
    questions, 
    currentQuestionIndex, 
    answers, 
    submitAnswer, 
    nextQuestion,
    timeRemainingSeconds,
    tickTimer,
    timerActive
  } = useTestStore();

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      tickTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, tickTimer]);

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return <div>No questions available.</div>;

  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);
  const selectedOptionId = currentAnswer?.selectedOptionId || null;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionChange = (optionId: string) => {
    submitAnswer(currentQuestion.id, optionId);
  };

  return (
    <div className="flex flex-col h-full bg-[#eef4f8] rounded-lg overflow-hidden">
      {/* Timer Bar */}
      <div className="flex justify-end p-4 border-b border-gray-200 bg-white">
        <div className="bg-white border border-[#d2ddec] text-[#a53b47] px-3 py-1 rounded text-sm font-bold shadow-sm">
          Time left {formatTime(timeRemainingSeconds)}
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6 md:p-8 flex-grow">
        <div className="text-gray-800 text-base mb-6 leading-relaxed bg-[#dae6ef] p-6 rounded shadow-inner">
          {currentQuestion.text}
          {currentQuestion.imageUrl && (
            <img 
              src={currentQuestion.imageUrl} 
              alt="Question" 
              className="mt-4 max-w-full rounded shadow-sm"
            />
          )}
        </div>

        <div className="mb-4 text-sm font-semibold text-gray-700">Select one:</div>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <label 
              key={option.id} 
              className="flex items-start gap-3 p-2 rounded cursor-pointer hover:bg-[#c9dae8] transition-colors"
            >
              <input 
                type="radio" 
                name={`question-${currentQuestion.id}`}
                value={option.id}
                checked={selectedOptionId === option.id}
                onChange={() => handleOptionChange(option.id)}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="text-gray-800">
                <span className="font-semibold mr-2">{option.id}.</span> 
                {option.text}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 bg-white border-t border-gray-200 flex justify-end">
        <button
          onClick={nextQuestion}
          className="bg-[#0070a3] hover:bg-[#005a84] text-white px-5 py-2 rounded font-medium shadow transition-colors"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish attempt ...' : 'Next page'}
        </button>
      </div>
    </div>
  );
};
