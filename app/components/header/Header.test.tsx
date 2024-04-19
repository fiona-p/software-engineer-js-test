import React from 'react';
import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

describe('<Header />', () => {
  const defaultProps = {
    printSettingsCopy: 'saved settings',
    handlePhotoUpload: jest.fn(),
    onHandleImportPrintDescription: jest.fn(),
  };

  describe('user has no saved settings', () => {
    it(`renders with title and upload input
        But no import print settings button or info
        When there is an image present`, () => {
      const props = {
        ...defaultProps,
        hasSavedOffsetY: false,
        hasImage: false,
      };
      render(<Header {...props}>Test</Header>);

      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: /import print settings/i,
        })
      ).not.toBeInTheDocument();
    });

    it(`renders with title and upload input
        But no import print settings button or info
        When there is an image presentt`, () => {
      const props = {
        ...defaultProps,
        hasSavedOffsetY: false,
        hasImage: true,
      };
      render(<Header {...props}>Test</Header>);

      expect(screen.getByRole('heading')).toBeInTheDocument();
      expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: /import print settings/i,
        })
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/saved settings/i)).not.toBeInTheDocument();
    });
  });

  describe('user has saved settings', () => {
    it(`renders import print settings button and info
        When image is present`, () => {
      const props = {
        ...defaultProps,
        hasImage: true,
        hasSavedOffsetY: true,
      };
      render(<Header {...props}>Test</Header>);

      const importButton = screen.getByRole('button', {
        name: /import print settings/i,
      });
      const settingsCopy = screen.getByText(/saved settings/i);
      expect(importButton).toBeInTheDocument();
      expect(settingsCopy).toBeInTheDocument();
    });

    it(`does not render import print settings button or info
        When there is no image present`, () => {
      const props = {
        ...defaultProps,
        hasImage: false,
        hasSavedOffsetY: true,
      };
      render(<Header {...props}>Test</Header>);

      expect(
        screen.queryByRole('button', {
          name: /import printsettings/i,
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(/print saved settings/i)
      ).not.toBeInTheDocument();
    });
  });

  describe('photo upload', () => {
    it('calls the upload handler', () => {
      const props = {
        ...defaultProps,
        hasImage: false,
        hasSavedOffsetY: false,
      };
      render(<Header {...props}>Test</Header>);
      const file = new File(['pic'], 'pic.jpg', {
        type: 'image/jpeg',
      });
      const input = screen.getByLabelText(/upload image/i);

      fireEvent.change(input, { target: { files: [file] } });
      expect(props.handlePhotoUpload).toHaveBeenCalledTimes(1);
    });
  });
});
