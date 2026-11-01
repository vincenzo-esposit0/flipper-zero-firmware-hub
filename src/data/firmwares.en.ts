import type { Category, Difficulty, Entry, FeatureKey, FeatureLevel, InstallMethod, Status } from './types';
import type { Lang } from './strings';

/*
 * Traduzione inglese di firmwares.ts, per id scheda.
 * I campi non traducibili (repo, categoria, stato, livelli...) restano in firmwares.ts;
 * una scheda senza traduzione viene mostrata in italiano.
 */

export const CATEGORIES_EN: Record<Category, string> = {
  firmware: 'Base Firmware',
  apps: 'Native Apps (.fap)',
  badusb: 'BadUSB Scripts',
  subghz: 'Sub-GHz Dictionaries',
  gpio: 'Hardware Mod / GPIO',
  resources: 'Resources & Tools',
};

export const DIFFICULTIES_EN: Record<Difficulty, string> = {
  base: 'Beginner',
  intermedio: 'Intermediate',
  avanzato: 'Advanced / Red Team',
};

export const STATUSES_EN: Record<Status, string> = {
  attivo: 'Active',
  archiviato: 'Archived',
  sperimentale: 'Experimental',
};

export const FEATURES_EN: Record<FeatureKey, string> = {
  regionUnlock: 'Unlocked frequencies (Region Unlock)',
  customThemes: 'Custom animations and themes',
  subghzExtra: 'Extra Sub-GHz protocols',
  nfcExtra: 'Extra NFC / RFID tools',
  bundledApps: 'Preinstalled .fap apps',
  webInstaller: 'Browser installation',
  officialApi: 'Official app compatibility',
  stability: 'Stability',
  updates: 'Updates',
};

const qFlipper = (asset: string): InstallMethod => ({
  title: 'Installing with qFlipper (desktop)',
  tool: 'qFlipper',
  url: 'https://flipperzero.one/update',
  steps: [
    'Download and install qFlipper for your operating system.',
    `From the repository's Releases page download ${asset}.`,
    'Connect the Flipper via USB-C and wait for qFlipper to detect it.',
    'First make a backup ("Backup") of keys, saves and settings.',
    'Click "Install from file" and select the downloaded file.',
    'Do not disconnect the device until it reboots to the dolphin screen.',
  ],
});

const sdCard = (asset: string): InstallMethod => ({
  title: 'Manual installation from the SD card',
  tool: 'microSD card',
  steps: [
    `Download and extract the ${asset} package on your computer.`,
    'Copy the extracted folder to /update on the Flipper\'s microSD (via qFlipper or an SD reader).',
    'On the Flipper open Archive → update folder → "update" file.',
    'Select "Run in App" and wait for the process to finish.',
  ],
});

const fapInstall = (folder: string): InstallMethod[] => [
  {
    title: 'Installing from the catalog (recommended)',
    tool: 'Flipper Lab / mobile app',
    url: 'https://lab.flipper.net/apps',
    steps: [
      'Open lab.flipper.net/apps in Chrome/Edge or the Flipper mobile app.',
      'Search for the application and press "Install": it is built for your firmware version.',
      'If the app is not in the catalog, use the manual method below.',
    ],
  },
  {
    title: 'Copying the .fap file manually',
    tool: 'microSD card',
    steps: [
      'Download the .fap file built for the same API as your firmware (see Releases or build it with ufbt).',
      `Copy it to /ext/apps/${folder}/ on the microSD.`,
      'Restart the Flipper and open Apps → the matching category.',
      'If "API mismatch" appears, rebuild the app or update the firmware.',
    ],
  },
];

const datasetInstall = (dest: string): InstallMethod[] => [
  {
    title: 'Selective file copy',
    tool: 'qFlipper / microSD card',
    steps: [
      'Clone the repository or download its ZIP to your computer.',
      'Read the README and pick ONLY the files useful for the exercise: do not copy the whole archive.',
      `Copy the files to ${dest}.`,
      'Open the matching app on the Flipper and check that the files are visible.',
    ],
  },
];

const ETHICS_RF = [
  'In Italy/EU transmit only in the permitted ISM bands (e.g. 433.05–434.79 MHz and 868 MHz) and at the permitted power levels: receiving is free, transmitting is not.',
  'Test gates, remotes and badges only on devices you own or that the lab provides, with written authorization.',
  'Unauthorized access to other people\'s systems is a crime (art. 615-ter of the Italian Criminal Code), as is interfering with communications.',
];

type FeatureNotes = Record<FeatureKey, string>;

interface EntryEn {
  name?: string;
  tags: string[];
  summary: string;
  overview: string[];
  differences?: string[];
  ethics: string[];
  install: InstallMethod[];
  features?: FeatureNotes;
}

const EN: Record<string, EntryEn> = {
  official: {
    tags: ['Stock', 'Education Friendly', 'Region Locked', 'Reference API'],
    summary:
      'The official firmware from Flipper Devices: a stable, documented starting point that complies with regional radio regulations.',
    overview: [
      'This is the firmware the Flipper ships with. It is developed in C on the STM32WB55 microcontroller and defines the API that all .fap apps use.',
      'For a student it is the reference: all the official documentation, the app catalog and the development tools (ufbt, fbt) start here.',
      'Sub-GHz transmit frequencies are limited according to the device\'s region to comply with local regulations.',
    ],
    differences: [
      'No frequency unlock: Sub-GHz transmission follows the assigned region.',
      'No third-party rolling-code protocols in transmission.',
      'Orderly release cycle (dev → release-candidate → release) with a curated changelog.',
      'Maximum compatibility with the official app catalog.',
    ],
    ethics: [
      'This is the recommended firmware for the first lessons: it limits non-compliant uses from the start.',
      ...ETHICS_RF.slice(1),
    ],
    install: [
      {
        title: 'Web Updater (recommended)',
        tool: 'Flipper Lab (Chrome / Edge)',
        url: 'https://lab.flipper.net',
        steps: [
          'Open lab.flipper.net in a browser that supports WebSerial (Chrome, Edge, Opera).',
          'Connect the Flipper via USB-C and click "Connect".',
          'Choose the "Release" channel and press "Update".',
          'Wait for the reboot: settings and files on the SD card stay intact.',
        ],
      },
      qFlipper('the official package (.tgz), or use qFlipper\'s "Release" channel directly'),
      {
        title: 'Mobile app',
        tool: 'Flipper Mobile App (iOS / Android)',
        steps: [
          'Pair the Flipper via Bluetooth from the app.',
          'In the Device tab choose "Update" on the Release channel.',
          'Keep the phone nearby until it finishes.',
        ],
      },
    ],
    features: {
      regionUnlock: 'Transmission limited by region',
      customThemes: 'Animations customizable only by building the firmware',
      subghzExtra: 'Official protocols only',
      nfcExtra: 'Good NFC/RFID support, extensible via apps',
      bundledApps: 'Essential set, the rest from the catalog',
      webInstaller: 'lab.flipper.net, qFlipper, mobile app',
      officialApi: 'It is the reference API',
      stability: 'High: tested release channel',
      updates: 'Regular, with dev/RC/release channels',
    },
  },
  unleashed: {
    tags: ['Sub-GHz Unlocked', 'Rolling Code', 'Close to official', 'Extra Apps'],
    summary:
      'A long-standing, widely used fork: it stays close to the official firmware but unlocks frequencies and adds Sub-GHz protocols.',
    overview: [
      'Unleashed closely follows the official branch (realigning often) and adds features designed for radio research.',
      'The main additions concern Sub-GHz: extended frequencies, additional protocols and richer analysis tools.',
      'Releases come in several variants (with or without the extra app pack and animations), to choose according to use.',
    ],
    differences: [
      'Region Unlock: Sub-GHz frequencies extended beyond the device\'s region.',
      'Support for additional Sub-GHz protocols, including some rolling-code ones (for study purposes only).',
      'Build variants with a preinstalled pack of external apps.',
      'Limited UI changes: the experience stays similar to the official one.',
    ],
    ethics: [
      'Unlocking frequencies does NOT make out-of-band transmission legal: the responsibility remains the user\'s.',
      ...ETHICS_RF,
    ],
    install: [
      {
        title: 'Web Updater',
        tool: 'Flipper Lab (Chrome / Edge)',
        url: 'https://github.com/DarkFlippers/unleashed-firmware/releases',
        steps: [
          'Open the latest Unleashed Release page.',
          'Click the "Web updater" link of the chosen variant: lab.flipper.net opens already configured.',
          'Connect the Flipper, press "Connect" and then "Install".',
          'After the reboot check the installed version in Settings → About.',
        ],
      },
      qFlipper('the .tgz package of the desired variant'),
      sdCard('.tgz'),
    ],
    features: {
      regionUnlock: 'Extended frequencies',
      customThemes: 'Extra animations in some variants',
      subghzExtra: 'Additional protocols and rolling-code',
      nfcExtra: 'Aligned with official + extra apps',
      bundledApps: 'Variant with extra app pack',
      webInstaller: 'Web updater link in every release',
      officialApi: 'Very close to the official API',
      stability: 'High, follows upstream',
      updates: 'Frequent',
    },
  },
  momentum: {
    tags: ['Custom GUI', 'Asset Pack', 'Sub-GHz Unlocked', 'Xtreme\'s heir'],
    summary:
      'Spiritual successor to Xtreme: it combines the new features of Unleashed with a highly customizable interface and asset packs.',
    overview: [
      'Momentum was born after Xtreme shut down, carried on by part of the same community with a focus on stability and customization.',
      'It includes the "Momentum Settings" app to manage themes, asset packs, menus and device behaviour without rebuilding.',
      'It integrates the radio features of Unleashed and many ready-made community apps.',
    ],
    differences: [
      'Asset Pack system: animations, icons and fonts replaceable from the SD card.',
      'Dedicated settings app with options absent from the official firmware.',
      'Region Unlock and extended Sub-GHz protocols (Unleashed base).',
      'Broad set of preinstalled .fap apps.',
    ],
    ethics: [
      'The preinstalled advanced features must be used only in the scenarios the lab provides for.',
      ...ETHICS_RF,
    ],
    install: [
      {
        title: 'Official Momentum Web Updater',
        tool: 'Browser (Chrome / Edge)',
        url: 'https://momentum-fw.dev/update',
        steps: [
          'Open momentum-fw.dev/update.',
          'Connect the Flipper via USB-C and authorize the serial connection.',
          'Choose the channel (Release recommended) and start the installation.',
          'After the reboot open "Momentum Settings" to configure themes and asset packs.',
        ],
      },
      qFlipper('the Momentum .tgz package'),
      sdCard('.tgz'),
    ],
    features: {
      regionUnlock: 'Extended frequencies',
      customThemes: 'Complete asset packs + Momentum Settings',
      subghzExtra: 'Inherited from Unleashed',
      nfcExtra: 'Additional apps and parsers',
      bundledApps: 'Large preinstalled pack',
      webInstaller: 'momentum-fw.dev/update',
      officialApi: 'Extended API: some apps need a dedicated build',
      stability: 'Good on the release channel',
      updates: 'Frequent',
    },
  },
  xtreme: {
    tags: ['Custom GUI', 'Asset Pack', 'Historical', 'No longer maintained'],
    summary:
      'A historic firmware that introduced asset packs and deep customization. The project is archived: today Momentum is used instead.',
    overview: [
      'Xtreme was for a long time the most popular custom firmware for graphical customization.',
      'Development stopped and the repository was archived; most of its ideas live on in Momentum.',
      'It remains useful as a case study: how a fork evolves, splits off and leaves a legacy to other projects.',
    ],
    differences: [
      'Introduced the concept of the Asset Pack.',
      'Extended settings panel (ancestor of Momentum Settings).',
      'No security or compatibility updates: do not install it on devices in use.',
    ],
    ethics: [
      'Unmaintained firmware: unresolved bugs are possible. Use it only for historical code analysis.',
      ...ETHICS_RF.slice(0, 1),
    ],
    install: [
      {
        title: 'Recommended migration',
        tool: 'Momentum Web Updater',
        url: 'https://momentum-fw.dev/update',
        steps: [
          'Make a full backup with qFlipper.',
          'Install Momentum from its web updater: it is the direct successor.',
          'Copy back to the SD card the asset packs you want to keep and check their compatibility.',
        ],
      },
      {
        title: 'Studying the code (without installing)',
        tool: 'Git',
        steps: [
          'Clone the archived repository read-only.',
          'Compare the applications/ and assets/ folders with the official firmware.',
          'Note the differences as a code review exercise.',
        ],
      },
    ],
    features: {
      regionUnlock: 'Extended frequencies',
      customThemes: 'Pioneer of asset packs',
      subghzExtra: 'Unleashed base (dated)',
      nfcExtra: 'Stuck at the last release',
      bundledApps: 'Many apps, not updated',
      webInstaller: 'Project closed',
      officialApi: 'Frozen API, recent apps incompatible',
      stability: 'No longer maintained',
      updates: 'Archived',
    },
  },
  roguemaster: {
    tags: ['Kitchen Sink', 'Max App', 'Animations', 'Experimental'],
    summary:
      'The "everything included" fork: it integrates the largest number of community apps, games and animations, at the expense of stability.',
    overview: [
      'RogueMaster merges changes from Unleashed and many other forks, adding hundreds of apps and animations.',
      'It is meant for those who want to try right away everything the community produces.',
      'The repository name ("-wip") reflects its constantly evolving nature: bugs and regressions are more likely.',
    ],
    differences: [
      'Far more preinstalled apps than other firmware.',
      'Large collection of dolphin animations.',
      'Region Unlock and extended protocols.',
      'Frequent releases with less testing than official/Unleashed.',
    ],
    ethics: [
      'Many of the included apps have offensive purposes: in the lab, consider a more essential firmware.',
      ...ETHICS_RF,
    ],
    install: [qFlipper('the .tgz package from the latest Release'), sdCard('.tgz')],
    features: {
      regionUnlock: 'Extended frequencies',
      customThemes: 'Huge collection of animations',
      subghzExtra: 'Extended protocols',
      nfcExtra: 'Many NFC/RFID apps included',
      bundledApps: 'The largest pack',
      webInstaller: 'Mainly qFlipper / SD',
      officialApi: 'Modified API',
      stability: 'Experimental',
      updates: 'Very frequent',
    },
  },
  'app-catalog': {
    tags: ['Official catalog', 'Education Friendly', 'Manifest'],
    summary: 'The official registry of .fap apps: each app is described by a manifest and built automatically.',
    overview: [
      'It contains the manifests of the apps published on lab.flipper.net and in the mobile app.',
      'Great for understanding how an app is published: structure, metadata, screenshots and the review process.',
    ],
    ethics: ['Catalog apps are reviewed, but always read the description before using them in the lab.'],
    install: fapInstall('<Category>'),
  },
  'good-faps': {
    name: 'Good FAPs (official apps)',
    tags: ['Official apps', 'Sample code', 'C'],
    summary: 'Apps maintained by the Flipper team: clean code to study as an example of .fap development.',
    overview: [
      'A collection of applications written and maintained by Flipper Devices.',
      'Ideal as study material for the course: GUI patterns, event handling, storage.',
    ],
    ethics: ['No particular risk: these are general-purpose, educational apps.'],
    install: fapInstall('<Category>'),
  },
  'all-the-plugins': {
    tags: ['App pack', 'Games', 'Tools', 'Community'],
    summary: 'A collection of hundreds of community apps, rebuilt for the official firmware and for Unleashed.',
    overview: [
      'Maintained by the Unleashed maintainer: the apps are already built for the latest APIs.',
      'Handy for quickly trying games, utilities and tools without building anything.',
    ],
    ethics: ['The pack also contains offensive tools: install only the categories you need.'],
    install: fapInstall('<Category>'),
  },
  ufbt: {
    tags: ['SDK', 'Python', 'App build', 'Education Friendly'],
    summary: 'The official tool for building and loading your own .fap apps without downloading the whole firmware.',
    overview: [
      'It installs with pip and automatically downloads the SDK compatible with the chosen firmware.',
      'Main commands: "ufbt create" for a new project, "ufbt launch" to build and run on the device.',
    ],
    ethics: ['A neutral development tool: the recommended entry point for exam projects.'],
    install: [
      {
        title: 'Development environment setup',
        tool: 'Python 3 + pip',
        steps: [
          'Install with: python3 -m pip install --upgrade ufbt',
          'Create a project folder and run: ufbt create APPID=hello_lab',
          'Connect the Flipper and run: ufbt launch',
          'For a firmware other than the official one use: ufbt update --index-url=<fork-sdk-url>',
        ],
      },
    ],
  },
  tutorials: {
    tags: ['Tutorial', 'Education Friendly', 'GPIO', 'App development'],
    summary: 'Guides and annotated examples on app development, GPIO, Sub-GHz and protocols: perfect as a textbook.',
    overview: [
      'An educational repository with step-by-step projects and linked videos.',
      'It covers both using the device and writing apps in C.',
    ],
    ethics: ['Educational material: follow the legal notes included in the individual tutorials.'],
    install: datasetInstall('a working folder on your computer (no need to copy them to the Flipper)'),
  },
  awesome: {
    tags: ['Curated list', 'Index', 'Firmware', 'Apps', 'Hardware'],
    summary: 'The community\'s reference index: firmware, apps, hardware modules, databases and guides.',
    overview: [
      'An "awesome list" that organizes the whole Flipper Zero ecosystem by category.',
      'Use it as a starting point to extend this hub with new repositories.',
    ],
    ethics: ['An index of external links: assess the reliability and legality of each resource case by case.'],
    install: datasetInstall('a working folder on your computer'),
  },
  uberguidoz: {
    tags: ['Sub-GHz', 'Infrared', 'NFC', 'BadUSB', 'Dataset'],
    summary: 'A huge archive of Sub-GHz, infrared, NFC, BadUSB and music files, organized in folders.',
    overview: [
      'A collection of .sub, .ir and .nfc files, BadUSB scripts and documentation gathered by the community.',
      'Useful in the lab above all for IR remotes and for studying the format of saved files.',
    ],
    ethics: [
      'Many .sub files reproduce signals of real devices: use them only to analyze the format, not to transmit.',
      ...ETHICS_RF.slice(0, 1),
    ],
    install: datasetInstall('/ext/subghz, /ext/infrared or /ext/nfc on the microSD'),
  },
  'subghz-bruteforce': {
    tags: ['Sub-GHz', 'Fixed codes', 'Red Team', 'Python'],
    summary: 'A Python script that generates .sub files to demonstrate the weakness of fixed-code remotes.',
    overview: [
      'It shows concretely why fixed codes (e.g. 12-bit CAME, NICE) are not secure: the key space is tiny.',
      'Educationally interesting for calculating attack times and understanding the value of rolling codes.',
    ],
    ethics: [
      'To be used ONLY on a lab test receiver, in a Faraday cage or at minimum power.',
      ...ETHICS_RF,
    ],
    install: datasetInstall('/ext/subghz/lab on the microSD'),
  },
  'badusb-jakoby': {
    tags: ['BadUSB', 'DuckyScript', 'PowerShell', 'Red Team'],
    summary: 'A collection of BadUSB payloads with explanations: great for understanding how a "malicious keyboard" compromises a PC.',
    overview: [
      'Each payload comes with a description and code: you can read step by step what it would do.',
      'Use it for analysis exercises and to design countermeasures (HID blocking, USB policies, EDR).',
    ],
    ethics: [
      'Run payloads only on virtual machines or dedicated lab PCs, never on other people\'s computers.',
      'Always read the script before running it: some download code from the Internet.',
      'Unauthorized use constitutes unauthorized access and damage to systems (arts. 615-ter, 635-bis of the Italian Criminal Code).',
    ],
    install: datasetInstall('/ext/badusb on the microSD'),
  },
  'ducky-payloads': {
    tags: ['DuckyScript', 'Reference', 'Payload'],
    summary: 'The official DuckyScript payload repository: the language the Flipper\'s BadUSB interprets.',
    overview: [
      'Useful for learning DuckyScript syntax (STRING, DELAY, GUI, ALTCODE...).',
      'Not all DuckyScript 3.0 commands are supported by the Flipper: always check compatibility.',
    ],
    ethics: ['Same rules as BadUSB: only in a VM or on lab workstations.'],
    install: datasetInstall('/ext/badusb on the microSD'),
  },
  marauder: {
    tags: ['Wi-Fi Dev Board', 'ESP32', 'Wi-Fi / BLE', 'Red Team'],
    summary: 'Firmware for the Wi-Fi board (ESP32) connected to the GPIO: network scanning and 2.4 GHz packet analysis.',
    overview: [
      'It installs on the Wi-Fi Dev Board or on compatible ESP32 modules and is controlled from the Flipper through a companion app.',
      'Great for lessons on 802.11: beacons, probe requests, channels, monitor-mode sniffing.',
    ],
    ethics: [
      'Deauth and attacks on other people\'s Wi-Fi networks are illegal: use an isolated lab access point.',
      'Sniffing third-party traffic violates the confidentiality of communications (art. 617-quater of the Italian Criminal Code).',
    ],
    install: [
      {
        title: 'Flashing the ESP32 board',
        tool: 'Browser / esptool',
        url: 'https://github.com/justcallmekoko/ESP32Marauder/wiki',
        steps: [
          'Follow the project wiki to choose the right binary for your board.',
          'Put the board in bootloader mode and flash it with the web flasher or esptool.',
          'Connect the board to the Flipper\'s GPIO and install the "[ESP32] WiFi Marauder" companion app.',
        ],
      },
    ],
  },
  blackmagic: {
    tags: ['Debugger', 'GDB', 'ESP32-S2', 'Education Friendly'],
    summary: 'Official firmware for the Wi-Fi Dev Board: it turns it into an SWD/GDB debugger for the Flipper.',
    overview: [
      'It enables step-by-step debugging of the firmware or your own apps through GDB, even over Wi-Fi.',
      'Perfect for embedded systems courses: breakpoints, memory inspection, crash analysis.',
    ],
    ethics: ['A neutral development tool, no particular notes.'],
    install: [
      {
        title: 'Updating the Dev Board',
        tool: 'qFlipper / Flipper Lab',
        url: 'https://docs.flipper.net/development/hardware/wifi-debugger-module/update',
        steps: [
          'Follow the official guide to update the Wi-Fi Dev Board.',
          'Connect the board to the Flipper and the PC, then start GDB pointing at the exposed serial port.',
          'Try a breakpoint on one of your own apps built with ufbt.',
        ],
      },
    ],
  },
};

/** Applica la traduzione alla scheda; in italiano o senza traduzione la restituisce invariata */
export function localizeEntry(entry: Entry, lang: Lang): Entry {
  const en = lang === 'en' ? EN[entry.id] : undefined;
  if (!en) return entry;
  const { features: notes, name, ...text } = en;
  let features = entry.features;
  if (features && notes) {
    const out = {} as Record<FeatureKey, { level: FeatureLevel; note: string }>;
    (Object.keys(features) as FeatureKey[]).forEach((k) => {
      out[k] = { level: features![k].level, note: notes[k] };
    });
    features = out;
  }
  return { ...entry, ...text, name: name ?? entry.name, features };
}
