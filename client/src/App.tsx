import { useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { ToastContainer } from './components/common/Toast';
import { useUIStore } from './stores/uiStore';
import { useProjectStore } from './stores/projectStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutosave } from './hooks/useAutosave';

function App() {
  const theme = useUIStore((s) => s.theme);
  const showWelcome = useUIStore((s) => s.showWelcome);
  const project = useProjectStore((s) => s.project);

  useKeyboardShortcuts();
  useAutosave();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="h-screen w-screen overflow-hidden">
      {!project && showWelcome ? <WelcomeScreen /> : <AppShell />}
      <ToastContainer />
    </div>
  );
}

export default App;
