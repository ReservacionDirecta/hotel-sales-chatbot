import React from 'react';

export interface InputProps {
    type: 'text' | 'email' | 'password';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
}

const Input: React.FC<InputProps> = ({
    type,
    value,
    onChange,
    placeholder,
    className,
}) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${className} py-2 pl-10 text-sm text-gray-700`}
        />
    );
};

export default Input;
