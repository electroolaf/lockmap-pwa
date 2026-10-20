import React, { useState } from 'react';

interface ConfiguratorProps {
  zuhaltungenCount: number;
  positionsPerZuhaltung: number;
  lockName: string;
  onConfigUpdate: (zuhaltungenCount: number, positionsPerZuhaltung: number, lockName: string) => void;
  onNewSession: () => void;
}

const Configurator: React.FC<ConfiguratorProps> = ({
  zuhaltungenCount,
  positionsPerZuhaltung,
  lockName,
  onConfigUpdate,
  onNewSession,
}) => {
  const [localZuhaltungen, setLocalZuhaltungen] = useState(zuhaltungenCount);
  const [localPositions, setLocalPositions] = useState(positionsPerZuhaltung);
  const [localLockName, setLocalLockName] = useState(lockName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfigUpdate(localZuhaltungen, localPositions, localLockName);
  };

  const handleStartSession = () => {
    onConfigUpdate(localZuhaltungen, localPositions, localLockName);
    onNewSession();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Schloss-Konfigurator</h2>
          <p className="text-gray-400 text-sm">Passe die Parameter für deine aktuelle Arbeit an</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Anzahl Zuhaltungen
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={localZuhaltungen}
              onChange={(e) => setLocalZuhaltungen(parseInt(e.target.value) || 1)}
              className="input-field text-lg font-medium text-center"
            />
            <div className="mt-3 text-sm text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Typisch: 4-8 Zuhaltungen
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Positionen pro Zuhaltung
            </label>
            <input
              type="number"
              min="1"
              max="15"
              value={localPositions}
              onChange={(e) => setLocalPositions(parseInt(e.target.value) || 1)}
              className="input-field text-lg font-medium text-center"
            />
            <div className="mt-3 text-sm text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Typisch: 5-7 Positionen
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Schloss-Name (optional)
            </label>
            <input
              type="text"
              value={localLockName}
              onChange={(e) => setLocalLockName(e.target.value)}
              placeholder="z.B. Mauer Variator - Kunde Müller"
              className="input-field"
            />
            <div className="mt-3 text-sm text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Für Session-Identifikation
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-700/50">
          <button
            type="submit"
            className="btn-secondary"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Einstellungen speichern
            </span>
          </button>
          
          <button
            type="button"
            onClick={handleStartSession}
            className="btn-primary"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Neue Session starten
            </span>
          </button>
        </div>
      </form>

      <div className="mt-8 p-5 bg-gray-700/50 rounded-xl border border-gray-600/50">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Aktuelle Konfiguration
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{zuhaltungenCount}</div>
            <div className="text-sm text-gray-400">Zuhaltungen</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{positionsPerZuhaltung}</div>
            <div className="text-sm text-gray-400">Positionen/Zuhaltung</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-xl font-bold text-yellow-400 truncate">{lockName || '–'}</div>
            <div className="text-sm text-gray-400">Schloss-Name</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{zuhaltungenCount * positionsPerZuhaltung}</div>
            <div className="text-sm text-gray-400">Gesamtpositionen</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurator;