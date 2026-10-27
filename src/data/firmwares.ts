import type { Category, Difficulty, Entry, FeatureKey, InstallMethod, Status } from './types';

/* ------------------------------------------------------------------ */
/*  Etichette condivise                                                */
/* ------------------------------------------------------------------ */

export const CATEGORIES: Record<Category, string> = {
  firmware: 'Firmware Base',
  apps: 'App Native (.fap)',
  badusb: 'BadUSB Scripts',
  subghz: 'Sub-GHz Dictionaries',
  gpio: 'Hardware Mod / GPIO',
  resources: 'Risorse & Tool',
};

export const DIFFICULTIES: Record<Difficulty, string> = {
  base: 'Base',
  intermedio: 'Intermedio',
  avanzato: 'Avanzato / Red Team',
};

export const STATUSES: Record<Status, string> = {
  attivo: 'Attivo',
  archiviato: 'Archiviato',
  sperimentale: 'Sperimentale',
};

export const FEATURES: Record<FeatureKey, string> = {
  regionUnlock: 'Frequenze sbloccate (Region Unlock)',
  customThemes: 'Animazioni e temi personalizzati',
  subghzExtra: 'Protocolli Sub-GHz extra',
  nfcExtra: 'Strumenti NFC / RFID extra',
  bundledApps: 'App .fap preinstallate',
  webInstaller: 'Installazione via browser',
  officialApi: 'Compatibilità app ufficiali',
  stability: 'Stabilità',
  updates: 'Aggiornamenti',
};

/* ------------------------------------------------------------------ */
/*  Procedure di installazione riutilizzabili                          */
/* ------------------------------------------------------------------ */

const qFlipper = (asset: string): InstallMethod => ({
  title: 'Installazione con qFlipper (desktop)',
  tool: 'qFlipper',
  url: 'https://flipperzero.one/update',
  steps: [
    'Scarica e installa qFlipper per il tuo sistema operativo.',
    `Dalla pagina Release della repository scarica il pacchetto ${asset}.`,
    'Collega il Flipper via USB-C e attendi che qFlipper lo riconosca.',
    'Esegui prima un backup ("Backup") di chiavi, salvataggi e impostazioni.',
    'Clicca "Install from file" e seleziona il file scaricato.',
    'Non scollegare il dispositivo fino al riavvio con la schermata del delfino.',
  ],
});

const sdCard = (asset: string): InstallMethod => ({
  title: 'Installazione manuale da scheda SD',
  tool: 'Scheda microSD',
  steps: [
    `Scarica ed estrai il pacchetto ${asset} sul computer.`,
    'Copia la cartella estratta in /update sulla microSD del Flipper (via qFlipper o lettore SD).',
    'Sul Flipper apri Archive → cartella update → file "update".',
    'Seleziona "Run in App" e attendi la fine del processo.',
  ],
});

const fapInstall = (folder: string): InstallMethod[] => [
  {
    title: 'Installazione dal catalogo (consigliata)',
    tool: 'Flipper Lab / app mobile',
    url: 'https://lab.flipper.net/apps',
    steps: [
      'Apri lab.flipper.net/apps da Chrome/Edge oppure l\'app mobile Flipper.',
      'Cerca l\'applicazione e premi "Install": viene compilata per la tua versione di firmware.',
      'Se l\'app non è nel catalogo usa il metodo manuale qui sotto.',
    ],
  },
  {
    title: 'Copia manuale del file .fap',
    tool: 'Scheda microSD',
    steps: [
      'Scarica il file .fap compilato per la stessa API del tuo firmware (vedi Release o build con ufbt).',
      `Copialo in /ext/apps/${folder}/ sulla microSD.`,
      'Riavvia il Flipper e apri Apps → categoria corrispondente.',
      'Se compare "API mismatch" ricompila l\'app o aggiorna il firmware.',
    ],
  },
];

const datasetInstall = (dest: string): InstallMethod[] => [
  {
    title: 'Copia selettiva dei file',
    tool: 'qFlipper / Scheda microSD',
    steps: [
      'Clona o scarica lo ZIP della repository sul computer.',
      'Leggi il README e scegli SOLO i file utili all\'esercitazione: non copiare l\'intero archivio.',
      `Copia i file nella cartella ${dest} della microSD.`,
      'Apri l\'app corrispondente sul Flipper e verifica che i file siano visibili.',
    ],
  },
];

const ETHICS_RF = [
  'In Italia/UE trasmetti solo nelle bande ISM consentite (es. 433,05–434,79 MHz e 868 MHz) e con le potenze ammesse: la ricezione è libera, la trasmissione no.',
  'Prova cancelli, telecomandi e badge solo su dispositivi di tua proprietà o forniti dal laboratorio, con autorizzazione scritta.',
  'L\'accesso abusivo a sistemi altrui è reato (art. 615-ter c.p.), così come l\'interferenza con comunicazioni.',
];

/* ------------------------------------------------------------------ */
/*  Firmware completi                                                  */
/* ------------------------------------------------------------------ */

export const ENTRIES: Entry[] = [
  {
    id: 'official',
    name: 'Official Firmware',
    repo: 'flipperdevices/flipperzero-firmware',
    homepage: 'https://docs.flipper.net',
    category: 'firmware',
    difficulty: 'base',
    status: 'attivo',
    emblem: 'OFW',
    accent: 'flipper',
    tags: ['Stock', 'Education Friendly', 'Region Locked', 'API di riferimento'],
    summary:
      'Il firmware ufficiale di Flipper Devices: punto di partenza stabile, documentato e conforme alle normative radio regionali.',
    overview: [
      'È il firmware con cui il Flipper esce di fabbrica. Viene sviluppato in C sul microcontrollore STM32WB55 e definisce la API che tutte le app .fap usano.',
      'Per uno studente è il riferimento: tutta la documentazione ufficiale, il catalogo app e gli strumenti di sviluppo (ufbt, fbt) partono da qui.',
      'Le frequenze Sub-GHz in trasmissione sono limitate in base alla regione del dispositivo per rispettare la normativa locale.',
    ],
    differences: [
      'Nessuno sblocco delle frequenze: la trasmissione Sub-GHz segue la regione assegnata.',
      'Nessun protocollo rolling-code di terze parti in trasmissione.',
      'Ciclo di rilascio ordinato (dev → release-candidate → release) con changelog curato.',
      'Massima compatibilità con il catalogo app ufficiale.',
    ],
    ethics: [
      'È il firmware consigliato per le prime lezioni: limita in partenza gli usi non conformi.',
      ...ETHICS_RF.slice(1),
    ],
    install: [
      {
        title: 'Web Updater (consigliato)',
        tool: 'Flipper Lab (Chrome / Edge)',
        url: 'https://lab.flipper.net',
        steps: [
          'Apri lab.flipper.net da un browser che supporta WebSerial (Chrome, Edge, Opera).',
          'Collega il Flipper via USB-C e clicca "Connect".',
          'Scegli il canale "Release" e premi "Update".',
          'Attendi il riavvio: le impostazioni e i file su SD restano intatti.',
        ],
      },
      qFlipper('ufficiale (.tgz) oppure usa direttamente il canale "Release" di qFlipper'),
      {
        title: 'App mobile',
        tool: 'Flipper Mobile App (iOS / Android)',
        steps: [
          'Associa il Flipper via Bluetooth dall\'app.',
          'Nella scheda Device scegli "Update" sul canale Release.',
          'Mantieni il telefono vicino fino al completamento.',
        ],
      },
    ],
    features: {
      regionUnlock: { level: 'no', note: 'Trasmissione limitata per regione' },
      customThemes: { level: 'partial', note: 'Animazioni personalizzabili solo compilando il firmware' },
      subghzExtra: { level: 'no', note: 'Solo protocolli ufficiali' },
      nfcExtra: { level: 'partial', note: 'Buon supporto NFC/RFID, estendibile via app' },
      bundledApps: { level: 'partial', note: 'Set essenziale, il resto dal catalogo' },
      webInstaller: { level: 'yes', note: 'lab.flipper.net, qFlipper, app mobile' },
      officialApi: { level: 'yes', note: 'È la API di riferimento' },
      stability: { level: 'yes', note: 'Alta: canale release testato' },
      updates: { level: 'yes', note: 'Regolari, con canali dev/RC/release' },
    },
  },
  {
    id: 'unleashed',
    name: 'Unleashed',
    repo: 'DarkFlippers/unleashed-firmware',
    homepage: 'https://flipperunleashed.com',
    category: 'firmware',
    difficulty: 'intermedio',
    status: 'attivo',
    emblem: 'UNL',
    accent: 'neon',
    tags: ['Sub-GHz Unlocked', 'Rolling Code', 'Vicino all\'ufficiale', 'Extra Apps'],
    summary:
      'Fork storico e molto diffuso: resta vicino al firmware ufficiale ma sblocca le frequenze e aggiunge protocolli Sub-GHz.',
    overview: [
      'Unleashed segue da vicino il ramo ufficiale (riallineandosi spesso) e aggiunge funzioni pensate per la ricerca radio.',
      'Le aggiunte principali riguardano il Sub-GHz: frequenze estese, protocolli aggiuntivi e strumenti di analisi più ricchi.',
      'Le release sono disponibili in più varianti (con o senza pacchetto di app extra e animazioni), da scegliere in base all\'uso.',
    ],
    differences: [
      'Region Unlock: frequenze Sub-GHz estese oltre la regione del dispositivo.',
      'Supporto a protocolli Sub-GHz aggiuntivi, inclusi alcuni rolling-code (solo a scopo di studio).',
      'Varianti di build con pacchetto di app esterne preinstallate.',
      'Modifiche UI contenute: l\'esperienza resta simile all\'ufficiale.',
    ],
    ethics: [
      'Lo sblocco delle frequenze NON rende legale trasmettere fuori banda: la responsabilità resta dell\'utente.',
      ...ETHICS_RF,
    ],
    install: [
      {
        title: 'Web Updater',
        tool: 'Flipper Lab (Chrome / Edge)',
        url: 'https://github.com/DarkFlippers/unleashed-firmware/releases',
        steps: [
          'Apri la pagina Release più recente di Unleashed.',
          'Clicca il link "Web updater" della variante scelta: si apre lab.flipper.net già configurato.',
          'Collega il Flipper, premi "Connect" e poi "Install".',
          'Al riavvio controlla in Settings → About la versione installata.',
        ],
      },
      qFlipper('.tgz della variante desiderata'),
      sdCard('.tgz'),
    ],
    features: {
      regionUnlock: { level: 'yes', note: 'Frequenze estese' },
      customThemes: { level: 'partial', note: 'Animazioni extra in alcune varianti' },
      subghzExtra: { level: 'yes', note: 'Protocolli aggiuntivi e rolling-code' },
      nfcExtra: { level: 'partial', note: 'Allineato all\'ufficiale + app extra' },
      bundledApps: { level: 'yes', note: 'Variante con pacchetto app extra' },
      webInstaller: { level: 'yes', note: 'Link web updater in ogni release' },
      officialApi: { level: 'yes', note: 'Molto vicino all\'API ufficiale' },
      stability: { level: 'yes', note: 'Alta, segue l\'upstream' },
      updates: { level: 'yes', note: 'Frequenti' },
    },
  },
  {
    id: 'momentum',
    name: 'Momentum',
    repo: 'Next-Flip/Momentum-Firmware',
    homepage: 'https://momentum-fw.dev',
    category: 'firmware',
    difficulty: 'intermedio',
    status: 'attivo',
    emblem: 'MNTM',
    accent: 'cyan',
    tags: ['Custom GUI', 'Asset Pack', 'Sub-GHz Unlocked', 'Erede di Xtreme'],
    summary:
      'Successore spirituale di Xtreme: unisce le novità di Unleashed con un\'interfaccia altamente personalizzabile e asset pack.',
    overview: [
      'Momentum nasce dopo la chiusura di Xtreme, portato avanti da parte della stessa community con un focus su stabilità e personalizzazione.',
      'Include l\'app "Momentum Settings" per gestire temi, asset pack, menu e comportamento del dispositivo senza ricompilare.',
      'Integra le funzioni radio di Unleashed e numerose app della community già pronte.',
    ],
    differences: [
      'Sistema di Asset Pack: animazioni, icone e font sostituibili da SD.',
      'App di impostazioni dedicata con opzioni non presenti nell\'ufficiale.',
      'Region Unlock e protocolli Sub-GHz estesi (base Unleashed).',
      'Ampio set di app .fap preinstallate.',
    ],
    ethics: [
      'Le funzioni avanzate preinstallate vanno usate solo negli scenari previsti dal laboratorio.',
      ...ETHICS_RF,
    ],
    install: [
      {
        title: 'Web Updater ufficiale Momentum',
        tool: 'Browser (Chrome / Edge)',
        url: 'https://momentum-fw.dev/update',
        steps: [
          'Apri momentum-fw.dev/update.',
          'Collega il Flipper via USB-C e autorizza la connessione seriale.',
          'Scegli il canale (Release consigliato) e avvia l\'installazione.',
          'Dopo il riavvio apri "Momentum Settings" per configurare temi e asset pack.',
        ],
      },
      qFlipper('.tgz di Momentum'),
      sdCard('.tgz'),
    ],
    features: {
      regionUnlock: { level: 'yes', note: 'Frequenze estese' },
      customThemes: { level: 'yes', note: 'Asset pack completi + Momentum Settings' },
      subghzExtra: { level: 'yes', note: 'Ereditati da Unleashed' },
      nfcExtra: { level: 'yes', note: 'App e parser aggiuntivi' },
      bundledApps: { level: 'yes', note: 'Ampio pacchetto preinstallato' },
      webInstaller: { level: 'yes', note: 'momentum-fw.dev/update' },
      officialApi: { level: 'partial', note: 'API estesa: alcune app richiedono build dedicata' },
      stability: { level: 'yes', note: 'Buona sul canale release' },
      updates: { level: 'yes', note: 'Frequenti' },
    },
  },
  {
    id: 'xtreme',
    name: 'Xtreme (legacy)',
    repo: 'Flipper-Xtreme/Xtreme-Firmware',
    homepage: 'https://flipper-xtre.me',
    category: 'firmware',
    difficulty: 'intermedio',
    status: 'archiviato',
    emblem: 'XFW',
    accent: 'warn',
    tags: ['Custom GUI', 'Asset Pack', 'Storico', 'Non più mantenuto'],
    summary:
      'Firmware storico che ha introdotto asset pack e forte personalizzazione. Il progetto è archiviato: oggi si usa Momentum.',
    overview: [
      'Xtreme è stato per lungo tempo il firmware custom più popolare per la personalizzazione grafica.',
      'Lo sviluppo è stato interrotto e la repository archiviata; gran parte delle idee prosegue in Momentum.',
      'Resta utile come caso di studio: come un fork evolve, si separa e lascia un\'eredità ad altri progetti.',
    ],
    differences: [
      'Introduzione del concetto di Asset Pack.',
      'Pannello di impostazioni esteso (antenato di Momentum Settings).',
      'Nessun aggiornamento di sicurezza o compatibilità: non installarlo su dispositivi in uso.',
    ],
    ethics: [
      'Firmware non mantenuto: possibili bug irrisolti. Usalo solo per analisi storica del codice.',
      ...ETHICS_RF.slice(0, 1),
    ],
    install: [
      {
        title: 'Migrazione consigliata',
        tool: 'Momentum Web Updater',
        url: 'https://momentum-fw.dev/update',
        steps: [
          'Esegui un backup completo con qFlipper.',
          'Installa Momentum dal suo web updater: è il successore diretto.',
          'Ricopia sulla SD gli asset pack che vuoi conservare e verifica la compatibilità.',
        ],
      },
      {
        title: 'Studio del codice (senza installare)',
        tool: 'Git',
        steps: [
          'Clona la repository archiviata in sola lettura.',
          'Confronta le cartelle applications/ e assets/ con il firmware ufficiale.',
          'Annota le differenze come esercizio di code review.',
        ],
      },
    ],
    features: {
      regionUnlock: { level: 'yes', note: 'Frequenze estese' },
      customThemes: { level: 'yes', note: 'Pioniere degli asset pack' },
      subghzExtra: { level: 'yes', note: 'Base Unleashed (datata)' },
      nfcExtra: { level: 'partial', note: 'Fermo all\'ultima release' },
      bundledApps: { level: 'yes', note: 'Molte app, non aggiornate' },
      webInstaller: { level: 'no', note: 'Progetto chiuso' },
      officialApi: { level: 'no', note: 'API ferma, app recenti incompatibili' },
      stability: { level: 'na', note: 'Non più mantenuto' },
      updates: { level: 'no', note: 'Archiviato' },
    },
  },
  {
    id: 'roguemaster',
    name: 'RogueMaster',
    repo: 'RogueMaster/flipperzero-firmware-wip',
    category: 'firmware',
    difficulty: 'avanzato',
    status: 'sperimentale',
    emblem: 'RM',
    accent: 'warn',
    tags: ['Kitchen Sink', 'Max App', 'Animazioni', 'Sperimentale'],
    summary:
      'Il fork "tutto incluso": integra il maggior numero di app, giochi e animazioni della community, a scapito della stabilità.',
    overview: [
      'RogueMaster unisce modifiche da Unleashed e da molti altri fork, aggiungendo centinaia di app e animazioni.',
      'È pensato per chi vuole sperimentare subito tutto ciò che la community produce.',
      'Il nome della repository ("-wip") riflette la natura in continua evoluzione: bug e regressioni sono più probabili.',
    ],
    differences: [
      'Numero di app preinstallate molto superiore agli altri firmware.',
      'Grande collezione di animazioni del delfino.',
      'Region Unlock e protocolli estesi.',
      'Release frequenti con meno test rispetto ad ufficiale/Unleashed.',
    ],
    ethics: [
      'Molte app incluse hanno scopi offensivi: in laboratorio valuta un firmware più essenziale.',
      ...ETHICS_RF,
    ],
    install: [qFlipper('.tgz dalla Release più recente'), sdCard('.tgz')],
    features: {
      regionUnlock: { level: 'yes', note: 'Frequenze estese' },
      customThemes: { level: 'yes', note: 'Enorme collezione di animazioni' },
      subghzExtra: { level: 'yes', note: 'Protocolli estesi' },
      nfcExtra: { level: 'yes', note: 'Molte app NFC/RFID incluse' },
      bundledApps: { level: 'yes', note: 'Il pacchetto più ampio' },
      webInstaller: { level: 'partial', note: 'Principalmente qFlipper / SD' },
      officialApi: { level: 'partial', note: 'API modificata' },
      stability: { level: 'partial', note: 'Sperimentale' },
      updates: { level: 'yes', note: 'Molto frequenti' },
    },
  },

  /* ---------------------------------------------------------------- */
  /*  App native, script, dataset e risorse                            */
  /* ---------------------------------------------------------------- */

  {
    id: 'app-catalog',
    name: 'Flipper Application Catalog',
    repo: 'flipperdevices/flipper-application-catalog',
    homepage: 'https://lab.flipper.net/apps',
    category: 'apps',
    difficulty: 'base',
    status: 'attivo',
    emblem: 'FAP',
    accent: 'flipper',
    tags: ['Catalogo ufficiale', 'Education Friendly', 'Manifest'],
    summary: 'Il registro ufficiale delle app .fap: ogni app è descritta da un manifest e compilata automaticamente.',
    overview: [
      'Contiene i manifest delle app pubblicate su lab.flipper.net e nell\'app mobile.',
      'Ottimo per capire come si pubblica un\'app: struttura, metadati, screenshot e processo di revisione.',
    ],
    ethics: ['Le app del catalogo sono revisionate, ma leggi sempre la descrizione prima di usarle in laboratorio.'],
    install: fapInstall('<Categoria>'),
  },
  {
    id: 'good-faps',
    name: 'Good FAPs (app ufficiali)',
    repo: 'flipperdevices/flipperzero-good-faps',
    category: 'apps',
    difficulty: 'base',
    status: 'attivo',
    emblem: 'GF',
    accent: 'flipper',
    tags: ['App ufficiali', 'Codice di esempio', 'C'],
    summary: 'App mantenute dal team Flipper: codice pulito da studiare come esempio di sviluppo .fap.',
    overview: [
      'Raccolta di applicazioni scritte e mantenute da Flipper Devices.',
      'Ideale come materiale di studio per il corso: pattern di GUI, gestione eventi, storage.',
    ],
    ethics: ['Nessun rischio particolare: sono app generiche e didattiche.'],
    install: fapInstall('<Categoria>'),
  },
  {
    id: 'all-the-plugins',
    name: 'All The Plugins',
    repo: 'xMasterX/all-the-plugins',
    category: 'apps',
    difficulty: 'intermedio',
    status: 'attivo',
    emblem: 'ATP',
    accent: 'neon',
    tags: ['Pacchetto app', 'Giochi', 'Tool', 'Community'],
    summary: 'Raccolta di centinaia di app della community, ricompilate per il firmware ufficiale e per Unleashed.',
    overview: [
      'Mantenuta dal maintainer di Unleashed: le app sono già compilate per le API più recenti.',
      'Comoda per provare velocemente giochi, utilità e tool senza compilare nulla.',
    ],
    ethics: ['Il pacchetto contiene anche tool offensivi: installa solo le categorie necessarie.'],
    install: fapInstall('<Categoria>'),
  },
  {
    id: 'ufbt',
    name: 'uFBT — micro Flipper Build Tool',
    repo: 'flipperdevices/flipperzero-ufbt',
    homepage: 'https://pypi.org/project/ufbt/',
    category: 'resources',
    difficulty: 'intermedio',
    status: 'attivo',
    emblem: 'uFBT',
    accent: 'cyan',
    tags: ['SDK', 'Python', 'Build app', 'Education Friendly'],
    summary: 'Lo strumento ufficiale per compilare e caricare le proprie app .fap senza scaricare tutto il firmware.',
    overview: [
      'Si installa con pip e scarica automaticamente l\'SDK compatibile con il firmware scelto.',
      'Comandi principali: "ufbt create" per un nuovo progetto, "ufbt launch" per compilare e avviare sul dispositivo.',
    ],
    ethics: ['Strumento di sviluppo neutro: il punto d\'ingresso consigliato per i progetti d\'esame.'],
    install: [
      {
        title: 'Setup ambiente di sviluppo',
        tool: 'Python 3 + pip',
        steps: [
          'Installa con: python3 -m pip install --upgrade ufbt',
          'Crea una cartella progetto ed esegui: ufbt create APPID=hello_lab',
          'Collega il Flipper ed esegui: ufbt launch',
          'Per un firmware diverso dall\'ufficiale usa: ufbt update --index-url=<url-sdk-del-fork>',
        ],
      },
    ],
  },
  {
    id: 'tutorials',
    name: 'Flipper Zero Tutorials (jamisonderek)',
    repo: 'jamisonderek/flipper-zero-tutorials',
    category: 'resources',
    difficulty: 'base',
    status: 'attivo',
    emblem: 'TUT',
    accent: 'cyan',
    tags: ['Tutorial', 'Education Friendly', 'GPIO', 'Sviluppo app'],
    summary: 'Guide ed esempi commentati su sviluppo app, GPIO, Sub-GHz e protocolli: perfetto come libro di testo.',
    overview: [
      'Repository didattica con progetti passo-passo e video collegati.',
      'Copre sia l\'uso del dispositivo sia la scrittura di app in C.',
    ],
    ethics: ['Materiale didattico: segui le note di legalità incluse nei singoli tutorial.'],
    install: datasetInstall('di lavoro sul computer (non serve copiarla sul Flipper)'),
  },
  {
    id: 'awesome',
    name: 'Awesome Flipper Zero',
    repo: 'djsime1/awesome-flipperzero',
    category: 'resources',
    difficulty: 'base',
    status: 'attivo',
    emblem: 'AWS',
    accent: 'neon',
    tags: ['Lista curata', 'Indice', 'Firmware', 'App', 'Hardware'],
    summary: 'L\'indice di riferimento della community: firmware, app, moduli hardware, database e guide.',
    overview: [
      'Una "awesome list" che organizza per categoria tutto l\'ecosistema Flipper Zero.',
      'Usala come punto di partenza per estendere questo hub con nuove repository.',
    ],
    ethics: ['Indice di link esterni: valuta caso per caso affidabilità e legalità di ogni risorsa.'],
    install: datasetInstall('di lavoro sul computer'),
  },
  {
    id: 'uberguidoz',
    name: 'UberGuidoZ Flipper Collection',
    repo: 'UberGuidoZ/Flipper',
    category: 'subghz',
    difficulty: 'intermedio',
    status: 'attivo',
    emblem: 'UGZ',
    accent: 'neon',
    tags: ['Sub-GHz', 'Infrarossi', 'NFC', 'BadUSB', 'Dataset'],
    summary: 'Enorme archivio di file per Sub-GHz, infrarossi, NFC, BadUSB e musica, organizzato per cartelle.',
    overview: [
      'Raccolta di file .sub, .ir, .nfc, script BadUSB e documentazione raccolti dalla community.',
      'Utile in laboratorio soprattutto per i telecomandi IR e per studiare il formato dei file salvati.',
    ],
    ethics: [
      'Molti file .sub riproducono segnali di dispositivi reali: usali solo per analisi del formato, non per trasmettere.',
      ...ETHICS_RF.slice(0, 1),
    ],
    install: datasetInstall('/ext/subghz, /ext/infrared o /ext/nfc'),
  },
  {
    id: 'subghz-bruteforce',
    name: 'Sub-GHz Bruteforce Generator',
    repo: 'tobiabocchi/flipperzero-bruteforce',
    category: 'subghz',
    difficulty: 'avanzato',
    status: 'attivo',
    emblem: 'BRF',
    accent: 'warn',
    tags: ['Sub-GHz', 'Codici fissi', 'Red Team', 'Python'],
    summary: 'Script Python che genera file .sub per dimostrare la debolezza dei telecomandi a codice fisso.',
    overview: [
      'Mostra in modo concreto perché i codici fissi (es. CAME, NICE a 12 bit) non sono sicuri: lo spazio delle chiavi è minuscolo.',
      'Didatticamente interessante per calcolare tempi di attacco e capire il valore dei rolling-code.',
    ],
    ethics: [
      'Da usare SOLO su un ricevitore di prova del laboratorio, in gabbia di Faraday o con potenza minima.',
      ...ETHICS_RF,
    ],
    install: datasetInstall('/ext/subghz/lab'),
  },
  {
    id: 'badusb-jakoby',
    name: 'Flipper Zero BadUSB (I-Am-Jakoby)',
    repo: 'I-Am-Jakoby/Flipper-Zero-BadUSB',
    category: 'badusb',
    difficulty: 'avanzato',
    status: 'attivo',
    emblem: 'BUSB',
    accent: 'warn',
    tags: ['BadUSB', 'DuckyScript', 'PowerShell', 'Red Team'],
    summary: 'Collezione di payload BadUSB con spiegazioni: ottima per capire come un "tastierino malevolo" compromette un PC.',
    overview: [
      'Ogni payload è accompagnato da descrizione e codice: si può leggere passo per passo cosa farebbe.',
      'Usalo per esercizi di analisi e per progettare contromisure (blocco HID, policy USB, EDR).',
    ],
    ethics: [
      'Esegui payload solo su macchine virtuali o PC di laboratorio dedicati, mai su computer altrui.',
      'Leggi sempre lo script prima di eseguirlo: alcuni scaricano codice da Internet.',
      'L\'uso non autorizzato configura accesso abusivo e danneggiamento di sistemi (artt. 615-ter, 635-bis c.p.).',
    ],
    install: datasetInstall('/ext/badusb'),
  },
  {
    id: 'ducky-payloads',
    name: 'USB Rubber Ducky Payloads (Hak5)',
    repo: 'hak5/usbrubberducky-payloads',
    category: 'badusb',
    difficulty: 'intermedio',
    status: 'attivo',
    emblem: 'DUCK',
    accent: 'flipper',
    tags: ['DuckyScript', 'Riferimento', 'Payload'],
    summary: 'Il repository ufficiale di payload DuckyScript: il linguaggio che il BadUSB del Flipper interpreta.',
    overview: [
      'Utile per imparare la sintassi DuckyScript (STRING, DELAY, GUI, ALTCODE...).',
      'Non tutti i comandi DuckyScript 3.0 sono supportati dal Flipper: verifica sempre la compatibilità.',
    ],
    ethics: ['Stesse regole del BadUSB: solo in VM o su postazioni di laboratorio.'],
    install: datasetInstall('/ext/badusb'),
  },
  {
    id: 'marauder',
    name: 'ESP32 Marauder',
    repo: 'justcallmekoko/ESP32Marauder',
    category: 'gpio',
    difficulty: 'avanzato',
    status: 'attivo',
    emblem: 'ESP',
    accent: 'warn',
    tags: ['Wi-Fi Dev Board', 'ESP32', 'Wi-Fi / BLE', 'Red Team'],
    summary: 'Firmware per la scheda Wi-Fi (ESP32) collegata ai GPIO: scansione reti e analisi pacchetti 2,4 GHz.',
    overview: [
      'Si installa sulla Wi-Fi Dev Board o su moduli ESP32 compatibili e si controlla dal Flipper tramite un\'app companion.',
      'Ottimo per lezioni su 802.11: beacon, probe request, canali, sniffing in modalità monitor.',
    ],
    ethics: [
      'Deauth e attacchi a reti Wi-Fi altrui sono illegali: usa un access point di laboratorio isolato.',
      'Lo sniffing di traffico di terzi viola la riservatezza delle comunicazioni (art. 617-quater c.p.).',
    ],
    install: [
      {
        title: 'Flash della scheda ESP32',
        tool: 'Browser / esptool',
        url: 'https://github.com/justcallmekoko/ESP32Marauder/wiki',
        steps: [
          'Segui la wiki del progetto per scegliere il binario corretto per la tua scheda.',
          'Metti la scheda in modalità bootloader e flasha con il web flasher o esptool.',
          'Collega la scheda ai GPIO del Flipper e installa l\'app companion "[ESP32] WiFi Marauder".',
        ],
      },
    ],
  },
  {
    id: 'blackmagic',
    name: 'Black Magic Probe (Wi-Fi Dev Board)',
    repo: 'flipperdevices/blackmagic-esp32-s2',
    homepage: 'https://docs.flipper.net/development/hardware/wifi-debugger-module',
    category: 'gpio',
    difficulty: 'intermedio',
    status: 'attivo',
    emblem: 'BMP',
    accent: 'cyan',
    tags: ['Debugger', 'GDB', 'ESP32-S2', 'Education Friendly'],
    summary: 'Firmware ufficiale della Wi-Fi Dev Board: la trasforma in un debugger SWD/GDB per il Flipper.',
    overview: [
      'Permette di fare debug passo-passo del firmware o delle proprie app tramite GDB, anche via Wi-Fi.',
      'Perfetto per corsi di sistemi embedded: breakpoint, ispezione memoria, crash analysis.',
    ],
    ethics: ['Strumento di sviluppo neutro, nessuna nota particolare.'],
    install: [
      {
        title: 'Aggiornamento della Dev Board',
        tool: 'qFlipper / Flipper Lab',
        url: 'https://docs.flipper.net/development/hardware/wifi-debugger-module/update',
        steps: [
          'Segui la guida ufficiale per aggiornare la Wi-Fi Dev Board.',
          'Collega la board al Flipper e al PC, poi avvia GDB puntando alla porta seriale esposta.',
          'Prova un breakpoint su una tua app compilata con ufbt.',
        ],
      },
    ],
  },
];

export const FIRMWARES = ENTRIES.filter((e) => e.category === 'firmware');
