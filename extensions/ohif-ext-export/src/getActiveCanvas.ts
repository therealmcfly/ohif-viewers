export default function getActiveCanvas(elements): HTMLCanvasElement | null {
  let canvas: HTMLCanvasElement | null = null;
  elements.forEach(element => {
    const children = element.children;
    const overlayDiv = children[1];
    const contentDiv = children[0];

    if (overlayDiv?.classList.contains('border-highlight')) {
      canvas = contentDiv.querySelector('canvas');

      return;
    }
  });
  return canvas;
}
