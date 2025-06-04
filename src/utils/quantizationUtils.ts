const RED = 0;
const GREEN = 1;
const BLUE = 2;

export const medianCut = (pixelBucket: number[][], power: number) => {
  const cutBuckets = calculateMedianCut(pixelBucket, power);
  const partitionedColors: number[][] = [];

  cutBuckets.forEach(bucket => {
    partitionedColors.push(getAverageColor(bucket));
  });

  console.log(partitionedColors);

  return partitionedColors;
}

export const calculateMedianCut = (pixelBucket: number[][], power: number): number[][][] => {
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

const getGreatestRangeColor = (pixelBuck: number[][]) => {
  const redRange = getRange(pixelBuck, 0);
  const greenRange = getRange(pixelBuck, 1);
  const blueRange = getRange(pixelBuck, 2);

  if (redRange >= greenRange && redRange >= blueRange) {
    return RED;
  } else if (greenRange >= redRange && greenRange >= blueRange) {
    return GREEN;
  } else {
    return BLUE;
  }
}

const getRange = (pixelBuck: number[][], idx: number) => {
  let min = 255;
  let max = 0;

  pixelBuck.forEach(pixel => {
    const colorVal = pixel[idx];

    if (colorVal < min) {
      min = colorVal;
    }

    if (colorVal > max) {
      max = colorVal
    }
  });

  return max - min;
}

const getAverageColor = (pixels: number[][]) => {
  let redSum = 0;
  let greenSum = 0;
  let blueSum = 0;
  const length = pixels.length;

  pixels.forEach((pixel) => {
    redSum += pixel[0];
    greenSum += pixel[1];
    blueSum += pixel[2];
  });

  const redAvg = Math.ceil(redSum / length);
  const greenAvg = Math.ceil(greenSum / length);
  const blueAvg = Math.ceil(blueSum / length);

  return [redAvg, greenAvg, blueAvg];
}