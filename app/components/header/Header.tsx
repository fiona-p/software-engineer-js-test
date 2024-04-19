import React from 'react';
import { Button } from '../button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

type HeaderProps = {
  hasImage: boolean;
  hasSavedOffsetY: number | boolean;
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHandleImportPrintDescription: () => void;
  printSettingsCopy: string;
};

const Header = ({
  handlePhotoUpload,
  hasImage,
  hasSavedOffsetY,
  onHandleImportPrintDescription,
  printSettingsCopy,
}: HeaderProps) => {
  return (
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
      {hasImage && hasSavedOffsetY && (
        <div className='subHeading'>
          <>
            <Button buttonType={0} onClick={onHandleImportPrintDescription}>
              Import print settings
            </Button>
            <p className='settingsCopy'>
              <FontAwesomeIcon icon={faInfoCircle} className='iconPosition' />
              {printSettingsCopy}
            </p>
          </>
        </div>
      )}
    </header>
  );
};

export default Header;
