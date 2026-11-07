import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'fs';
import path from 'path';

const scenes = [
  {
    id: 1,
    file: 'scene1.mp3',
    text: "Stop scrolling! If you run a restaurant, cafe, or business, ninety percent of free QR code generators are a trap! They deactivate your codes after fourteen days and demand twenty-five dollars a month!",
    rate: '+5%',
    pitch: '+0Hz',
  },
  {
    id: 2,
    file: 'scene2.mp3',
    text: "Here is the secret antidote: q r must dot netlify dot app. It is one hundred percent free forever, zero sign-up, zero paywalls, with over sixty specialized QR generators ready to use!",
    rate: '+5%',
    pitch: '+0Hz',
  },
  {
    id: 3,
    file: 'scene3.mp3',
    text: "It is super simple: One, pick your generator, like Wi-Fi, vCard, menu, or Google review. Two, type your info. Three, add your brand logo in the center and choose custom colors. Then download high-res vector SVG or PNG in seconds!",
    rate: '+6%',
    pitch: '+0Hz',
  },
  {
    id: 4,
    file: 'scene4.mp3',
    text: "Cafe owners: put a Wi-Fi QR on table tents so guests connect in one second without asking for passwords. Realtors and freelancers: put a vCard QR on your card so clients save your full contact info into iPhone address books with one tap!",
    rate: '+5%',
    pitch: '+0Hz',
  },
  {
    id: 5,
    file: 'scene5.mp3',
    text: "Clinics and salons: put a Google Review QR at checkout to get hundreds of five-star reviews! Event planners: encode calendar invites on badges so attendees never miss a session!",
    rate: '+5%',
    pitch: '+0Hz',
  },
  {
    id: 6,
    file: 'scene6.mp3',
    text: "Where to use? Storefront windows, flyers, product packaging, and invoices. Plus, their ten to one Print Calculator ensures your codes never print blurry. Never expires, unlimited scans, one hundred percent private!",
    rate: '+6%',
    pitch: '+0Hz',
  },
  {
    id: 7,
    file: 'scene7.mp3',
    text: "Stop paying monthly fees for QR codes. Go to q r must dot netlify dot app right now. The link is on screen and in bio. Tap the link and create yours today!",
    rate: '+4%',
    pitch: '+0Hz',
  },
];

async function main() {
  const outputDir = path.resolve(process.cwd(), 'public/audio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const voice = 'en-US-AndrewMultilingualNeural';
  console.log(`Using Neural Voice: ${voice}`);

  for (const s of scenes) {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const destPath = path.join(outputDir, s.file);

    console.log(`Generating ${s.file} (Scene ${s.id})...`);
    const { audioStream } = tts.toStream(s.text, {
      rate: s.rate,
      pitch: s.pitch,
      volume: '+0%',
    });

    const fileStream = fs.createWriteStream(destPath);
    await new Promise((resolve, reject) => {
      audioStream.pipe(fileStream);
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    const stats = fs.statSync(destPath);
    console.log(`✓ Saved ${s.file} (${stats.size} bytes)`);
  }

  console.log('All 7 human voiceover scene files generated successfully!');
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
