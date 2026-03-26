import { useTestStore } from './store/useTestStore';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { ManageScreen } from './components/ManageScreen';
import { InputScreen } from './components/InputScreen';
import { TestLayout } from './components/TestLayout';
import { ResultScreen } from './components/ResultScreen';

function App() {
  const { testState } = useTestStore();

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#172b4d] font-sans antialiased">
      {testState === 'LOGIN' && <LoginScreen />}
      {testState === 'HOME' && <HomeScreen />}
      {testState === 'INPUT' && <InputScreen />}
      {testState === 'TAKING' && <TestLayout />}
      {testState === 'RESULT' && <ResultScreen />}
      {testState === 'MANAGE_SET' && <ManageScreen />}
    </div>
  );
}

export default App;
