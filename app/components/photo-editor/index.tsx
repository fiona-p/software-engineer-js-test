import React, { ChangeEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '../button';
import { Header } from '../header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpDown, faRightLeft } from '@fortawesome/free-solid-svg-icons';

import {
  generatePrintDirectory,
  getImageCoordinates,
  getStorageValue,
  generateImage,
  convertPrintDirToInches,
  convertPrintDirToPixels,
} from '../utils/utils';
import { CanvasSize, PrintDirectory } from '../types';

export const PhotoEditor = (): JSX.Element => {
  const [image, setImage] = useState<HTMLImageElement>();
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [offsetY, setOffsetY] = useState<number | undefined>(undefined);
  const [offsetX, setOffsetX] = useState<number | undefined>(undefined);
  const [savedOffsetX, setSavedOffsetX] = useState<number | undefined>(
    undefined
  );
  const [savedOffsetY, setSavedOffsetY] = useState<number | undefined>(
    undefined
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [printDirections, setPrintDirectory] = useState<PrintDirectory | null>(
    null
  );
  const [inputYMaxMin, setinputYMaxMin] = useState(0);
  const [inputXMaxMin, setinputXMaxMin] = useState(0);
  const hasOffsetY = offsetY || offsetY === 0;
  const hasSavedOffsetY = savedOffsetY || savedOffsetY === 0;
  const hasImageOnCanvas = !!image;
  const printSettingsCopy = `saved print settings: x: ${savedOffsetX} | y:${savedOffsetY} `;
  console.log('hasImageOnCanvas', hasImageOnCanvas);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const width = CanvasSize.width;
      const height = CanvasSize.height;
      // storedPrintDescripion will be in inches so we need to convert back as Canvas works in pixels
      const storedPrintDescripion = getStorageValue('print settings');
      const storedPrintDescripionInPixels = convertPrintDirToPixels(
        storedPrintDescripion
      );
      // If user has already saved print description -> save these settings to the state
      if (storedPrintDescripion) {
        setSavedOffsetX(storedPrintDescripionInPixels?.canvas.photo?.x);
        setSavedOffsetY(storedPrintDescripionInPixels?.canvas.photo?.y);
      }
      if (ctx) {
        ctx.rect(0, 0, width, height);
        ctx.fill();

        if (image) {
          const imageHeight = image.naturalHeight;
          const imageWidth = image.naturalWidth;
          setImageDimensions({
            ...imageDimensions,
            width: imageWidth,
            height: imageHeight,
          });

          generateImage(
            ctx,
            image,
            width,
            height,
            imageWidth,
            imageHeight,
            offsetX,
            offsetY
          );
        }
      }
    }
  }, [image, offsetY, offsetX]);

  const onHandleGeneratePrintDescription = () => {
    const printDraft = generatePrintDirectory(
      imageDimensions,
      CanvasSize.height,
      CanvasSize.width,
      offsetX,
      offsetY
    );

    // convert some values to inches for print to save
    const printDraftInInches = convertPrintDirToInches(printDraft);
    setPrintDirectory(printDraftInInches);
    // TODO: Writes to JSON file
    // Set to local storage for now
    // TODO/NTH: Let user name print settings so user does not override and can select from a list of settings
    localStorage.setItem('print settings', JSON.stringify(printDraftInInches));
    setSavedOffsetX(offsetX);
    setSavedOffsetY(offsetY);
  };

  const onHandleImportPrintDescription = () => {
    // update the current x/y offsets with the imported offsets
    setOffsetY(savedOffsetY);
    setOffsetX(savedOffsetX);
  };

  const onHandelClearStorage = () => {
    localStorage.clear();
    setSavedOffsetX(undefined);
    setSavedOffsetY(undefined);
  };

  const onYoffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = !Number.isNaN(e.target.valueAsNumber)
      ? e.target.valueAsNumber
      : undefined;
    console.log('Y UPDATED', value);
    setOffsetY(value);
  };

  const onXoffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = !Number.isNaN(e.target.valueAsNumber)
      ? e.target.valueAsNumber
      : undefined;
    setOffsetX(value);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e?.target?.files?.length) {
      return;
    }

    const file = e.target.files?.[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        setImage(img);
        // Work out initial offsets (position) for uploaded image
        const getInitialOffsetValueFromImage = getImageCoordinates(
          CanvasSize.width,
          CanvasSize.height,
          img.naturalWidth,
          img.naturalHeight
        );

        // Set min/max to stop the user moving the image out of the canvas
        setinputYMaxMin(getInitialOffsetValueFromImage.y);
        setinputXMaxMin(getInitialOffsetValueFromImage.x);

        // Set the initial offset values to position the image correctly on page
        setOffsetY(getInitialOffsetValueFromImage.y);
        setOffsetX(getInitialOffsetValueFromImage.x);
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Header
        handlePhotoUpload={handlePhotoUpload}
        hasImage={hasImageOnCanvas}
        hasSavedOffsetY={hasSavedOffsetY}
        onHandleImportPrintDescription={onHandleImportPrintDescription}
        printSettingsCopy={printSettingsCopy}
      />
      <canvas
        ref={canvasRef}
        id='myCanvas'
        width={CanvasSize.width}
        height={CanvasSize.height}
        data-testid='canvas-element'
      >
        Your browser doesn't support canvas
      </canvas>
      {/* TODO/NTH: pull this out into separate compoennt */}
      {hasOffsetY && image && (
        <div className='settingsSection'>
          <div className='inputContainer'>
            <span className='inputLabelHeading'>Position Image</span>
            <input
              type='number'
              min='-20' // this should be 0 but I like showing the user the blank space?
              max={inputXMaxMin * 2 + 20}
              value={offsetX ?? ''}
              step='10'
              disabled={!image}
              onChange={onXoffsetChange}
              className='offsetInput'
            />
            <label htmlFor='offset' className='inputLabel'>
              <FontAwesomeIcon icon={faRightLeft} />
            </label>
            <input
              type='number'
              min='-20' // this should be 0 but I like showing the user the blank space?
              max={inputYMaxMin * 2 + 20}
              value={offsetY ?? ''}
              step='10'
              disabled={!image}
              onChange={onYoffsetChange}
              className='offsetInput spacing'
            />
            <label htmlFor='offset' className='inputLabel'>
              <FontAwesomeIcon icon={faUpDown} className='iconPosition' />
            </label>
          </div>
          <div>
            <Button buttonType={0} onClick={onHandleGeneratePrintDescription}>
              Save print settings
            </Button>
            <Button
              buttonType={1}
              onClick={onHandelClearStorage}
              customClass='buttonLeftMargin'
            >
              Clear print settings
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
