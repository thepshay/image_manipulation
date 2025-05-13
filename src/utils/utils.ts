interface FloodImageParams {
  floodColor: {
    red: number;
    green: number;
    blue: number;
  };
  startingPosition: {
    x_coord: number;
    y_coord: number;
  };
  floodCanvasRef: React.RefObject<null>;
  shouldAnimate: boolean;
}

interface StackArrayFloodParams {
  ctx: CanvasRenderingContext2D;
  startingColor: {
    red: number;
    green: number;
    blue: number;
  };
  position: {
    x_coord: number;
    y_coord: number;
  };
}

interface RecursiveFloodParams {
  ctx: CanvasRenderingContext2D;
  startingColor: {
    red: number;
    green: number;
    blue: number;
  };
  position: {
    x_coord: number;
    y_coord: number;
  };
  visited: Set<string>;
  path: { x_coord: number, y_coord: number }[];
}

interface ValidCoordParam {
  ctx: CanvasRenderingContext2D;
  new_x: number;
  new_y: number;
  startingColor: {
    red: number;
    green: number;
    blue: number;
  }
}

export const floodImage = async ({
  floodColor,
  startingPosition,
  floodCanvasRef,
  shouldAnimate=false,
}: FloodImageParams) => {

  if (!floodCanvasRef.current) {
    console.log('floodImage(): no floodCanvasRef')
    return;
  }

  console.log(startingPosition);

  const floodCanvas = floodCanvasRef.current as HTMLCanvasElement;
  const ctx = floodCanvas.getContext('2d') as CanvasRenderingContext2D;
  const startingPositionData = ctx.getImageData(startingPosition.x_coord, startingPosition.y_coord, 1, 1);
  const [red, green, blue] = startingPositionData.data
  const startingColor = { red, green, blue };
  const path = getStackArrayFloodPath({ ctx, startingColor, position: startingPosition })

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
    red: number;
    green: number;
    blue: number;
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
    red: number;
    green: number;
    blue: number;
  }) => {
  const { red, green, blue } = floodColor;
  const { x_coord, y_coord } = coord;
  ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
  ctx.fillRect(x_coord, y_coord, 1, 1);
}

const animatedFloodPixels = async (
  ctx: CanvasRenderingContext2D,
  path: {
    x_coord: number;
    y_coord: number;
  }[],
  floodColor: {
    red: number;
    green: number;
    blue: number;
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

// async function fillPathAsync(ctx, path, floodColor, speed) {
//   return new Promise((resolve) => {
//     for (let i = 0; i < path.length; i += 1) {
//       if (i === path.length - 1) {
//         // For the last pixel, resolve the promise after it's colored
//         setTimeout(() => {
//           colorIndividualPixel(ctx, path[i], floodColor);
//           resolve(); // Signal that all pixels have been colored
//         }, speed * i);
//       } else {
//         // For all other pixels, just color them
//         setTimeout(() => {
//           colorIndividualPixel(ctx, path[i], floodColor);
//         }, speed * i);
//       }
//     }

//     // If the path is empty, resolve immediately
//     if (path.length === 0) {
//       resolve();
//     }
//   });
// }


const getStackArrayFloodPath = ({
  ctx,
  startingColor,
  position
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

      if (!visited.has(`${new_x}, ${new_y}`) && validCoord({ ctx, new_x, new_y, startingColor })) {
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
  path
}: RecursiveFloodParams) => {
  visited.add(`${position.x_coord}, ${position.y_coord}`);
  path.push(position);

  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  directions.forEach((dir) => {
    const new_x = position.x_coord + dir[0];
    const new_y = position.y_coord + dir[1];

    if (!visited.has(`${new_x}, ${new_y}`) && validCoord({ ctx, new_x, new_y, startingColor })) {
      const newPosition = {
        x_coord: new_x,
        y_coord: new_y,
      }
      recursiveFlood({ ctx, startingColor, position: newPosition, visited, path })
    }
  })

  return path;
}

const validCoord = ({
  ctx,
  new_x,
  new_y,
  startingColor,
}: ValidCoordParam) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  if (new_x < 0 || new_x >= width) return false;
  if (new_y < 0 || new_y >= height) return false;

  const imageData = ctx.getImageData(new_x, new_y, 1, 1);
  const [red, green, blue] = imageData.data;

  if (startingColor.red !== red || startingColor.green !== green || startingColor.blue !== blue) return false;

  return true;
}
