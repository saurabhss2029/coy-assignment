"use client";
import { useRef, useState } from "react";

const THRESHOLD = 110;

export default function SwipeCard({ profile, isTop, leaving, onDecide }) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const start = useRef(null);

  const down = (e) => {
    if (!isTop || leaving) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, active: true });
  };
  const move = (e) => {
    if (!start.current) return;
    setDrag({ x: e.clientX - start.current.x, y: (e.clientY - start.current.y) * 0.3, active: true });
  };
  const up = () => {
    if (!start.current) return;
    start.current = null;
    if (drag.x > THRESHOLD) onDecide("like");
    else if (drag.x < -THRESHOLD) onDecide("pass");
    else setDrag({ x: 0, y: 0, active: false });
  };

  let x = drag.x, y = drag.y, transition = drag.active ? "none" : "transform .25s ease";
  if (leaving) {
    x = leaving === "like" ? 700 : -700;
    transition = `transform .28s ease-in`;
  }
  const rot = x / 18;
  const likeOpacity = Math.max(0, Math.min(1, x / THRESHOLD));
  const passOpacity = Math.max(0, Math.min(1, -x / THRESHOLD));

  const style = isTop
    ? { transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`, transition }
    : { transform: "scale(.94) translateY(14px)", opacity: 0.9 };

  return (
    <article className={isTop ? "card top" : "card"} style={style}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <img src={profile.photo} alt={`${profile.name}`} draggable={false} />
      <div className="shade" />
      {isTop && <>
        <span className="stamp like" style={{ opacity: likeOpacity }}>LIKE</span>
        <span className="stamp nope" style={{ opacity: passOpacity }}>PASS</span>
      </>}
      <div className="info">
        <h2>{profile.name}<span>{profile.age}</span></h2>
        <p className="place">{profile.place}</p>
        <p className="bio">{profile.bio}</p>
        <ul className="tags">{profile.interests.map((i) => <li key={i}>{i}</li>)}</ul>
      </div>
    </article>
  );
}
