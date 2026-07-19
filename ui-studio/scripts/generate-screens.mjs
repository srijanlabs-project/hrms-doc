import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mockupsDir = path.resolve(root, "../docs/10-ui-ux-architecture/mockups");
const outDir = path.resolve(root, "src/data");
const outFile = path.resolve(outDir, "screens.generated.ts");

const familyLabels = {
  w0: "Wave 0 Platform and Admin",
  glb: "Global Utilities",
  emp: "Employee Self Service",
  mgr: "Manager Self Service",
  hro: "HR Operations",
  peo: "People Record",
  wrk: "Workforce Operations",
  pay: "Payroll",
  lev: "Leave",
  doc: "Documents",
  rec: "Recruitment",
  hlp: "Helpdesk",
  anl: "Analytics",
  ast: "Assets",
  ctr: "Contractors",
  hsw: "Health and Safety"
};

const files = fs
  .readdirSync(mockupsDir)
  .filter((file) => file.endsWith(".svg"))
  .sort((a, b) => a.localeCompare(b));

const screensMap = new Map();

for (const file of files) {
  const match = file.match(/^(.*)-(desktop|mobile)\.svg$/);
  if (!match) {
    continue;
  }
  const base = match[1];
  const mode = match[2];
  const parts = base.split("-");
  const ref = `${parts[0]}-${parts[1]}-${parts[2]}`.toUpperCase();
  const slug = parts.slice(3).join("-");
  const familyKey = parts[0];
  const existing = screensMap.get(ref) ?? {
    ref,
    slug,
    title: slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    familyKey,
    familyLabel: familyLabels[familyKey] ?? familyKey.toUpperCase(),
    desktopAsset: "",
    mobileAsset: ""
  };
  if (mode === "desktop") {
    existing.desktopAsset = `/${file}`;
  } else {
    existing.mobileAsset = `/${file}`;
  }
  screensMap.set(ref, existing);
}

const families = {};

for (const screen of screensMap.values()) {
  if (!families[screen.familyKey]) {
    families[screen.familyKey] = screen.familyLabel;
  }
}

const screens = Array.from(screensMap.values()).sort((a, b) => a.ref.localeCompare(b.ref));

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  outFile,
  `export type ScreenRecord = {
  ref: string;
  slug: string;
  title: string;
  familyKey: string;
  familyLabel: string;
  desktopAsset: string;
  mobileAsset: string;
};

export const screenFamilies = ${JSON.stringify(families, null, 2)} as const;

export const screens: ScreenRecord[] = ${JSON.stringify(screens, null, 2)};\n`,
  "utf8"
);

console.log(`Generated ${screens.length} screen records.`);
