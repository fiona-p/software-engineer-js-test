// cssunitconverter.com/inches-to-pixels/
// 1500 x 1000 at 100 PPI
// 750 x 500 at 50 PPI
// NOTE: at 300dpi the canvas is too large for the page
export enum CanvasSize {
  width = 750,
  height = 500,
}

export type DimensionsOutput = {
  y: number;
  x: number;
  pw: number;
  ph: number;
};

export type ImageDimensions = {
  width: number;
  height: number;
};

type Canvas = {
  width: number;
  height: number;
  photo: Photo;
};

type Photo = {
  id: string;
  src: string;
  width: number;
  height: number;
  x: number | undefined;
  y: number | undefined;
};

export type PrintDirectory = {
  canvas: Canvas;
};

export const DPI = 50;
