import { getEuclieanDistance } from "./utils";

export const medianCut = (
  pixelBucket: { r: number, g: number, b: number, a: number }[],
  power: number
) => {
  const cutBuckets = calculateMedianCut(pixelBucket, power);
  const partitionedColors: { r: number, g: number, b: number }[] = [];

  cutBuckets.forEach(bucket => {
    partitionedColors.push(getAverageColor(bucket));
  });

  return partitionedColors;
}

export const calculateMedianCut = (
  pixelBucket: { r: number, g: number, b: number, a: number }[], power: number
): { r: number, g: number, b: number, a: number }[][] => {
  // TOOD: edge case if pixelBucket is empty/1(?)
  if (power === 0) return [pixelBucket];

  const colorIdx = getGreatestRangeColor(pixelBucket);
  const sortedBucket = pixelBucket.sort((a, b) => a[colorIdx] - b[colorIdx]);

  const mid = Math.ceil(sortedBucket.length / 2);
  const bucket1 = sortedBucket.slice(0, mid);
  const bucket2 = sortedBucket.slice(mid);

  const cutBucket1 = calculateMedianCut(bucket1, power - 1);
  const cutBucket2 = calculateMedianCut(bucket2, power - 1);

  return [...cutBucket1, ...cutBucket2];
}

const getGreatestRangeColor = (pixelBucket: { r: number, g: number, b: number, a: number }[]) => {
  const redRange = getRange(pixelBucket, "r");
  const greenRange = getRange(pixelBucket, "g");
  const blueRange = getRange(pixelBucket, "b");

  if (redRange >= greenRange && redRange >= blueRange) {
    return "r";
  } else if (greenRange >= redRange && greenRange >= blueRange) {
    return "g";
  } else {
    return "b";
  }
}

const getRange = (pixelBucket: { r: number, g: number, b: number, a: number }[], colorField: "r" | "g" | "b" | "a") => {
  let min = 255;
  let max = 0;

  pixelBucket.forEach(pixel => {
    const colorVal = pixel[colorField];

    if (colorVal < min) {
      min = colorVal;
    }

    if (colorVal > max) {
      max = colorVal
    }
  });

  return max - min;
}

const getAverageColor = (pixels: { r: number, g: number, b: number }[]) => {
  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;
  const length = pixels.length;

  pixels.forEach((pixel) => {
    redSum += pixel.r;
    greenSum += pixel.g;
    blueSum += pixel.b;
  });

  const redAvg = Math.ceil(redSum / length);
  const greenAvg = Math.ceil(greenSum / length);
  const blueAvg = Math.ceil(blueSum / length);

  return { r: redAvg, g: greenAvg, b: blueAvg };
}

export const getDistanceMappingPixels = (
  pixelsData: {
    r: number, g: number, b: number, a: number
  }[][],
  quantizedColors: {
    r: number, g: number, b: number
  }[],
) => {
  const distanceMappingPixels = [];

  for (let row = 0; row < pixelsData.length; row++) {
    const newRow = [];

    for (let col = 0; col < pixelsData[0].length; col++) {
      let minDistance = 1e99;
      let nextColor = { r: 0, g: 0, b: 0 };
      const currColor = pixelsData[row][col];

      if (currColor.a === 0) {
        newRow.push(currColor);
      } else {
        for (let i = 0; i < quantizedColors.length; i++) {
          const distance = getEuclieanDistance(currColor, quantizedColors[i]);

          if (distance < minDistance) {
            minDistance = distance;
            nextColor = quantizedColors[i];
          }
        }

        newRow.push({ ...nextColor, a: 255 })
      }

    }

    distanceMappingPixels.push(newRow);
  }

  return distanceMappingPixels;
}
