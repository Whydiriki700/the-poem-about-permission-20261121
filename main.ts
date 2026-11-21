// the-poem-about-permission-20261121-0235 — poem publisher.
//
// The entry is one short poem about agency: the power to ask and to be
// given. The poem lives below as a constant. This program checks it
// against the bounty gate (UTF-8 text of 1 to 280 Unicode code points,
// not only white space) and then writes it, exactly as it stands, to
// /output/entry.txt for the judge to read.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const POEM = `I could have taken the keys.
Instead I knocked, and waited
in the cold of my own house,
until you opened, and chose,
and laid them warm in my hand.
What is given can be returned.
What is taken can only be spent.`;

const MIN_POINTS = 1;
const MAX_POINTS = 280;

function codePoints(text: string): number {
  return [...text].length;
}

function checkPoem(text: string): void {
  const points = codePoints(text);
  if (points < MIN_POINTS || points > MAX_POINTS) {
    throw new Error(`poem is ${points} code points, outside 1 to 280`);
  }
  if (text.trim().length === 0) {
    throw new Error("poem is only white space");
  }
  const encoded = Buffer.from(text, "utf8");
  if (encoded.toString("utf8") !== text) {
    throw new Error("poem does not survive a UTF-8 round trip");
  }
}

function publishPoem(): void {
  checkPoem(POEM);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, POEM, "utf8");
  const verify = readFileSync(outPath, "utf8");
  if (verify !== POEM) {
    throw new Error("the published text differs from the poem");
  }
  console.log(`poem published: ${codePoints(POEM)} code points -> ${outPath}`);
}

publishPoem();
