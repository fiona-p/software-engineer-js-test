import {
  DimensionsOutput,
  ImageDimensions,
  PrintDirectory,
  DPI,
} from '../types';

export const getImageCoordinates = (
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
  newOffsetX?: number | undefined,
  newOffsetY?: number | undefined
): DimensionsOutput => {
  let containerRatio = canvasHeight / canvasWidth;
  let width = imageWidth;
  let height = imageHeight;
  let imgRatio = height / width;

  if (imgRatio > containerRatio) {
    // portrait image
    height = Number((width * containerRatio).toFixed(2));
  } else {
    // image is wider than canvas so we clip width and re-centre
    width = Number((height / containerRatio).toFixed(2));
  }
  let offsetY;
  let offsetX;
  if (newOffsetY || newOffsetY === 0) {
    offsetY = newOffsetY;
  } else {
    offsetY = Number(((imageHeight - height) * 0.5).toFixed(2));
  }

  if (newOffsetX || newOffsetX === 0) {
    offsetX = newOffsetX;
  } else {
    offsetX = Number(((imageWidth - width) * 0.5).toFixed(2));
  }

  return {
    x: offsetX,
    y: offsetY,
    pw: width,
    ph: height,
  };
};

export const generateImage = (
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number,
  newOffsetX?: number | undefined,
  newOffsetY?: number | undefined
): void => {
  const getOffsets = getImageCoordinates(
    canvasWidth,
    canvasHeight,
    imageWidth,
    imageHeight,
    newOffsetX,
    newOffsetY
  );

  ctx.drawImage(
    img,
    getOffsets?.x,
    getOffsets?.y,
    getOffsets?.pw,
    getOffsets?.ph,
    0,
    0,
    canvasWidth,
    canvasHeight
  );
};

export const convertPixelsToInches = (pixels: number): number => {
  // This works on https://www.omnicalculator.com
  return pixels / DPI;
};

export const convertInchesToPixels = (inches: number): number => {
  // 1 inch equals to 96 pixels
  return inches * DPI;
};

export const generatePrintDirectory = (
  imageDimensions: ImageDimensions,
  canvasHeight: number,
  canvasWidth: number,
  offsetX: number | undefined,
  offsetY: number | undefined
): PrintDirectory => {
  const draft = {
    canvas: {
      width: canvasWidth,
      height: canvasHeight,
      photo: {
        id: 'string',
        src: 'base64-encoded-image',
        width: imageDimensions?.width,
        height: imageDimensions?.height,
        x: offsetX,
        y: offsetY,
      },
    },
  };
  return draft;
};

export const convertPrintDirToInches = (
  directory: PrintDirectory | null
): PrintDirectory | null => {
  if (!directory) return null;
  return {
    ...directory,
    canvas: {
      ...directory.canvas,
      width: convertPixelsToInches(directory.canvas.width),
      height: convertPixelsToInches(directory.canvas.height),
      photo: {
        ...directory.canvas.photo,
        width: convertPixelsToInches(directory.canvas.photo.width),
        height: convertPixelsToInches(directory.canvas.photo.height),
      },
    },
  };
};

export const convertPrintDirToPixels = (
  directory: PrintDirectory | null
): PrintDirectory | null => {
  if (!directory) return null;
  return {
    ...directory,
    canvas: {
      ...directory.canvas,
      width: convertInchesToPixels(directory.canvas.width),
      height: convertInchesToPixels(directory.canvas.height),
      photo: {
        ...directory.canvas.photo,
        width: convertInchesToPixels(directory.canvas.photo.width),
        height: convertInchesToPixels(directory.canvas.photo.height),
      },
    },
  };
};

export const getStorageValue = (key: string) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    const initial = saved !== null ? JSON.parse(saved) : null;
    return initial;
  }
};
