import React from 'react';
import { Popover } from 'antd';

interface IPopoverProps {
  children: React.ReactNode;
  headImg: string;
  count: number;
  position?: string;
}

const App: React.FC<IPopoverProps> = ({ headImg, count }) => {
  const content = (
    <div>
      <img className='w-12 mx-auto' src={`/images/${headImg}`} alt="Head Image" />
      <p>Congrats on the INFECTION mission!</p>
      <p>Now keep on infecting!</p>
      <p>Every {count} more person you infected, you will earn a {count} virus!</p>
    </div>
  );

  return (
    <Popover content={content}>
      <img className="w-12" src="/images/Infomation.svg" alt="Information Icon" />
    </Popover>
  );
};

export default App;