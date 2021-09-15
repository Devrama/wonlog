import React from 'react';

interface contentAreaProps {
  contentComponent: React.FC
}

const ContentArea:React.FC<contentAreaProps> = ({ contentComponent: ContentComponent }) => {
  return <ContentComponent />;
};

export default ContentArea;
