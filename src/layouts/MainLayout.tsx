import React from 'react';

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({children}) => {
  return <div>{children}</div>;
};

export default MainLayout;
