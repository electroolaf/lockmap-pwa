import React from 'react';
import type { Session } from '../types';

interface SessionListProps {
  sessions: Session[];
  currentSessionId: string | undefined;
  onLoadSession: (sessionId: string) => void;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, currentSessionId, onLoadSession }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProgressColor = (progress: number, total: number) => {
    const percentage = (progress / total) * 100;
    if (percentage === 0) return 'bg-gray-700';
    if (percentage < 50) return 'bg-yellow-700';
    if (percentage < 100) return 'bg-blue-700';
    return 'bg-green-700';
  };

  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Session-Management</h2>
          <p className="text-gray-400 text-sm">Verwalte deine bisherigen Arbeiten</p>
        </div>
      </div>
      
      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-600/20 to-pink-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-3">Noch keine Sessions</h3>
          <p className="text-gray-400 mb-6">Starte eine neue Session im Configurator.</p>
          <div className="text-xs text-gray-500 p-3 bg-gray-800/30 rounded-lg inline-block">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Autosave wird automatisch aktiviert
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 p-4 bg-gray-700/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">{sessions.length}</div>
                <div className="text-sm text-gray-400">Gespeicherte Sessions</div>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Autosave aktiv
              </div>
            </div>
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {sortedSessions.map(session => (
              <div
                key={session.id}
                className={`
                  p-5 rounded-xl cursor-pointer transition-all duration-200 border
                  ${session.id === currentSessionId 
                    ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-blue-500/50' 
                    : 'bg-gray-700/30 hover:bg-gray-700/50 border-gray-600/30'
                  }
                `}
                onClick={() => onLoadSession(session.id)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center">
                        <span className="font-bold text-gray-300">{session.zuhaltungenCount}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-100 truncate">
                          {session.name || `Session ${formatDate(session.createdAt)}`}
                        </h3>
                        <div className="text-sm text-gray-400">
                          {formatDate(session.createdAt)}
                        </div>
                      </div>
                    </div>
                    {session.isActive && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        Aktive Session
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                      {session.progress}/{session.zuhaltungenCount}
                    </div>
                    <div className="text-xs text-gray-400">
                      bestätigt
                    </div>
                  </div>
                </div>
                
                <div className="text-sm mb-4">
                  <div className="flex items-center gap-4 text-gray-300">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      {session.zuhaltungenCount} Zuhaltungen
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      {session.positionsPerZuhaltung} Positionen
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span className="text-gray-300">Fortschritt</span>
                    <span className="text-gray-100">{Math.round((session.progress / session.zuhaltungenCount) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(session.progress, session.zuhaltungenCount)} transition-all duration-300`}
                      style={{ width: `${(session.progress / session.zuhaltungenCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-600/30">
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Zuletzt bearbeitet
                  </div>
                  
                  {session.id === currentSessionId ? (
                    <div className="text-xs px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-white font-medium flex items-center gap-2">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      Aktuell geladen
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoadSession(session.id);
                      }}
                      className="text-xs px-4 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-medium transition-colors active:scale-[0.95]"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                        Laden
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="mt-8 p-5 bg-gray-700/30 rounded-xl border border-gray-600/30">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Informationen
        </h3>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p>Alle Sessions werden automatisch im localStorage gespeichert.</p>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p>Daten bleiben zwischen App-Starts erhalten (auch nach Schließen).</p>
          </div>
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p>Nur eine Session kann gleichzeitig aktiv sein.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionList;