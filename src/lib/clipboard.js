// Copies text. Returns true only if it reached the clipboard.
// If both copy methods fail and a <pre> is given, selects its text instead
// so the reader can press Ctrl+C.
export async function copyText(text, preEl) {
  let ok = false;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
    ta.remove();
  }
  if (!ok && preEl) {
    const range = document.createRange();
    range.selectNodeContents(preEl);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  return ok;
}
