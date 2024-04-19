import React, { ButtonHTMLAttributes } from 'react';

import { ButtonType } from './consts';
import { Props } from './props';

const Button = React.forwardRef<
  HTMLButtonElement,
  Props & ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    { children, buttonType = ButtonType.GENERAL, customClass = '', ...props },
    ref
  ) => {
    const buttonStyle = {
      0: { backgroundColor: 'rgba(0, 115, 119, 0.7)' },
      1: { backgroundColor: 'rgb(255, 102, 102)' },
    };

    const style = buttonStyle[buttonType] || {};
    return (
      <button
        ref={ref}
        style={style}
        className={`buttonCommon ${customClass}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
