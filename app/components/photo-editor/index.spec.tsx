import React from 'react';
import '@testing-library/jest-dom';

import 'jest-canvas-mock';
import {
  // getByRole,
  render,
  screen,
  //  act,
  waitFor,
  fireEvent,
} from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import { PhotoEditor } from './index';
// import matchers from '@testing-library/jest-dom/matchers';

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
      // TODO: There are no buttons at this stage
      // expect(screen.queryByText()).not.toBeInTheDocument();
    });
  });
  describe('image upload', () => {
    describe('user has no settings saved', () => {
      it(`shows the uploaded file in the canvas
        And user can see the settings box
        With the save print button`, async () => {
        const { container } = render(<PhotoEditor />);
        const file = new File(['my-image'], 'my-image.png', {
          type: 'image/png',
        });
        const fileInput = screen.getByLabelText(
          /upload image/i
        ) as HTMLInputElement;

        const readAsDataURL = jest.fn();
        const onLoad = jest.fn();
        Object.defineProperty(global, 'FileReader', {
          writable: true,
          value: jest.fn().mockImplementation(() => ({
            readAsDataURL,
            onLoad,
          })),
        });
        //  userEvent.upload(fileInput as HTMLElement, file); // Not working
        fireEvent.change(fileInput, { target: { files: [file] } });
        await waitFor(() => expect(readAsDataURL).toHaveBeenCalledTimes(1));
        expect(readAsDataURL).toHaveBeenCalledWith(file);
        // expect(onload).toHaveBeenCalledTimes(1); // Not working
        expect(fileInput?.files?.[0]?.name).toStrictEqual('my-image.png');
        expect(fileInput?.files?.length).toBe(1);
        // screen.logTestingPlaygroundURL(); // FOR TESTING THE UI
        // const myComponent = screen.getByRole('blah'); // FOR TESTING THE UI
        // TODO: this is stil not working
        // TODO: User can see the settings and buttons
        // TODO: User cannot see the import button
        // expect(container.getElementsByClassName('subHeading').length).toBe(1);
        // await waitFor(() =>
        //   expect(container.getElementsByClassName('subHeading').length).toBe(1)
        // );
      });
      it('places the image on the canvas to fill the screen and centres horizontally', async () => {
        // TODO
      });
      it('user can move image on canvas on x and y axis', () => {
        // TODO
      });
      it('user can save print settings', () => {
        // TODO
      });
    });
    describe('user has settings saved', () => {
      it(`user can see the import settings button and print settings copy
          After uploading image`, () => {
        // TODO
        // 1: upload image
        // user can see the button and settings
      });
      it('user applies the print settings to the image', () => {
        // TODO: image moves on the canvas according to settings
      });
      it('should render preview after image has been selected', async () => {
        // TODO:
      });
      it('user can continue to adjust the image', () => {
        // TODO: user moves the image up/down or left/rht
      });
      it('user can save the print settings again and override the original settings', () => {
        // TODO:
      });
    });
  });
});
