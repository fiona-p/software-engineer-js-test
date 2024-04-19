import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button';

describe('<Button />', () => {
  it('renders default state with default style and default type background', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('buttonCommon');
    expect(button).toHaveStyle('background-color: rgba(0, 115, 119, 0.7)');
    expect(button).not.toHaveStyle('background-color: #ff6666');
    expect(button).toBeEnabled();
  });

  it('renders with children', () => {
    render(<Button>Text inside button</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('Text inside button');
  });

  it('renders background style according to button type', () => {
    render(<Button buttonType={1}>Test</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveStyle('background-color: rgb(255, 102, 102)');
  });

  it('renders with custom class if added custom class passed as a prop', () => {
    render(<Button customClass='custom'>Test</Button>);
    const button = screen.getByRole('button');

    expect(button).toHaveClass('buttonCommon custom');
  });
});
