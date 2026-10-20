# iPhone PWA Test - LockMap PWA

## Aktuelle Server-URLs

**HTTPS Development Server:**
```
https://192.168.100.94:5173
```

## iPhone Test-Anleitung

### Voraussetzungen

1. **iPhone und Computer müssen im gleichen WLAN sein**
2. **HTTPS erforderlich** (bereits konfiguriert)
3. **Keine Firewall-Blockierung** des Ports 5173

### Test-Schritte

#### 1. Lokales Netzwerk finden
- Auf dem iPhone: Einstellungen → WLAN → Gleiches Netzwerk wie Computer wählen
- Notieren Sie die IP-Adresse des iPhones (falls erforderlich)

#### 2. App im Safari öffnen
- Safari auf iPhone öffnen
- URL eingeben: `https://192.168.100.94:5173`
- **Wichtig:** "https://" nicht vergessen!

#### 3. Zertifikat-Warnung umgehen
- Safari zeigt "Nicht sicher" oder Zertifikat-Warnung
- Auf "Weiter" oder "Fortfahren" tippen
- Bei "Nicht vertrauenswürdiges Zertifikat": auf "Weiter zur Website" tippen

#### 4. PWA installieren
- Wenn die App lädt: Teilen-Button (Quadrat mit Pfeil nach oben) tippen
- Nach unten scrollen → "Zum Home-Bildschirm hinzufügen" wählen
- Name bestätigen → "Hinzufügen" tippen

#### 5. App starten
- Auf dem Home-Bildschirm: LockMap Icon tippen
- App sollte ohne Safari-Navigation starten (Standalone-Modus)

### Fehlerbehebung

#### Problem: Seite lädt nicht
- Prüfen Sie, ob beide Geräte im gleichen WLAN sind
- Temporär Firewall auf Computer deaktivieren
- IP-Adresse aktualisieren (kann sich ändern): `ipconfig` auf Windows

#### Problem: HTTPS-Fehler
- Safari-Einstellungen → Erweitert → Website-Daten löschen
- Erneut versuchen

#### Problem: Installationsoption fehlt
- Sicherstellen, dass Manifest korrekt geladen wird
- In Safari: Entwickler-Menü aktivieren (Einstellungen → Safari → Erweitert → Web-Inspektor)
- Console öffnen: auf Fehler prüfen

### Alternative Test-Methoden

#### 1. Ngrok für öffentliche URL
```bash
npm install -g ngrok
ngrok http https://localhost:5173
```
- Öffentliche HTTPS-URL erhalten
- Auf iPhone diese URL öffnen

#### 2. LocalTunnel
```bash
npm install -g localtunnel
lt --port 5173 --subdomain lockmap
```

#### 3. Build und statische Bereitstellung
```bash
npm run build
```
- `dist/` Ordner auf einen statischen Server hochladen
- z.B. Netlify, Vercel, GitHub Pages

### PWA-Funktionen prüfen

Auf dem iPhone testen:
1. **Offline-Funktionalität**: Flugmodus aktivieren, App neu starten
2. **Push-Notifications**: In der App testen (falls implementiert)
3. **Splash Screen**: Beim Starten erscheint
4. **Standalone-Modus**: Ohne Browser-UI läuft

### Entwickler-Tools auf iPhone

1. Safari auf Mac mit iPhone verbinden
2. iPhone: Einstellungen → Safari → Erweitert → Web-Inspektor aktivieren
3. Mac Safari: Entwickeln → [iPhone-Name] → Website auswählen

### Wichtig für Produktion

1. **Echte Domain** mit SSL-Zertifikat
2. **Service Worker** korrekt konfiguriert
3. **App-Icons** in allen Größen vorhanden
4. **Manifest** alle erforderlichen Felder

### Schnelltest auf Desktop

1. Chrome/Edge: Entwicklertools (F12)
2. Device-Toolbar aktivieren (Tablet/Phone-Icon)
3. Responsive Design prüfen
4. "Add to Home Screen" Simulation