const input = document.getElementById("input");

input.addEventListener("input", () => {
  const offset = getCursorOffset(input);

  let val = input.innerText;
  const regex = /[-–—]/g;
  val = val.replace(regex, (match) => randomiseDash(match));
  input.innerHTML = val;

  setCursorOffset(input, offset);
});

function randomiseDash(char) {
  const scale = (Math.random() * 3.8+ 0.2).toFixed(2);
  return `<span style="display:inline-block; transform:scaleX(${scale})">${char}</span>`;
}

function getCursorOffset(el) {
  const sel = window.getSelection();
  if (!sel.rangeCount) return 0;
  const range = sel.getRangeAt(0).cloneRange();
  range.selectNodeContents(el);
  range.setEnd(sel.anchorNode, sel.anchorOffset);
  return range.toString().length;
}

function setCursorOffset(el, offset) {
  const sel = window.getSelection();
  let remaining = offset;
  let found = false;
  function walk(node) {
    if (found) return;
    if (node.nodeType === Node.TEXT_NODE) {
      if (remaining <= node.length) {
        const range = document.createRange();
        range.setStart(node, remaining);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        found = true;
      } else {
        remaining -= node.length;
      }
    } else {
      for (const child of node.childNodes) walk(child);
    }
  }
  walk(el);
}
