import React from 'react';
import '@testing-library/jest-dom';

import 'jest-canvas-mock';
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { PhotoEditor } from './index';

describe('PhotoEditor', () => {
  describe('renders default state', () => {
    it(`renders with fixed (width and height) canvas with heading 
        And input button
        But no settings are shown`, () => {
      render(<PhotoEditor />);

      const heading = screen.getByRole('heading');
      const input = screen.getByLabelText(/upload image/i);
      const canvas = screen.getByTestId('canvas-element');

      expect(heading).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(canvas).toBeInTheDocument();
      expect(canvas.getAttribute('height')).toBe('500');
      expect(canvas.getAttribute('width')).toBe('750');
      expect(screen.queryByTestId('settings')).toBeNull();
    });
  });

  describe('image upload', () => {
    it(`selects a file with FileReader`, async () => {
      const file = new File(['my-image'], 'my-image', {
        type: 'image/jpeg',
      });
      const readAsDataURL = jest.fn();
      Object.defineProperty(global, 'FileReader', {
        writable: true,
        value: jest.fn().mockImplementation(() => ({
          readAsDataURL,
        })),
      });

      render(<PhotoEditor />);
      const fileInput = screen.getByLabelText(
        /upload image/i
      ) as HTMLInputElement;

      Object.defineProperty(fileInput, 'files', {
        value: [file],
      });

      fireEvent.change(fileInput);

      await waitFor(() => expect(readAsDataURL).toHaveBeenCalledTimes(1));
      expect(readAsDataURL).toHaveBeenCalledWith(file);
      expect(fileInput?.files?.[0]?.name).toStrictEqual('my-image');
      expect(fileInput?.files?.length).toBe(1);
    });
  });
});
