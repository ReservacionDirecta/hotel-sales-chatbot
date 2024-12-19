import React from 'react';

interface Props {
  message: string;
}

const ErrorMessage: React.FC<Props> = ({ message }) => {
  return (
    <div className="text-red-500">
      {message}
    </div>
  );
};

export default ErrorMessage;
