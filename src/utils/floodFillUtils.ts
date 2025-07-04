import { getEuclieanDistance } from "./utils";

interface FloodImageParams {
  floodColor: {
    r: number;
    g: number;
    b: number;
  };
  startingPosition: {
    x_coord: number;
    y_coord: number;
  };
  floodCanvasRef: React.RefObject<null>;
  shouldAnimate: boolean;
  colorDistance: number;
}

interface StackArrayFloodParams {
  ctx: CanvasRenderingContext2D;
  startingColor: {
    r: number;
    g: number;
    b: number;
  };
  position: {
    x_coord: number;
    y_coord: number;
  };
  colorDistance: number;
}

interface RecursiveFloodParams {
  ctx: CanvasRenderingContext2D;
  startingColor: {
    r: number;
    g: number;
    b: number;
  };
  position: {
    x_coord: number;
    y_coord: number;
  };
  visited: Set<string>;
  path: { x_coord: number, y_coord: number }[];
  colorDistance: number;
}

interface ValidCoordParam {
  ctx: CanvasRenderingContext2D;
  new_x: number;
  new_y: number;
  startingColor: {
    r: number;
    g: number;
    b: number;
  };
  colorDistance: number;
}

export const floodImage = async ({
  floodColor,
  startingPosition,
  floodCanvasRef,
  shouldAnimate = false,
  colorDistance,
}: FloodImageParams) => {

  if (!floodCanvasRef.current) {
    console.log('floodImage(): no floodCanvasRef')
    return;
  }

  console.log(startingPosition);

  const floodCanvas = floodCanvasRef.current as HTMLCanvasElement;
  const ctx = floodCanvas.getContext('2d') as CanvasRenderingContext2D;
  const startingPositionData = ctx.getImageData(startingPosition.x_coord, startingPosition.y_coord, 1, 1);
  const [r, g, b] = startingPositionData.data
  const startingColor = { r, g, b };
  const path = getStackArrayFloodPath({
    ctx,
    startingColor,
    position: startingPosition,
    colorDistance,
  })

  if (shouldAnimate) {
    await animatedFloodPixels(ctx, path, floodColor);
  } else {
    floodImageFromPath(ctx, path, floodColor);
  }

}

const floodImageFromPath = (
  ctx: CanvasRenderingContext2D,
  path: {
    x_coord: number;
    y_coord: number;
  }[],
  floodColor: {
    r: number;
    g: number;
    b: number;
  }
) => {
  path.forEach((coord) => {
    colorIndividualPixel(ctx, coord, floodColor)
  });
}

const colorIndividualPixel = (
  ctx: CanvasRenderingContext2D,
  coord: {
    x_coord: number;
    y_coord: number;
  },
  floodColor: {
    r: number;
    g: number;
    b: number;
  }) => {
  const { r, g, b } = floodColor;
  const { x_coord, y_coord } = coord;
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(x_coord, y_coord, 1, 1);
}

const animatedFloodPixels = async (
  ctx: CanvasRenderingContext2D,
  path: {
    x_coord: number;
    y_coord: number;
  }[],
  floodColor: {
    r: number;
    g: number;
    b: number;
  },
  speed: number = 1,
) => {
  return new Promise<void>(resolve => {
    for (let i = 0; i < path.length; i += 1) {
      setTimeout(() => {
        colorIndividualPixel(ctx, path[i], floodColor);

        if (i === path.length - 1) {
          resolve();
        }
      }, (speed) * i);
    }
  })
}

const getStackArrayFloodPath = ({
  ctx,
  startingColor,
  position,
  colorDistance
}: StackArrayFloodParams) => {
  const path: { x_coord: number, y_coord: number }[] = [];
  const visited: Set<string> = new Set();

  const stack = [position];
  visited.add(`${position.x_coord}, ${position.y_coord}`);
  path.push(position);

  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  while (stack.length > 0) {
    const currentPosition = stack.pop() as { x_coord: number, y_coord: number };

    directions.forEach((dir) => {
      const new_x = currentPosition.x_coord + dir[0];
      const new_y = currentPosition.y_coord + dir[1];

      if (!visited.has(`${new_x}, ${new_y}`) &&
        validCoord({ ctx, new_x, new_y, startingColor, colorDistance })) {
        const newPosition = {
          x_coord: new_x,
          y_coord: new_y,
        }
        visited.add(`${new_x}, ${new_y}`);
        path.push(newPosition);
        stack.push(newPosition);
      }
    })
  }

  return path;
}

const recursiveFlood = ({
  ctx,
  startingColor,
  position,
  visited,
  path,
  colorDistance,
}: RecursiveFloodParams) => {
  visited.add(`${position.x_coord}, ${position.y_coord}`);
  path.push(position);

  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  directions.forEach((dir) => {
    const new_x = position.x_coord + dir[0];
    const new_y = position.y_coord + dir[1];

    if (!visited.has(`${new_x}, ${new_y}`) && validCoord({ ctx, new_x, new_y, startingColor, colorDistance })) {
      const newPosition = {
        x_coord: new_x,
        y_coord: new_y,
      }
      recursiveFlood({ ctx, startingColor, position: newPosition, visited, path, colorDistance })
    }
  })

  return path;
}

const validCoord = ({
  ctx,
  new_x,
  new_y,
  startingColor,
  colorDistance
}: ValidCoordParam) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  if (new_x < 0 || new_x >= width) return false;
  if (new_y < 0 || new_y >= height) return false;

  const imageData = ctx.getImageData(new_x, new_y, 1, 1);
  const [r, g, b] = imageData.data;

  if (!colorDistance) {
    if (startingColor.r !== r || startingColor.g !== g || startingColor.b !== b) return false;
  } else {
    const distance = getEuclieanDistance(startingColor, { r, g, b });
    return distance <= colorDistance;
  }

  return true;
}