# NewStyle Mobile - Contesto di migrazione

## Obiettivo

Creare una app Android standalone chiamata **NewStyle** usando:

- React
- TypeScript
- Vite
- React FullCalendar
- Capacitor
- Android

La nuova app non verra pubblicata nel portfolio. Comunichera via HTTPS con le API Netlify del repository portfolio.

## Repository e package ID

Repository mobile separata: `newstyle-mobile`

App name:

```text
NewStyle
```

Android package ID permanente:

```text
it.alessandroscarimbolo.newstyle
```

Non cambiarlo dopo la prima pubblicazione.

## Repository backend attuale

Il repository attuale `miosito` continua a contenere:

- portfolio web
- Netlify Functions
- API NewStyle
- integrazione server-side Cal.com
- autenticazione device
- storage Netlify Blobs

La route web `/newstyleparrucchiere` non deve ancora essere rimossa. Serve come riferimento durante la migrazione.

## Architettura finale

```text
NewStyle Android APK
        |
        | HTTPS + Authorization: Bearer device-token
        v
https://alessandroscarimbolo.it/api/newstyle/*
        |
        v
Netlify Functions
        |
        | CAL_API_KEY server-side
        v
Cal.com API
```

Cal.com resta la source of truth. Non va creato un database per duplicare le prenotazioni.

## API gia preparate nel repository backend

```text
POST /api/newstyle/device/activate
GET  /api/newstyle/bookings
POST /api/newstyle/bookings/:uid/confirm
POST /api/newstyle/bookings/:uid/reject
```

Il client mobile non deve chiamare direttamente Cal.com.

## Device Authentication

Il flusso desiderato e:

1. Prima apertura: mostrare schermata di attivazione.
2. L'utente inserisce il codice di attivazione.
3. Il backend verifica il codice tramite `NEWSTYLE_ACTIVATION_CODE_HASH`.
4. Il backend genera un token casuale con 256 bit di entropia.
5. Il token viene restituito una sola volta.
6. Il client lo salva tramite un adapter di storage sicuro.
7. Dalle aperture successive si apre direttamente la schermata Oggi.
8. Se una API restituisce `401`, cancellare il token e mostrare nuovamente la schermata di attivazione.

Il token non deve essere salvato in chiaro sul server. Il backend conserva soltanto SHA-256 del token in Netlify Blobs.

## File frontend gia preparati nel vecchio repository

Da trasferire nella nuova repository:

```text
src/features/newstyle/
src/shared/newstyle/
```

File importanti:

```text
src/features/newstyle/AgendaView.tsx
src/features/newstyle/Appointment.tsx
src/features/newstyle/DeviceActivationScreen.tsx
src/features/newstyle/NewStyleErrorBoundary.tsx
src/features/newstyle/NewStylePage.tsx
src/features/newstyle/deviceApi.ts
src/features/newstyle/deviceTokenStorage.ts
src/features/newstyle/dates.ts
src/features/newstyle/types.ts
src/features/newstyle/contracts.ts
src/features/newstyle/useBookings.ts
src/features/newstyle/bookingActions.ts
src/features/newstyle/newstyle.css
src/shared/newstyle/types.ts
src/shared/newstyle/contracts.ts
```

Non trasferire il router del portfolio, Header, Footer, pagine del portfolio o servizi non pertinenti.

## Stato attuale del client

Il vecchio client web usa ancora temporaneamente il login con cookie per mantenere funzionante `/newstyleparrucchiere`.

Il nuovo client mobile deve usare invece:

```text
src/features/newstyle/deviceApi.ts
src/features/newstyle/deviceTokenStorage.ts
src/features/newstyle/DeviceActivationScreen.tsx
```

`deviceTokenStorage.ts` contiene attualmente un adapter in memoria solo per sviluppo/test. Deve essere sostituito nel client Android con un adapter basato su Android Keystore o Secure Storage Capacitor.

## Configurazione API mobile

Nel nuovo repository creare `.env`:

```env
VITE_API_BASE_URL=https://alessandroscarimbolo.it/api/newstyle
```

Questo valore non e segreto.

Non inserire mai nell'app:

```text
CAL_API_KEY
NEWSTYLE_ACTIVATION_CODE_HASH
NEWSTYLE_SESSION_SECRET
```

## Passi da eseguire nella nuova repository

1. Creare il progetto Vite React TypeScript se la repository e vuota:

```bash
npm create vite@latest . -- --template react-ts
npm install
```

2. Installare FullCalendar e Luxon:

```bash
npm install @fullcalendar/core @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/list @fullcalendar/luxon3 @fullcalendar/react @fullcalendar/timegrid luxon
```

3. Installare Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init
npx cap add android
```

4. Usare `it.alessandroscarimbolo.newstyle` come App ID.
5. Copiare i file frontend NewStyle indicati sopra.
6. Creare una nuova entrypoint React indipendente dal portfolio.
7. Collegare `DeviceActivationScreen` e `deviceApi`.
8. Verificare prima il flusso nel browser.
9. Sostituire lo storage in memoria con Secure Storage/Android Keystore.
10. Testare su dispositivo Android reale.
11. Solo dopo la verifica rimuovere eventualmente la route web dal vecchio repository.

## UX da mantenere

Navbar mobile:

- Oggi
- Agenda
- Da confermare

Schermate:

- Oggi: lista verticale degli appuntamenti del giorno.
- Agenda: FullCalendar; mese con conteggi giornalieri e click sul giorno per la vista giornaliera.
- Da confermare: card con nome, servizio, data, ora, Conferma e Rifiuta.

Timezone:

```text
Europe/Rome
```

Formato orario: 24 ore.

## Decisioni gia prese

- ESLint, non Oxlint come unico linter.
- Nessun account Ionic necessario.
- Capacitor locale e gratuito per lo sviluppo.
- Nessun database PostgreSQL/Supabase.
- Nessun Redux.
- Nessun microservizio.
- Nessuna rimozione immediata della versione web.
- Nessun redesign aggiuntivo durante la migrazione.

## Verifiche gia eseguite nel vecchio repository

- TypeScript: passato.
- ESLint: passato.
- Test NewStyle: 52/52 passati.
- Build React: passata.
- Prerender: passato dopo l'abilitazione del loader TypeScript/TSX.
- Il postbuild SEO locale puo fallire se manca il binario nativo `canvas.node`; e un problema dell'ambiente locale.

## Richiesta alla nuova chat

Continuare da questo contesto senza ripetere l'audit del vecchio repository.

La prima attivita consigliata e:

1. verificare che la nuova repository sia una Vite React TypeScript app;
2. installare FullCalendar, Luxon e Capacitor;
3. trasferire i file NewStyle;
4. creare l'entrypoint mobile;
5. collegare activation screen e device API;
6. eseguire typecheck, lint e build;
7. solo dopo iniziare l'integrazione Android.
