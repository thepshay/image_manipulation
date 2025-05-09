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
  floodCanvasRef: React.RefObject<null>
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

export const floodImage = ({
  floodColor,
  startingPosition,
  floodCanvasRef
}: FloodImageParams) => {

  if (!floodCanvasRef.current) {
    console.log('floodImage(): no floodCanvasRef')
    return;
  }

  // return a list of coordinates to flood

  const floodCanvas = floodCanvasRef.current as HTMLCanvasElement;
  const ctx = floodCanvas.getContext('2d') as CanvasRenderingContext2D;

  //TODO: reduntant getImageData() -> 
  //https://stackoverflow.com/questions/7812514/drawing-a-dot-on-html5-canvas
  const startingPositionData = ctx.getImageData(startingPosition.x_coord, startingPosition.y_coord, 1, 1);
  const [red, green, blue] = startingPositionData.data
  const startingColor = { red, green, blue };
  const path = stackArrayFlood({ ctx, startingColor, position: startingPosition })

  // stack overflow :(
  // const path: { x_coord: number, y_coord: number }[] = [];
  // const visited: Set<string> = new Set();
  // recursiveFlood({ ctx, startingColor, position: startingPosition, visited, path });

  console.log(path)

  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  const imageData = ctx.getImageData(startingPosition.x_coord, startingPosition.y_coord, width, height);

  path.forEach((coord) => {
    const { x_coord, y_coord } = coord;
    // drawPixel({imageData, x_coord, y_coord, width, red: 255, green: 0, blue: 0})
    const index = (x_coord + y_coord * width) * 4;

    imageData.data[index + 0] = 255;
    imageData.data[index + 1] = 0;
    imageData.data[index + 2] = 0;
    imageData.data[index + 3] = 255;
  });

  ctx.putImageData(imageData, 0, 0);

  console.log('updated')
}

//TODO: add types
const drawPixel = ({ imageData, x_coord, y_coord, canvasWidth, red, green, blue }: any) => {
  const index = (x_coord + y_coord * canvasWidth) * 4;

  imageData.data[index + 0] = red;
  imageData.data[index + 1] = green;
  imageData.data[index + 2] = blue;
}

const stackArrayFlood = ({
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

// recursiveFlood
// params: startingColor, coordSet, path = []

// check if coords are valid
//  - x and y are inside image
//  - color at x,y is the same as starting color -->> 
// check if coord has been visited
// add coord to the set
// push coord int opath
// loop through direction 4 or 8? 
// set new coords
// recuriveFlood -> new coord
// return path
