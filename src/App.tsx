
import { useTestStore } from './store/useTestStore';
import { HomeScreen } from './components/HomeScreen';
import { InputScreen } from './components/InputScreen';
import { TestLayout } from './components/TestLayout';
import { ResultScreen } from './components/ResultScreen';

function App() {
  const { testState } = useTestStore();

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#172b4d] font-sans antialiased">
      {testState === 'HOME' && <HomeScreen />}
      {testState === 'INPUT' && <InputScreen />}
      {testState === 'TAKING' && <TestLayout />}
      {testState === 'RESULT' && <ResultScreen />}
    </div>
  );
}

export default App;
