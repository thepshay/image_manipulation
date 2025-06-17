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

export const getEuclieanDistance = (
  startingColor: {
    r: number;
    g: number;
    b: number;
  },
  nextColor: {
    r: number;
    g: number;
    b: number;
  }
) => {
  const {r: red1, g: green1, b: blue1} = startingColor;
  const {r: red2, g: green2, b: blue2} = nextColor;

  const dRed = red1 - red2;
  const dGreen = green1 - green2; 
  const dBlue = blue1 - blue2;

  const squaredDistance = dRed * dRed + dGreen * dGreen + dBlue * dBlue;
  const distance = Math.sqrt(squaredDistance);

  return distance;
}