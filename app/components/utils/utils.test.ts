import {
  getImageCoordinates,
  generatePrintDirectory,
  convertPixelsToInches,
  convertInchesToPixels,
  convertPrintDirToPixels,
  convertPrintDirToInches,
} from './utils';

import { DPI } from '../types';

describe('utils', () => {
  describe('getImageCoordinates', () => {
    describe('No initial offsetY - offset needs to be generated', () => {
      it('should return offsets for wide landscape image and centre x position with y offset', () => {
        // this is a wide image so has an x value
        expect(getImageCoordinates(750, 500, 1600, 901)).toStrictEqual({
          x: 124.25,
          y: 0,
          pw: 1351.5,
          ph: 901,
        });
      });
      it('should return offsets for short landscape image and fit the image to fill the canvas', () => {
        expect(getImageCoordinates(750, 500, 548, 377)).toStrictEqual({
          x: 0,
          y: 5.84,
          pw: 548,
          ph: 365.33,
        });
      });
      it('should return offsets for portrait image', () => {
        expect(getImageCoordinates(750, 500, 1200, 1600)).toStrictEqual({
          x: 0,
          y: 400,
          pw: 1200,
          ph: 800,
        });
      });
      it('should return offsets for portrait image to 2 decimal points', () => {
        expect(getImageCoordinates(750, 500, 901, 1600)).toStrictEqual({
          x: 0,
          y: 499.67,
          pw: 901,
          ph: 600.67,
        });
      });
    });
    describe('Offset X and Y is defined through user input', () => {
      it('should return offsets with the new X/Y offset - even if it is 0', () => {
        expect(getImageCoordinates(750, 500, 901, 1600, -200, 0)).toStrictEqual(
          {
            x: -200,
            y: 0,
            pw: 901,
            ph: 600.67,
          }
        );
      });
      it('should return offsets with the new X/Y offset', () => {
        expect(
          getImageCoordinates(750, 500, 901, 1600, 300, 100)
        ).toStrictEqual({
          x: 300,
          y: 100,
          pw: 901,
          ph: 600.67,
        });
      });
    });
  });
  describe('generatePrintDirectory', () => {
    it('should return offsets for wide landscape image and centre x position with y offset', () => {
      const expectedResult = {
        canvas: {
          width: 0,
          height: 0,
          photo: {
            id: 'string',
            src: 'base64-encoded-image',
            width: 1242,
            height: 1656,
            x: 0,
            y: 0,
          },
        },
      };
      expect(
        generatePrintDirectory({ width: 1242, height: 1656 }, 0, 0, 0, 0)
      ).toStrictEqual(expectedResult);
    });
  });

  describe('convertPixelsToInches', () => {
    it('converts pixels to inches correctly', () => {
      expect(convertPixelsToInches(750)).toBe(15);
      expect(convertPixelsToInches(500)).toBe(10);
    });
  });

  describe('convertInchesToPixels', () => {
    it('converts inches to pixelscorrectly', () => {
      expect(convertInchesToPixels(15)).toBe(750);
      expect(convertInchesToPixels(10)).toBe(500);
      expect(convertInchesToPixels(12)).toBe(600);
    });
  });

  describe('convertPrintDirToPixels', () => {
    const mockIn = {
      canvas: {
        width: 15,
        height: 10,
        photo: {
          id: 'string',
          src: 'base64-encoded-image',
          width: 24,
          height: 32,
          x: 0,
          y: 400,
        },
      },
    };
    const mockOut = {
      canvas: {
        width: 750,
        height: 500,
        photo: {
          id: 'string',
          src: 'base64-encoded-image',
          width: 1200,
          height: 1600,
          x: 0,
          y: 400,
        },
      },
    };

    it('converts some values to pixles', () => {
      expect(convertPrintDirToPixels(mockIn)).toStrictEqual(mockOut);
    });
  });

  describe('convertPrintDirToInches', () => {
    const mockOut = {
      canvas: {
        width: 15,
        height: 10,
        photo: {
          id: 'string',
          src: 'base64-encoded-image',
          width: 24,
          height: 32,
          x: 0,
          y: 400,
        },
      },
    };
    const mockIn = {
      canvas: {
        width: 750,
        height: 500,
        photo: {
          id: 'string',
          src: 'base64-encoded-image',
          width: 1200,
          height: 1600,
          x: 0,
          y: 400,
        },
      },
    };

    it('converts some values to pixles', () => {
      expect(convertPrintDirToInches(mockIn)).toStrictEqual(mockOut);
    });
  });
});
