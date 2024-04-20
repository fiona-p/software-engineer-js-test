import React from 'react';
import { render, screen } from '@testing-library/react';
import { fireEvent, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import '@testing-library/jest-dom';
import Settings from './Settings';

describe('<Settings />', () => {
  const defaultProps = {
    hasImage: true,
    inputXMax: 0,
    inputYMax: 0,
    offsetX: 0,
    offsetY: 0,
    onHandleGeneratePrintDescription: jest.fn(),
    onHandleClearStorage: jest.fn(),
    onXoffsetChange: jest.fn(),
    onYoffsetChange: jest.fn(),
  };

  describe('default state', () => {
    it(`renders with 2 inputs and 2 buttons`, () => {
      render(<Settings {...defaultProps} />);

      const numberXInput = screen.getByRole('spinbutton', { name: /offsetx/i });
      const numberYInput = screen.getByRole('spinbutton', { name: /offsety/i });
      const importButton = screen.getByRole('button', {
        name: /save print settings/i,
      });
      const clearSettingsButton = screen.getByRole('button', {
        name: /clear print settings/i,
      });

      expect(numberXInput).toBeInTheDocument();
      expect(numberYInput).toBeInTheDocument();
      expect(importButton).toBeInTheDocument();
      expect(clearSettingsButton).toBeInTheDocument();
      expect(numberXInput).toHaveValue(0);
      expect(numberXInput).toHaveValue(0);
    });
  });

  describe('input', () => {
    it(`renders input values with the image offset values`, () => {
      const props = {
        ...defaultProps,
        offsetX: 10,
        offsetY: 400,
      };
      render(<Settings {...props} />);
      const numberXInput = screen.getByRole('spinbutton', {
        name: /offsetx/i,
      });
      const numberYInput = screen.getByRole('spinbutton', {
        name: /offsety/i,
      });
      expect(numberXInput).toHaveValue(10);
      expect(numberYInput).toHaveValue(400);
    });

    it(`calls the offset handlers`, async () => {
      const props = {
        ...defaultProps,
        offsetX: 0,
        offsetY: 559,
        inputXMax: 0,
        inputYMax: 559,
      };

      render(<Settings {...props} />);
      const numberXInput = screen.getByRole('spinbutton', {
        name: /offsetx/i,
      }) as HTMLInputElement;
      const numberYInput = screen.getByRole('spinbutton', {
        name: /offsety/i,
      }) as HTMLInputElement;
      numberYInput.focus();

      fireEvent.change(numberYInput, { target: { value: '400' } });
      expect(props.onYoffsetChange).toHaveBeenCalledTimes(1);

      fireEvent.change(numberXInput, { target: { value: '400' } });
      expect(props.onXoffsetChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('buttons', () => {
    it(`calls the print settings function`, async () => {
      render(<Settings {...defaultProps} />);

      const importButton = screen.getByRole('button', {
        name: /save print settings/i,
      });

      fireEvent.click(importButton);
      expect(
        defaultProps.onHandleGeneratePrintDescription
      ).toHaveBeenCalledTimes(1);
    });

    it(`calls the clear settings function`, async () => {
      render(<Settings {...defaultProps} />);

      const clearSettingsButton = screen.getByRole('button', {
        name: /clear print settings/i,
      });

      fireEvent.click(clearSettingsButton);
      expect(defaultProps.onHandleClearStorage).toHaveBeenCalledTimes(1);
    });
  });
});
