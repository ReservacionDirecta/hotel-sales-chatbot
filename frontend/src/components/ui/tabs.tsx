import React, { useState } from 'react';

interface TabProps {
  label: string;
  children: React.ReactNode;
}

interface TabsProps {
  children: React.ReactElement<TabProps>[];
}

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="flex flex-col">
      <div className="flex space-x-4">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`py-2 px-4 ${activeTab === index ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
              >
                {child.props.label}
              </button>
            );
          }
          return null;
        })}
      </div>
      <div className="mt-4">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return (
              <div key={index} className={activeTab === index ? 'block' : 'hidden'}>
                {child.props.children}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
