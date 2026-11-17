"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import SwipeCard from "./SwipeCard";

const FLY_MS = 280;

export default function Discover() {
  const [view, setView] = useState("swipe"); // swipe | matches
  const [queue, setQueue] = useState(null);  // null = loading
  const [matches, setMatches] = useState([]);
  const [leaving, setLeaving] = useState(null); // null | "like" | "pass"
  const [matchPopup, setMatchPopup] = useState(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const busy = useRef(false);

  const loadFeed = useCallback(async () => {
    try {
      const r = await fetch("/api/feed", { cache: "no-store" });
      setQueue((await r.json()).profiles);
      setError("");
    } catch { setError("Couldn't load profiles. Check your connection and try again."); setQueue([]); }
  }, []);

  const loadMatches = useCallback(async () => {
    const r = await fetch("/api/matches", { cache: "no-store" });
    setMatches((await r.json()).matches);
  }, []);

  useEffect(() => { loadFeed(); loadMatches(); }, [loadFeed, loadMatches]);
  useEffect(() => { if (view === "matches") loadMatches(); }, [view, loadMatches]);

  const decide = useCallback((direction) => {
    if (busy.current || !queue || queue.length === 0) return;
    busy.current = true;
    const profile = queue[0];
    setLeaving(direction);
    setTimeout(async () => {
      try {
        const r = await fetch("/api/swipe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileId: profile.id, direction }),
        });
        if (!r.ok) throw new Error();
        const data = await r.json();
        setQueue((q) => q.filter((p) => p.id !== profile.id));
        if (data.match) { setMatchPopup(data.profile); loadMatches(); }
      } catch {
        setError("That swipe didn't save. Try again.");
      } finally {
        setLeaving(null);
        busy.current = false;
      }
    }, FLY_MS);
  }, [queue, loadMatches]);

  // Preload the photo behind the top card so the next card appears instantly
  useEffect(() => {
    if (queue && queue[2]) { const i = new Image(); i.src = queue[2].photo; }
  }, [queue]);

  // Desktop keyboard: ← pass, → like
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMatchPopup(null);
      if (view !== "swipe" || matchPopup) return;
      if (e.key === "ArrowRight") decide("like");
      if (e.key === "ArrowLeft") decide("pass");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [decide, view, matchPopup]);

  const resetDemo = async () => {
    await fetch("/api/reset", { method: "POST" });
    setQueue(null); setMatches([]);
    loadFeed(); loadMatches();
  };

  return (
    <section className="discover">
      <header className="dhead">
        <h1>Discover</h1>
        <div className="seg" role="tablist">
          <button role="tab" aria-selected={view === "swipe"} className={view === "swipe" ? "on" : ""} onClick={() => setView("swipe")}>Swipe</button>
          <button role="tab" aria-selected={view === "matches"} className={view === "matches" ? "on" : ""} onClick={() => setView("matches")}>
            Matches{matches.length > 0 && <span className="count">{matches.length}</span>}
          </button>
        </div>
      </header>

      {error && <p className="error" role="alert">{error} <button className="link" onClick={() => { setError(""); loadFeed(); }}>Retry</button></p>}

      {view === "swipe" && (
        <>
          <div className="stack">
            {queue === null && <div className="card skeleton" aria-busy="true" aria-label="Loading profiles" />}
            {queue && queue.length === 0 && (
              <div className="empty">
                <h2>You've seen everyone for now</h2>
                <p>New people show up here as they join. Your matches are waiting in the Matches tab.</p>
                <div className="row">
                  <button className="btn primary" onClick={() => setView("matches")}>View matches</button>
                  <button className="btn ghost" onClick={resetDemo}>Reset demo</button>
                </div>
              </div>
            )}
            {queue && queue.slice(0, 2).reverse().map((p, idx, arr) => {
              const isTop = idx === arr.length - 1;
              return (
                <SwipeCard key={p.id} profile={p} isTop={isTop}
                  leaving={isTop ? leaving : null}
                  onDecide={decide} />
              );
            })}
          </div>

          {queue && queue.length > 0 && (
            <div className="actions">
              <button className="round pass" aria-label="Pass" onClick={() => decide("pass")} disabled={!!leaving}>✕</button>
              <button className="round like" aria-label="Like" onClick={() => decide("like")} disabled={!!leaving}>♥</button>
            </div>
          )}
          {queue && queue.length > 0 && <p className="hint">Drag the card, use the buttons, or press ← / →. Likes stay secret until they're mutual.</p>}
        </>
      )}

      {view === "matches" && (
        <div className="matches">
          {matches.length === 0 ? (
            <div className="empty">
              <h2>No matches yet</h2>
              <p>A match appears here only when you and someone else both like each other. Keep swiping.</p>
              <button className="btn primary" onClick={() => setView("swipe")}>Start swiping</button>
            </div>
          ) : (
            <ul>
              {matches.map((m) => (
                <li key={m.id}>
                  <button className="mrow" aria-expanded={openId === m.id} onClick={() => setOpenId(openId === m.id ? null : m.id)}>
                    <img src={m.photo} alt="" />
                    <div>
                      <strong>{m.name}, {m.age}</strong>
                      <span>{m.place}</span>
                      <small>Matched {new Date(m.matchedAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}</small>
                    </div>
                  </button>
                  {openId === m.id && (
                    <div className="mdetail">
                      <p>{m.bio}</p>
                      <ul className="tags dark">{m.interests.map((i) => <li key={i}>{i}</li>)}</ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {matchPopup && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="It's a match">
          <div className="matchcard">
            <h2>It's a match!</h2>
            <p>You and {matchPopup.name} liked each other.</p>
            <div className="pair">
              <img src="/photos/me.svg" alt="You" />
              <img src={matchPopup.photo} alt={matchPopup.name} />
            </div>
            <button autoFocus className="btn primary" onClick={() => { setMatchPopup(null); setView("matches"); }}>See matches</button>
            <button className="btn ghost light" onClick={() => setMatchPopup(null)}>Keep swiping</button>
          </div>
        </div>
      )}
    </section>
  );
}
