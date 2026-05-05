import sharp from "sharp";

const LOGOS = [
  { name: "Vite", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" },
  { name: "HTML", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "TypeScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
];

const LOGO_SIZE = 128;
const PADDING = 24;
const COLS = LOGOS.length;
const WIDTH = COLS * LOGO_SIZE + (COLS + 1) * PADDING;
const HEIGHT = LOGO_SIZE + PADDING * 2;

async function fetchLogo(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return sharp(buffer).resize(LOGO_SIZE, LOGO_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
}

async function main() {
  console.log("Fetching logos...");

  const buffers = await Promise.all(
    LOGOS.map(async (logo) => {
      console.log(`  ↳ ${logo.name}`);
      return fetchLogo(logo.url);
    })
  );

  const composites = buffers.map((buf, i) => ({
    input: buf,
    left: PADDING + i * (LOGO_SIZE + PADDING),
    top: PADDING,
  }));

  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile("tech-logos.png");

  console.log(`\n✓ Saved tech-logos.png (${WIDTH}x${HEIGHT})`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
