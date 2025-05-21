export const copyCanvas = (
  canvas: HTMLCanvasElement,
  canvasRef: React.RefObject<null>,
  callback?: ({}: any) => void,
) => {
  if (!canvasRef.current) {
    console.log('copyCanvas(): no flood canvas');
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  if (callback) {
    callback({canvasWidth, canvasHeight});
  }

  const floodCanvas = canvasRef.current as HTMLCanvasElement;
  const ctx = floodCanvas.getContext('2d');

  floodCanvas.width = canvasWidth;
  floodCanvas.height = canvasHeight;

  ctx?.drawImage(canvas, 0, 0, canvasWidth, canvasHeight);
}
