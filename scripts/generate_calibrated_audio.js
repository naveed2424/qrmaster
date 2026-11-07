import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import path from 'path';

// Exact 60-second scene texts, calibrated to fit each scene perfectly
const scenes = [
  {
    id: 1,
    file: 'scene1.mp3',
    text: "Stop scrolling! If you run a business, ninety percent of free QR code generators deactivate your codes after fourteen days and demand twenty-five dollars a month!",
    rate: '+12%',
    targetSec: 7.5,
  },
  {
    id: 2,
    file: 'scene2.mp3',
    text: "Here is the antidote: q r must dot netlify dot app. It is one hundred percent free forever, zero sign-up, with over sixty specialized QR tools ready to use!",
    rate: '+12%',
    targetSec: 8.0,
  },
  {
    id: 3,
    file: 'scene3.mp3',
    text: "It is so easy: pick your tool, type your info, and add your brand logo right in the center. Then download crystal clear vector SVG or PNG instantly!",
    rate: '+12%',
    targetSec: 9.5,
  },
  {
    id: 4,
    file: 'scene4.mp3',
    text: "Cafe owners: put Wi-Fi QRs on table tents so guests connect in one second without passwords. Realtors: put vCards on cards to save your phone and email in one tap!",
    rate: '+12%',
    targetSec: 10.5,
  },
  {
    id: 5,
    file: 'scene5.mp3',
    text: "Clinics and salons: put a Google Review QR at checkout to get hundreds of five-star reviews! Event planners: encode instant calendar invites on badges!",
    rate: '+12%',
    targetSec: 9.0,
  },
  {
    id: 6,
    file: 'scene6.mp3',
    text: "Where to use? Storefront windows, flyers, product packaging, and invoices. Plus, their ten to one Print Calculator guarantees your codes never print blurry!",
    rate: '+12%',
    targetSec: 8.5,
  },
  {
    id: 7,
    file: 'scene7.mp3',
    text: "Stop paying monthly fees for QR codes. Go to q r must dot netlify dot app right now. Link is on screen and in bio. Tap it today!",
    rate: '+12%',
    targetSec: 7.0,
  },
];

async function main() {
  const outputDir = path.resolve(process.cwd(), 'public/audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const voice = 'en-US-AndrewMultilingualNeural';
  console.log(`Generating calibrated 60s voiceovers with ${voice}...`);

  for (const s of scenes) {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const destPath = path.join(outputDir, s.file);

    const { audioStream } = tts.toStream(s.text, {
      rate: s.rate,
      volume: '+0%',
    });

    const fileStream = fs.createWriteStream(destPath);
    await new Promise((resolve, reject) => {
      audioStream.pipe(fileStream);
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    console.log(`Generated ${s.file}`);
  }
}

main().catch(console.error);
