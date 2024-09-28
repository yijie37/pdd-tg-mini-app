import React, { useState } from 'react';
import { Popover } from 'antd';

interface IPopoverProps {
  children: React.ReactNode;
  headImg: string;
  firstLine: string;
  secondLine: string;
  position?: string;
  hideHeaderImg?: boolean;
}

const App: React.FC<IPopoverProps> = ({ headImg, firstLine, secondLine, hideHeaderImg=true }) => {
  // const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };


  // const handleVisibleChange = (newVisible: boolean) => {
  //   setVisible(newVisible);
  // };

  // const handleClick = () => {
  //   setVisible(!visible);
  // };

  const content = (
    <div className='text-white'>
      {hideHeaderImg && <img className='w-12 mx-auto' src={`/images/${headImg}`} alt="Head Image" />}
      <p className='mb-1'>{firstLine}</p>
      <p className='mb-1'>{secondLine}</p>
    </div>
  );

  // return (
  //   <Popover content={content}>
  //     <img className="w-6 pos-right" src="/images/Infomation.svg" alt="Information Icon" />
  //   </Popover>
  // );
  return (
    <Popover 
      content={content}
      open={open}
      onOpenChange={handleOpenChange}
      trigger="click"
    >
      <img 
        className="w-6 pos-right cursor-pointer" 
        src="/images/Infomation.svg" 
        alt="Information Icon" 
      />
    </Popover>
  );
};

export default App;