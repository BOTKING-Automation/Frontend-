'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../lib/api';

export default function Education() {
  const [articles, setArticles] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    api('/content/education', { auth: false }).then(setArticles).catch(() => {});
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="font-display text-2xl font-bold mb-6">Education</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {articles.map((a) => (
              <button key={a.id} onClick={() => setActive(a)} className={`card w-full text-left ${active?.id === a.id ? 'border-gold' : ''}`}>
                <p className="text-xs text-gold uppercase mb-1">{a.category}</p>
                <p className="font-semibold">{a.title}</p>
              </button>
            ))}
          </div>
          <div className="card">
            {active ? (
              <>
                <h2 className="text-xl font-bold mb-3">{active.title}</h2>
                <p className="text-muted leading-relaxed whitespace-pre-line">{active.content}</p>
              </>
            ) : (
              <p className="text-muted text-sm">Select an article to read.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
