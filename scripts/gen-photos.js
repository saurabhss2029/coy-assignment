// Generates placeholder avatar SVGs into public/photos (no external images needed).
const fs = require("fs");
const path = require("path");
const names = fs.readFileSync(path.join(__dirname, "../lib/seed.js"), "utf8")
  .match(/^\s*\["([^"]+)",/gm).map((l) => l.match(/"([^"]+)"/)[1]);
fs.mkdirSync(path.join(__dirname, "../public/photos"), { recursive: true });
names.forEach((name, i) => {
  const id = i + 1;
  const h1 = (id * 47) % 360, h2 = (h1 + 55) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${h1} 70% 62%)"/><stop offset="1" stop-color="hsl(${h2} 65% 38%)"/></linearGradient></defs>
<rect width="600" height="800" fill="url(#g)"/>
<circle cx="300" cy="300" r="110" fill="rgba(255,255,255,.28)"/>
<path d="M90 800c0-170 95-260 210-260s210 90 210 260z" fill="rgba(255,255,255,.28)"/>
<text x="300" y="338" font-family="Georgia,serif" font-size="120" text-anchor="middle" fill="#fff">${name[0]}</text>
</svg>`;
  fs.writeFileSync(path.join(__dirname, `../public/photos/${id}.svg`), svg);
});
console.log(`Generated ${names.length} photos`);
