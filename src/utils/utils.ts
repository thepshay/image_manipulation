export const copyCanvas = (
  canvas: HTMLCanvasElement,
  canvasRef: React.RefObject<null>,
  callback?: ({ }: any) => void,
) => {
  if (!canvasRef.current) {
    console.log('copyCanvas(): no flood canvas');
    return;
  }

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  if (callback) {
    callback({ canvasWidth, canvasHeight });
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
  const { r: red1, g: green1, b: blue1 } = startingColor;
  const { r: red2, g: green2, b: blue2 } = nextColor;

  const dRed = red1 - red2;
  const dGreen = green1 - green2;
  const dBlue = blue1 - blue2;

  const squaredDistance = dRed * dRed + dGreen * dGreen + dBlue * dBlue;
  const distance = Math.sqrt(squaredDistance);

  return distance;
}

export const getPixelMatrix = (pixelsData: {
  r: number;
  g: number;
  b: number;
  a: number;
}[],
  width: number,
  height: number
) => {
  const colorMatrix = [];

  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      row.push(pixelsData[index]);
    }
    colorMatrix.push(row);
  }

  return colorMatrix;
}


export const fillCanvas = (canvas: HTMLCanvasElement, newPixels: any[][]) => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.height = newPixels.length;
  canvas.width = newPixels[0].length;

  for (let y = 0; y < newPixels.length; y++) {
    for (let x = 0; x < newPixels[0].length; x++) {
      const color = newPixels[y][x];

      if (color) {
        ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}
