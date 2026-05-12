import { domToPng } from "modern-screenshot";

/**
 * Gera PNG (data URL) a partir de um nó DOM, preservando layout e cores
 * visíveis na tela. Compatível com Tailwind 4 / cores em oklch (evita o
 * erro do html2canvas ao parsear "oklch(...)").
 *
 * @param {HTMLElement} node
 * @param {Record<string, unknown>} [options] Opções extras do modern-screenshot (scale, backgroundColor, …).
 * @returns {Promise<string>}
 */
export async function captureNodeToPngDataUrl(node, options = {}) {
  const { scale = 2, backgroundColor = null, ...rest } = options;

  return domToPng(node, {
    scale,
    backgroundColor,
    timeout: 60_000,
    ...rest,
  });
}

/**
 * @param {string} dataUrl
 * @param {string} filename
 */
export function downloadDataUrl(dataUrl, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
