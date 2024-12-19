import React from 'react';

export interface ErrorMessageProps {
    title: string;
    message: string;
    onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title,
    message,
    onRetry,
}) => {
    return (
        <div className="p-4 bg-red-100 border border-red-500 text-red-700">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm">{message}</p>
            {onRetry && (
                <button
                    className="bg-primary text-white hover:bg-primary-dark py-2 px-4"
                    onClick={onRetry}
                >
                    Reintentar
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
