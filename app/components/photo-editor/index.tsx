import React, { ChangeEvent } from 'react';
import { useState, useEffect, useRef } from 'react';

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
  const printSettingsCopy = `Print settings: x: ${savedOffsetX} | y:${savedOffsetY} `;

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Need a fixed canvas size image on the page
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
    // TODO: Writes to JSON file
    // ISSUE: we cannot write the file in the browser. Needs to happen server side?
    // setPrintDirectory(printDraft);
    setPrintDirectory(printDraftInInches);
    // Set to local storage for now
    // TODO: Need a dynamic name that the user can save
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
    // const files = e.target.files as FileList;
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

        // this wil stop the user moving the image out of the canvas
        // but it will cause issues if the use imports settings for a much different sized image
        // so I need to decide if I want this funcitonality
        // we could update this with the imported settings? TODO? But is this the best UX?
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
      <header className='heading'>
        <h1>Photo Editor</h1>
        <div className='inputContainer'>
          <label htmlFor='fileSelector'>Upload Image</label>
          <input
            type='file'
            id='fileSelector'
            onChange={handlePhotoUpload}
            className='fileInput'
            accept='.jpg, .jpeg, .png, .gif'
          />
        </div>
        {image && (
          <div className='subHeading'>
            {hasSavedOffsetY && (
              <>
                <button
                  className='buttonCommon'
                  onClick={onHandleImportPrintDescription}
                >
                  Import print settings
                </button>
                <p className='settingsCopy'>{printSettingsCopy}</p>
              </>
            )}
          </div>
        )}
      </header>
      <canvas
        ref={canvasRef}
        id='myCanvas'
        width={CanvasSize.width}
        height={CanvasSize.height}
        data-testid='canvas-element'
      >
        Your browser doesn't support canvas
      </canvas>

      {hasOffsetY && image && (
        <div className='settingsSection'>
          <div className='inputContainer'>
            {/* TODO/NTH: Have icon here instead of text */}
            <label htmlFor='quantity' className='inputHorizontalLabel'>
              up/down
            </label>
            <input
              type='number'
              min='-20' // this should always be 0 or maybe -10
              max={inputYMaxMin * 2 + 20}
              value={offsetY ?? ''}
              step='10'
              disabled={!image}
              onChange={onYoffsetChange}
              className='offsetYInput'
            />
            <label htmlFor='quantity' className='inputHorizontalLabel spacing'>
              left/rgt
            </label>
            <input
              type='number'
              min='-20' //
              max={inputXMaxMin * 2 + 20} // Refine?
              value={offsetX ?? ''}
              step='10'
              disabled={!image}
              onChange={onXoffsetChange}
              className='offsetYInput'
            />
          </div>
          {/* TODO/NTH: move buttons and small section into re-usable component */}
          <div>
            <button
              className='buttonCommon'
              onClick={onHandleGeneratePrintDescription}
            >
              Save print settings
            </button>
            <button
              className='buttonCommon buttonClear'
              onClick={onHandelClearStorage}
            >
              Clear print settings
            </button>
          </div>
        </div>
      )}
    </>
  );
};
