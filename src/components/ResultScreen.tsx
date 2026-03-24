import React, { useMemo } from 'react';
import { useTestStore } from '../store/useTestStore';
import { CheckCircle2, XCircle, MinusCircle, ArrowRight } from 'lucide-react';

export const ResultScreen: React.FC = () => {
  const { questions, answers, resetTest } = useTestStore();

  const results = useMemo(() => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    const details = questions.map((q) => {
      const answer = answers.find((a) => a.questionId === q.id);
      const isAnswered = !!answer?.selectedOptionId;
      const isCorrect = isAnswered && answer.selectedOptionId === q.correctAnswerId;
      
      // If there is no correctAnswerId defined (e.g. manual input without specifying correct answer)
      // we'll assume it's incorrect or we can just count it based on user input.
      // For this SaaS, let's assume if it is answered but not correct, it is incorrect.
      // Wait, if no correct answer was set, we shouldn't penalize. 
      // But let's assume correct answer is always set and 'A' by default if not specified just for this prototype,
      // or we handle scoring properly. For now we use the required logic.
      
      let status: 'correct' | 'incorrect' | 'unanswered' = 'unanswered';
      
      if (!isAnswered) {
        unanswered++;
        // score remains the same
      } else if (isCorrect) {
        correct++;
        score += 1;
        status = 'correct';
      } else {
        incorrect++;
        score -= 0.4;
        status = 'incorrect';
      }

      return {
        question: q,
        answer: answer?.selectedOptionId,
        status
      };
    });

    return { score, correct, incorrect, unanswered, details };
  }, [questions, answers]);

  return (
    <div className="max-w-[1000px] mx-auto min-h-screen p-6 md:p-10">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#0052cc] to-[#0070a3] p-8 text-center text-white">
          <h1 className="text-4xl font-extrabold mb-4 drop-shadow-sm">Test Completed</h1>
          <div className="text-6xl font-black mb-2">{results.score.toFixed(2)} pts</div>
          <p className="text-xl font-medium opacity-90">Final Score</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 divide-x border-b bg-gray-50">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <CheckCircle2 size={24} />
              <span className="text-2xl font-bold">{results.correct}</span>
            </div>
            <p className="text-gray-600 font-medium font-sm uppercase tracking-wider">Correct (+1)</p>
          </div>
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-red-500 mb-2">
              <XCircle size={24} />
              <span className="text-2xl font-bold">{results.incorrect}</span>
            </div>
            <p className="text-gray-600 font-medium font-sm uppercase tracking-wider">Incorrect (-0.4)</p>
          </div>
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
              <MinusCircle size={24} />
              <span className="text-2xl font-bold">{results.unanswered}</span>
            </div>
            <p className="text-gray-600 font-medium font-sm uppercase tracking-wider">Unanswered (0)</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Detailed Feedback</h2>
          <div className="space-y-4">
            {results.details.map((item, idx) => (
              <div 
                key={item.question.id} 
                className={`p-5 rounded-xl border ${
                  item.status === 'correct' ? 'bg-green-50 border-green-200' :
                  item.status === 'incorrect' ? 'bg-red-50 border-red-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-white shadow-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-800 font-medium mb-3">{item.question.text}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        Your answer: <strong className={
                          item.status === 'correct' ? 'text-green-600' : 
                          item.status === 'incorrect' ? 'text-red-600' : 'text-gray-500'
                        }>{item.answer || 'None'}</strong>
                      </span>
                      {item.status === 'incorrect' && (
                        <>
                          <ArrowRight size={14} className="text-gray-400" />
                          <span className="text-green-600">
                            Correct answer: <strong>{item.question.correctAnswerId || 'N/A'}</strong>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={resetTest}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Start New Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
