import React from 'react';
import { Popover } from 'antd';

interface IPopoverProps {
  children: React.ReactNode;
  headImg: string;
  count: number;
  position?: string;
  hideHeaderImg?: boolean;
}

const App: React.FC<IPopoverProps> = ({ headImg, count, hideHeaderImg=true }) => {
  const content = (
    <div className='text-white'>
      {hideHeaderImg && <img className='w-12 mx-auto' src={`/images/${headImg}`} alt="Head Image" />}
      <p className='mb-1'>Now keep on infecting!</p>
      <p className='mb-1'>The more you infected, the more virus you will earn!</p>
    </div>
  );

  return (
    <Popover content={content}>
      <img className="w-6 pos-right" src="/images/Infomation.svg" alt="Information Icon" />
    </Popover>
  );
};

export default App;