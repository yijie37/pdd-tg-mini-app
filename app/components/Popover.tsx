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
      <p>Congrats on the INFECTION mission!</p>
      <p>Now keep on infecting!</p>
      <p>Every {count} more person you infected, you will earn a {count} virus!</p>
    </div>
  );

  return (
    <Popover content={content}>
      <img className="w-6 pos-right" src="/images/Infomation.svg" alt="Information Icon" />
    </Popover>
  );
};

export default App;