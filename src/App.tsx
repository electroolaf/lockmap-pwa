import { useState, useEffect } from 'react';
import Configurator from './components/Configurator';
import GridView from './components/GridView';
import SessionList from './components/SessionList';
import type { AppState, Session, Zuhaltung } from './types';

const APP_STORAGE_KEY = 'lockmap-app-state';

const defaultAppState: AppState = {
  currentSession: null,
  sessions: [],
  zuhaltungenCount: 8,
  positionsPerZuhaltung: 7,
  lockName: '',
};

function App() {
  const [appState, setAppState] = useState<AppState>(defaultAppState);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(APP_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Convert date strings back to Date objects
        if (parsed.sessions) {
          parsed.sessions = parsed.sessions.map((session: any) => ({
            ...session,
            createdAt: new Date(session.createdAt),
          }));
        }
        if (parsed.currentSession) {
          parsed.currentSession.createdAt = new Date(parsed.currentSession.createdAt);
        }
        setAppState(parsed);
      } catch (error) {
        console.error('Failed to parse saved state:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
    }
  }, [appState, isLoading]);

  const handleConfigUpdate = (zuhaltungenCount: number, positionsPerZuhaltung: number, lockName: string) => {
    setAppState(prev => ({
      ...prev,
      zuhaltungenCount,
      positionsPerZuhaltung,
      lockName,
    }));
  };

  const handleNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      name: appState.lockName || `Session ${new Date().toLocaleDateString()}`,
      createdAt: new Date(),
      zuhaltungenCount: appState.zuhaltungenCount,
      positionsPerZuhaltung: appState.positionsPerZuhaltung,
      zuhaltungen: Array.from({ length: appState.zuhaltungenCount }, (_, i): Zuhaltung => ({
        id: i + 1,
        position: 1,
        status: 'unknown',
        notes: '',
        isTesting: false,
      })),
      isActive: true,
      progress: 0,
    };

    // Mark previous sessions as inactive
    const updatedSessions = appState.sessions.map(session => ({
      ...session,
      isActive: false,
    }));

    setAppState(prev => ({
      ...prev,
      currentSession: newSession,
      sessions: [...updatedSessions, newSession],
    }));
  };

  const handleLoadSession = (sessionId: string) => {
    const session = appState.sessions.find(s => s.id === sessionId);
    if (session) {
      // Mark all sessions as inactive first
      const updatedSessions = appState.sessions.map(s => ({
        ...s,
        isActive: s.id === sessionId,
      }));

      setAppState(prev => ({
        ...prev,
        currentSession: { ...session, isActive: true },
        sessions: updatedSessions,
      }));
    }
  };

  const handleUpdateZuhaltung = (zuhaltungId: number, updates: Partial<Zuhaltung>) => {
    if (!appState.currentSession) return;

    const updatedZuhaltungen = appState.currentSession.zuhaltungen.map(z => 
      z.id === zuhaltungId ? { ...z, ...updates } : z
    );

    const progress = updatedZuhaltungen.filter(z => z.status === 'confirmed').length;

    const updatedSession: Session = {
      ...appState.currentSession,
      zuhaltungen: updatedZuhaltungen,
      progress,
    };

    // Update sessions list
    const updatedSessions = appState.sessions.map(s => 
      s.id === appState.currentSession!.id ? updatedSession : s
    );

    setAppState(prev => ({
      ...prev,
      currentSession: updatedSession,
      sessions: updatedSessions,
    }));
  };

  const handleResetAll = () => {
    if (!appState.currentSession) return;

    const resetZuhaltungen = appState.currentSession.zuhaltungen.map(z => ({
      ...z,
      position: 1,
      status: 'unknown' as const,
      notes: '',
      isTesting: false,
    }));

    const updatedSession: Session = {
      ...appState.currentSession,
      zuhaltungen: resetZuhaltungen,
      progress: 0,
    };

    const updatedSessions = appState.sessions.map(s => 
      s.id === appState.currentSession!.id ? updatedSession : s
    );

    setAppState(prev => ({
      ...prev,
      currentSession: updatedSession,
      sessions: updatedSessions,
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading LockMap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                LockMap PWA
              </h1>
              <p className="text-gray-400 text-sm mt-1">Personal tool for lock picking documentation</p>
            </div>
            <div className="text-sm text-gray-400">
              {appState.sessions.length} Session{appState.sessions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="card">
          <Configurator
            zuhaltungenCount={appState.zuhaltungenCount}
            positionsPerZuhaltung={appState.positionsPerZuhaltung}
            lockName={appState.lockName}
            onConfigUpdate={handleConfigUpdate}
            onNewSession={handleNewSession}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {appState.currentSession ? (
              <div className="card">
                <GridView
                  session={appState.currentSession}
                  onUpdateZuhaltung={handleUpdateZuhaltung}
                  onResetAll={handleResetAll}
                />
              </div>
            ) : (
              <div className="card text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-500/20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-3">Keine aktive Session</h2>
                <p className="text-gray-400 mb-8">Konfiguriere die Einstellungen oben und starte eine neue Session</p>
                <button
                  onClick={handleNewSession}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  Neue Session starten
                </button>
              </div>
            )}
          </div>

          <div>
            <div className="card h-full">
              <SessionList
                sessions={appState.sessions}
                currentSessionId={appState.currentSession?.id}
                onLoadSession={handleLoadSession}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-gray-800/50 pt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm">
              <p>LockMap PWA - Personal Edition</p>
              <p className="mt-1">Alle Daten werden lokal gespeichert</p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Autosave aktiv
              </span>
              <span>Version 1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;