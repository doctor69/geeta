import { useState, useCallback, useRef, useEffect } from 'react';
import Fuse from 'fuse.js';

interface Verse {
  id: string;
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  en: string;
  hi: string;
  en_all: string;
}

interface Chapter {
  chapter: number;
  en: string;
  hi: string;
  meaning: string;
  verseCount: number;
}

interface Props {
  verses: Verse[];
  chapters: Chapter[];
  base: string;
}

const FUSE_OPTIONS = {
  keys: [
    { name: 'en_all', weight: 0.6 },
    { name: 'en', weight: 0.3 },
    { name: 'transliteration', weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 3,
  ignoreLocation: true,
  useExtendedSearch: false,
};

function highlight(text: string, query: string): string {
  if (!query || !text) return text;
  const words = query.trim().split(/\s+/).filter(w => w.length > 2);
  if (!words.length) return text;
  const pattern = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  return text.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
}

function VerseCard({ verse, query, chapterName, base }: {
  verse: Verse; query: string; chapterName: string; base: string;
}) {
  const url = `${base}verse/${verse.chapter}/${verse.verse}`;
  const enSnippet = verse.en.length > 240 ? verse.en.slice(0, 240) + '…' : verse.en;

  return (
    <a href={url} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="verse-card">
        <div className="verse-meta">
          <span className="verse-ref">{verse.chapter}.{verse.verse}</span>
          <span className="chapter-name">{chapterName}</span>
        </div>
        <div className="sanskrit-text">{verse.sanskrit}</div>
        <div className="transliteration">{verse.transliteration}</div>
        <div
          className="translation-en"
          dangerouslySetInnerHTML={{ __html: highlight(enSnippet, query) }}
        />
      </div>
    </a>
  );
}

export default function Search({ verses, chapters, base }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Verse[]>([]);
  const [searched, setSearched] = useState(false);
  const fuseRef = useRef<Fuse<Verse> | null>(null);

  useEffect(() => {
    fuseRef.current = new Fuse(verses, FUSE_OPTIONS);
  }, [verses]);

  const chapterMap = Object.fromEntries(chapters.map(c => [c.chapter, c]));

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim() || q.trim().length < 3) {
      setResults([]);
      setSearched(false);
      return;
    }
    if (!fuseRef.current) return;
    const raw = fuseRef.current.search(q.trim());
    setResults(raw.slice(0, 20).map(r => r.item));
    setSearched(true);
  }, []);

  const EXAMPLES = [
    'do your duty without attachment to results',
    'the soul is never born nor dies',
    'never was there a time when I did not exist',
    'when you abandon all desires of the mind',
    'those who worship me with devotion',
    'the wise grieve neither for the living nor the dead',
    'surrendering all your works to me',
    'better to perform one\'s own duty',
  ];

  return (
    <div>
      <div className="search-box">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search by meaning, story or concept…"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            autoFocus
            spellCheck={false}
          />
        </div>
        <p className="search-hint">
          e.g. "the soul is never born" · "duty without attachment" · "battlefield of life"
        </p>
      </div>

      {searched && (
        <p className="results-count">
          {results.length === 0
            ? 'No verses found. Try different words.'
            : `${results.length} verse${results.length === 1 ? '' : 's'} found`}
        </p>
      )}

      {results.length > 0 && results.map(v => (
        <VerseCard
          key={v.id}
          verse={v}
          query={query}
          chapterName={chapterMap[v.chapter]?.en || ''}
          base={base}
        />
      ))}

      {!searched && (
        <div style={{ marginTop: '3rem' }}>
          <p style={{ fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Try searching for
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => handleSearch(ex)}
                style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '20px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => {
                  (e.target as HTMLElement).style.borderColor = 'var(--gold-dim)';
                  (e.target as HTMLElement).style.color = 'var(--gold)';
                }}
                onMouseOut={e => {
                  (e.target as HTMLElement).style.borderColor = 'var(--border)';
                  (e.target as HTMLElement).style.color = 'var(--text-dim)';
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
