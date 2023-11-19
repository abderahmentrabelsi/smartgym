import React from 'react';
import metamaskFox from '../assets/metamask-fox-removebg-preview.png';

const CustomButton = ({ handleClick, disabled, isLoading }) => {
    return (
        <button
            type="button"
            style={{
                backgroundImage: `url(${metamaskFox})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                minWidth: '40px',
                minHeight: '40px',
                border: 'none',
                cursor: 'pointer',
                opacity: disabled || isLoading ? 0.5 : 1,
                backgroundColor: 'transparent',
            }}
            onClick={handleClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? 'Loading...' : undefined}
        </button>
    )
}

export default CustomButton;
