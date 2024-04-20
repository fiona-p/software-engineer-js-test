import React from 'react';
import { Button } from '../button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpDown } from '@fortawesome/free-solid-svg-icons';

type SettingProps = {
  hasImage: boolean;
  inputXMax: number;
  inputYMax: number;
  offsetX: number | undefined;
  offsetY: number | undefined;
  onHandleGeneratePrintDescription: () => void;
  onHandleClearStorage: () => void;
  onXoffsetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onYoffsetChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Settings = ({
  hasImage,
  inputXMax,
  inputYMax,
  offsetX,
  offsetY,
  onHandleGeneratePrintDescription,
  onHandleClearStorage,
  onXoffsetChange,
  onYoffsetChange,
}: SettingProps) => {
  return (
    <div className='settingsSection' data-testid='settings'>
      <div className='inputContainer'>
        <span className='inputLabelHeading'>Position Image</span>
        <label htmlFor='offsetX' className='inputLabel' aria-label='offsetX'>
          x:
        </label>
        <input
          type='number'
          min='0'
          max={inputXMax * 2}
          value={offsetX ?? ''}
          step='10'
          disabled={!hasImage}
          onChange={onXoffsetChange}
          className='offsetInput'
          id='offsetX'
        />
        <FontAwesomeIcon icon={faUpDown} className='icon' />
        <label
          htmlFor='offsetY'
          className='inputLabel spacing'
          aria-label='offsetY'
        >
          y:
        </label>
        <input
          type='number'
          min='0'
          max={inputYMax * 2}
          value={offsetY ?? ''}
          step='10'
          disabled={!hasImage}
          onChange={onYoffsetChange}
          className='offsetInput'
          id='offsetY'
        />
        <FontAwesomeIcon icon={faUpDown} className='iconPosition icon' />
      </div>
      <div>
        <Button buttonType={0} onClick={onHandleGeneratePrintDescription}>
          Save print settings
        </Button>
        <Button
          buttonType={1}
          onClick={onHandleClearStorage}
          customClass='buttonLeftMargin'
        >
          Clear print settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
