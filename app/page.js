"use client";
import { useState } from "react";
import Discover from "@/components/Discover";

export default function Page() {
  const [tab, setTab] = useState("discover");
  return (
    <div className="shell">
      <main className="screen">
        {tab === "home" ? <div className="home-blank" aria-label="Home (placeholder)" /> : <Discover />}
      </main>
      <nav className="tabbar" role="tablist" aria-label="Main">
        {[["home", "Home"], ["discover", "Discover"]].map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "tab on" : "tab"} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
