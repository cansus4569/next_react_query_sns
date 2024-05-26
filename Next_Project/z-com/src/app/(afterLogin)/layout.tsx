import React, { ReactNode } from 'react';

const AfterLoginLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      AfterLogin Layout
      {children}
    </div>
  );
};

export default AfterLoginLayout;
