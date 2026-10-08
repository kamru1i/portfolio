async function main() {
  const res = await fetch('https://framerusercontent.com/sites/7Le4GPtjktstnSLlmvci2p/KBDa7cyjGl-FTUHXYHXI087VAc_Poaucccc_x_jzXVM.BYB4B54t.mjs');
  const text = await res.text();
  const idx = text.indexOf('I turn ambitious');
  console.log('INDEX:', idx);
  if (idx !== -1) {
    console.log(text.substring(Math.max(0, idx - 500), idx + 800));
  }
}
main().catch(console.error);
