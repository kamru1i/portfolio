import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve(".qa/wordmark-candidates");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {
            background-color: #000;
            color: #fff;
            padding: 40px;
            font-family: sans-serif;
          }
          .label { color: #888; font-size: 13px; font-family: monospace; margin-bottom: 15px; }
          .card { background: #080808; border: 1px solid #1a1a1a; padding: 30px; margin-bottom: 40px; border-radius: 8px; }
          .ref-img { margin-bottom: 30px; border-bottom: 1px solid #222; padding-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="ref-img">
          <div class="label">PRIMARY REFERENCE (FROM SCREENSHOT):</div>
          <svg width="539" height="78" viewBox="0 0 539 78" fill="none">
            <!-- Aurexa path extracted from reference -->
            <path d="M65.9609 0C66.2152 0 66.95 2.88261 68.1652 8.64783C76.9826 45.0761 82.4652 68.1369 84.613 77.8304L84.4435 78H54.9391C54.5717 78 53.8935 73.8739 52.9043 65.6217C52.763 65.6217 52.65 65.1696 52.5652 64.2652H32.2174C31.9348 64.2652 31.3696 67.8261 30.5217 74.9478C30.2109 76.9826 29.9283 78 29.6739 78H0C1.01739 72.9978 7.17826 46.9978 18.4826 0H65.9609ZM42.2217 21.1957L37.3043 44.5956H47.3087L42.3913 21.1957H42.2217Z" fill="#EBEBEB"/>
            <path d="M82.5813 0H112.255L112.594 0.33913V51.8869C112.594 55.5891 113.838 57.963 116.325 59.0087H134.299C136.87 59.0087 138.34 56.6913 138.707 52.0565V0.33913L139.047 0H168.551L168.89 0.33913V58.5C168.89 64.5196 165.386 69.8326 158.377 74.4391C154.449 76.813 149.588 78 143.794 78H107.507C95.7791 78 87.6965 73.1391 83.2596 63.4174C82.5813 61.0717 82.2422 58.6978 82.2422 56.2956V0.33913L82.5813 0Z" fill="#EBEBEB"/>
            <path d="M172.011 0H242.041C247.92 0 252.668 2.37391 256.285 7.12174C258.094 9.66522 258.998 13.3956 258.998 18.313V32.8956C258.998 41.6 254.815 47.4217 246.45 50.3609V50.5304L262.898 77.6609L262.559 78H232.037C231.274 77.1804 225.848 68.3065 215.759 51.3783L215.589 51.2087H201.685L201.346 51.5478V77.6609L201.007 78H172.011L171.672 77.6609V0.33913L172.011 0ZM201.515 19.3304V31.8783H227.628C230.737 31.8783 232.659 30.7478 233.394 28.487V22.7217C233.394 20.9696 231.641 19.8391 228.137 19.3304H201.515Z" fill="#EBEBEB"/>
            <path d="M263.468 0L394.586 0H398.882L383.478 16.4478L383.138 16.787H292.803V26.9609H333.498L333.838 27.3V45.613L333.498 45.9522H292.803V59.0087H336.89L337.229 59.3478V77.6609L336.89 78H263.468L263.129 77.6609V0.339141L263.468 0Z" fill="#EBEBEB"/>
            <path d="M362.369 26.4716L408.721 26.1325L391.604 18.4409L408.721 0.358573L446.514 0V0.169565L414.805 39L446.345 77.8304L446.175 78H408.701L395.814 62.4L382.758 78H344.945L344.605 77.6609L376.484 38.8304L362.369 26.4716Z" fill="#EBEBEB"/>
            <path d="M493.453 0C493.707 0 494.442 2.88261 495.657 8.64783C504.475 45.0761 509.957 68.1369 512.105 77.8304L511.936 78H482.431C482.064 78 481.386 73.8739 480.397 65.6217C480.255 65.6217 480.142 65.1696 480.057 64.2652H459.71C459.427 64.2652 458.862 67.8261 458.014 74.9478C457.703 76.9826 457.42 78 457.166 78H427.492C428.51 72.9978 434.67 46.9978 445.975 0H493.453ZM469.714 21.1957L464.797 44.5956H474.801L469.883 21.1957H469.714Z" fill="#EBEBEB"/>
            <!-- R mark -->
            <circle cx="528" cy="14" r="8" stroke="#EBEBEB" stroke-width="1.5" fill="none"/>
            <text x="528" y="17" font-size="8.5" font-family="sans-serif" font-weight="900" fill="#EBEBEB" text-anchor="middle">R</text>
          </svg>
        </div>

        <!-- CANDIDATE 1: Architectural Monumental Vector for "KAMRUL I" with identical glyph weight and proportions -->
        <div class="card">
          <div class="label">CANDIDATE 1: EXTENDED GEOMETRIC "KAMRUL I®" (PROPORTION MATCH: 539x78)</div>
          <svg width="539" height="78" viewBox="0 0 539 78" fill="none">
            <!-- K (0 to 64) -->
            <path d="M0 0H24V78H0V0Z" fill="#FFFFFF"/>
            <path d="M22 41L64 0H92L44 45L92 78H64L22 47V41Z" fill="#FFFFFF"/>
            <!-- A (88 to 156) -->
            <path d="M88 78L120 0H144L176 78H151L145 61H119L113 78H88ZM125 45H139L132 20L125 45Z" fill="#FFFFFF"/>
            <!-- M (170 to 250) -->
            <path d="M170 0H192L210 46L228 0H250V78H230V24L216 58H204L190 24V78H170V0Z" fill="#FFFFFF"/>
            <!-- R with aerodynamic architectural top wing over U (246 to 318) -->
            <path d="M246 0H306C319 0 327 9 327 23C327 34 320 41 310 44L328 78H304L288 48H268V78H246V0ZM268 16V33H301C305 33 307 30 307 25C307 20 305 16 301 16H268Z" fill="#FFFFFF"/>
            <!-- U (324 to 386) -->
            <path d="M324 0H346V54C346 61 349 64 355 64C361 64 364 61 364 54V0H386V54C386 70 375 78 355 78C335 78 324 70 324 54V0Z" fill="#FFFFFF"/>
            <!-- L (394 to 448) -->
            <path d="M394 0H416V62H448V78H394V0Z" fill="#FFFFFF"/>
            <!-- I (464 to 488) - intentional space between L and I -->
            <path d="M464 0H488V78H464V0Z" fill="#FFFFFF"/>
            <!-- Registered Mark ® (504 to 528) -->
            <circle cx="516" cy="14" r="8" stroke="#FFFFFF" stroke-width="1.5" fill="none"/>
            <text x="516" y="17" font-size="8.5" font-family="sans-serif" font-weight="900" fill="#FFFFFF" text-anchor="middle">R</text>
          </svg>
        </div>

        <!-- CANDIDATE 2: With Signature Extended Architectural Bridge Ligature (like Aurexa E->X wing) -->
        <div class="card">
          <div class="label">CANDIDATE 2: SIGNATURE ARCHITECTURAL LIGATURE (R top bar extends as a sleek aerodynamic visor over U)</div>
          <svg width="539" height="78" viewBox="0 0 539 78" fill="none">
            <!-- K -->
            <path d="M0 0H24V78H0V0Z" fill="#FFFFFF"/>
            <path d="M22 41L64 0H92L44 45L92 78H64L22 47V41Z" fill="#FFFFFF"/>
            <!-- A -->
            <path d="M88 78L120 0H144L176 78H151L145 61H119L113 78H88ZM125 45H139L132 20L125 45Z" fill="#FFFFFF"/>
            <!-- M -->
            <path d="M170 0H192L210 46L228 0H250V78H230V24L216 58H204L190 24V78H170V0Z" fill="#FFFFFF"/>
            <!-- R with extended top wing spanning across to U (Aurexa style!) -->
            <path d="M246 0H376L364 16H268V33H302C306 33 308 30 308 25C308 20 306 16 302 16L246 16V0Z" fill="#FFFFFF"/>
            <path d="M246 33H268V78H246V33Z" fill="#FFFFFF"/>
            <path d="M302 44L328 78H304L288 48H268V33H302C314 33 322 38 322 44C322 48 318 52 312 53L302 44Z" fill="#FFFFFF"/>
            <!-- U (tucked under the R wing) -->
            <path d="M324 22H346V54C346 61 349 64 355 64C361 64 364 61 364 54V22H386V54C386 70 375 78 355 78C335 78 324 70 324 54V22Z" fill="#FFFFFF"/>
            <!-- L with pedestal extension under I -->
            <path d="M394 0H416V62H488V78H394V0Z" fill="#FFFFFF"/>
            <!-- I standing on the pedestal -->
            <path d="M464 0H488V62H464V0Z" fill="#FFFFFF"/>
            <!-- (R) mark -->
            <circle cx="516" cy="14" r="8" stroke="#FFFFFF" stroke-width="1.5" fill="none"/>
            <text x="516" y="17" font-size="8.5" font-family="sans-serif" font-weight="900" fill="#FFFFFF" text-anchor="middle">R</text>
          </svg>
        </div>

      </body>
    </html>
  `);

  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, "candidates.png") });
  console.log("Candidates captured.");
  await browser.close();
}

main().catch(console.error);
