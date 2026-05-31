/**
 * Fetches all 710 verses from vedicscriptures.github.io and saves as gita.json
 * Run once: node scripts/fetch-gita.mjs
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CHAPTER_VERSE_COUNTS = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78];

const CHAPTER_NAMES = [
  { en: 'Arjuna Visada Yoga', hi: 'अर्जुनविषादयोग', meaning: 'The Yoga of Arjuna\'s Grief' },
  { en: 'Sankhya Yoga', hi: 'सांख्ययोग', meaning: 'The Yoga of Knowledge' },
  { en: 'Karma Yoga', hi: 'कर्मयोग', meaning: 'The Yoga of Action' },
  { en: 'Jnana Karma Sanyasa Yoga', hi: 'ज्ञानकर्मसंन्यासयोग', meaning: 'The Yoga of Wisdom and Renunciation' },
  { en: 'Karma Sanyasa Yoga', hi: 'कर्मसंन्यासयोग', meaning: 'The Yoga of Renunciation of Action' },
  { en: 'Dhyana Yoga', hi: 'ध्यानयोग', meaning: 'The Yoga of Meditation' },
  { en: 'Gyaan Vigyana Yoga', hi: 'ज्ञानविज्ञानयोग', meaning: 'The Yoga of Knowledge and Wisdom' },
  { en: 'Akshara Brahma Yoga', hi: 'अक्षरब्रह्मयोग', meaning: 'The Yoga of the Imperishable Brahman' },
  { en: 'Raja Vidya Yoga', hi: 'राजविद्याराजगुह्ययोग', meaning: 'The Yoga of Royal Knowledge and Secret' },
  { en: 'Vibhooti Yoga', hi: 'विभूतियोग', meaning: 'The Yoga of Divine Manifestations' },
  { en: 'Vishwaroopa Darshana Yoga', hi: 'विश्वरूपदर्शनयोग', meaning: 'The Yoga of the Vision of the Universal Form' },
  { en: 'Bhakti Yoga', hi: 'भक्तियोग', meaning: 'The Yoga of Devotion' },
  { en: 'Ksetra Ksetrajna Vibhaaga Yoga', hi: 'क्षेत्र-क्षेत्रज्ञविभागयोग', meaning: 'The Yoga of Field and Its Knower' },
  { en: 'Gunatraya Vibhaga Yoga', hi: 'गुणत्रयविभागयोग', meaning: 'The Yoga of the Three Gunas' },
  { en: 'Purushottama Yoga', hi: 'पुरुषोत्तमयोग', meaning: 'The Yoga of the Supreme Person' },
  { en: 'Daivasura Sampad Vibhaga Yoga', hi: 'दैवासुरसम्पद्विभागयोग', meaning: 'The Yoga of Divine and Demonic Natures' },
  { en: 'Sraddhatraya Vibhaga Yoga', hi: 'श्रद्धात्रयविभागयोग', meaning: 'The Yoga of Three Kinds of Faith' },
  { en: 'Moksha Sanyaas Yoga', hi: 'मोक्षसंन्यासयोग', meaning: 'The Yoga of Liberation through Renunciation' },
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchVerse(chapter, verse) {
  const url = `https://vedicscriptures.github.io/slok/${chapter}/${verse}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.json();
}

function extractVerse(raw, chapter, verse) {
  // Pick best English translation
  const en = raw.siva?.et || raw.purohit?.et || raw.prabhu?.et || raw.gambir?.et || raw.san?.et || raw.adi?.et || '';
  // Hindi
  const hi = raw.tej?.ht || raw.rams?.ht || '';

  return {
    id: `${chapter}.${verse}`,
    chapter,
    verse,
    sanskrit: raw.slok || '',
    transliteration: raw.transliteration || '',
    en: en.replace(/\n/g, ' ').trim(),
    hi: hi.replace(/\n/g, ' ').trim(),
    // Extra translations for search
    en_all: [
      raw.siva?.et, raw.purohit?.et, raw.prabhu?.et, raw.gambir?.et,
      raw.san?.et, raw.adi?.et, raw.raman?.et,
    ].filter(Boolean).join(' ').replace(/\n/g, ' '),
  };
}

async function main() {
  const allVerses = [];
  const chapters = [];

  for (let ch = 1; ch <= 18; ch++) {
    const count = CHAPTER_VERSE_COUNTS[ch - 1];
    const meta = CHAPTER_NAMES[ch - 1];
    chapters.push({ chapter: ch, verseCount: count, ...meta });

    console.log(`Chapter ${ch} (${count} verses)...`);
    for (let v = 1; v <= count; v++) {
      try {
        const raw = await fetchVerse(ch, v);
        allVerses.push(extractVerse(raw, ch, v));
        process.stdout.write('.');
        await sleep(50); // be gentle on the API
      } catch (e) {
        console.error(`\nError ch${ch}v${v}: ${e.message}`);
        allVerses.push({ id: `${ch}.${v}`, chapter: ch, verse: v, sanskrit: '', transliteration: '', en: '', hi: '', en_all: '' });
      }
    }
    console.log(' done');
    await sleep(200);
  }

  const out = { chapters, verses: allVerses };
  const outPath = join(__dirname, '../src/data/gita.json');
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\nSaved ${allVerses.length} verses to src/data/gita.json`);
}

main().catch(console.error);
