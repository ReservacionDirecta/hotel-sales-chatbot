import React from 'react';

export interface ButtonProps {
    variant: 'default' | 'outline' | 'destructive';
    size: 'sm' | 'md' | 'lg';
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant,
    size,
    className,
    onClick,
    children,
}) => {
    return (
        <button
            className={`${className} ${variant === 'default'
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : variant === 'outline'
                        ? 'bg-transparent border border-primary text-primary hover:bg-primary-dark hover:text-white'
                        : 'bg-red-500 text-white hover:bg-red-700'
                } ${size === 'sm' ? 'py-1 px-2' : size === 'md' ? 'py-2 px-4' : 'py-3 px-6'}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
