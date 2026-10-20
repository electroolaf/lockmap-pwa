import React from 'react';
import type { Session, Zuhaltung } from '../types';
import ZuhaltungTile from './ZuhaltungTile';

interface GridViewProps {
  session: Session;
  onUpdateZuhaltung: (zuhaltungId: number, updates: Partial<Zuhaltung>) => void;
  onResetAll: () => void;
}

const GridView: React.FC<GridViewProps> = ({ session, onUpdateZuhaltung, onResetAll }) => {
  const handleSliderChange = (zuhaltungId: number, position: number) => {
    onUpdateZuhaltung(zuhaltungId, {
      position,
      status: position > 1 ? 'suspected' : 'unknown',
    });
  };

  const handleNotesChange = (zuhaltungId: number, notes: string) => {
    onUpdateZuhaltung(zuhaltungId, { notes });
  };

  const handleToggleTesting = (zuhaltungId: number) => {
    const zuhaltung = session.zuhaltungen.find(z => z.id === zuhaltungId);
    if (zuhaltung) {
      // First, turn off testing for all other zuhaltungen
      session.zuhaltungen.forEach(z => {
        if (z.id !== zuhaltungId && z.isTesting) {
          onUpdateZuhaltung(z.id, { isTesting: false });
        }
      });
      
      // Then toggle the clicked one
      onUpdateZuhaltung(zuhaltungId, { isTesting: !zuhaltung.isTesting });
    }
  };

  const handleConfirm = (zuhaltungId: number) => {
    onUpdateZuhaltung(zuhaltungId, { status: 'confirmed', isTesting: false });
  };

  const progressPercentage = session.progress > 0 
    ? Math.round((session.progress / session.zuhaltungenCount) * 100) 
    : 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Zuhaltungs-Grid</h2>
            <div className="text-sm text-gray-400">
              {session.name} • {new Date(session.createdAt).toLocaleDateString('de-DE')}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2 bg-gray-700/50 rounded-lg">
            <div className="text-lg font-bold">{session.progress}/{session.zuhaltungenCount}</div>
            <div className="text-xs text-gray-400">bestätigt</div>
          </div>
          <button
            onClick={onResetAll}
            className="btn-danger"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Alle zurücksetzen
            </span>
          </button>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-300">Gesamtfortschritt</div>
          <div className="text-lg font-bold">{progressPercentage}%</div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Start</span>
          <span className="font-medium">{session.progress} von {session.zuhaltungenCount}</span>
          <span>Fertig</span>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {session.zuhaltungen.map(zuhaltung => (
          <ZuhaltungTile
            key={zuhaltung.id}
            zuhaltung={zuhaltung}
            maxPosition={session.positionsPerZuhaltung}
            onSliderChange={(position) => handleSliderChange(zuhaltung.id, position)}
            onNotesChange={(notes) => handleNotesChange(zuhaltung.id, notes)}
            onToggleTesting={() => handleToggleTesting(zuhaltung.id)}
            onConfirm={() => handleConfirm(zuhaltung.id)}
          />
        ))}
      </div>

      <div className="p-5 bg-gray-700/50 rounded-xl border border-gray-600/50">
        <h3 className="font-medium mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Legende & Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
            <div className="w-6 h-6 rounded status-unknown flex items-center justify-center">
              <span className="text-xs font-bold">?</span>
            </div>
            <div>
              <div className="font-medium text-sm">Unbekannt</div>
              <div className="text-xs text-gray-400">Noch nicht angefasst</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
            <div className="w-6 h-6 rounded status-suspected flex items-center justify-center">
              <span className="text-xs font-bold">!</span>
            </div>
            <div>
              <div className="font-medium text-sm">Vermutung</div>
              <div className="text-xs text-gray-400">Aktuelle Position</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
            <div className="w-6 h-6 rounded status-confirmed flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <div className="font-medium text-sm">Bestätigt</div>
              <div className="text-xs text-gray-400">Getestet & gesichert</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
            <div className="w-6 h-6 rounded border-2 border-blue-500 border-dashed flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div>
              <div className="font-medium text-sm">Test-Modus</div>
              <div className="text-xs text-gray-400">Aktive Untersuchung</div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-300 p-4 bg-gray-800/30 rounded-lg">
          <p className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-medium">Tipp:</span> Tippe auf eine Zuhaltung, um sie in den Test-Modus zu setzen.
          </p>
          <p className="text-gray-400">
            Im Test-Modus kannst du Notizen speichern und die Zuhaltung als bestätigt markieren.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GridView;