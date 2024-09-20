'use client'
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [count, setCount] = useState(0);
  const dataFetchedRef = useRef(false);
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    console.log('count changed')
    updateProgress()
  }, []);

  function updateProgress(): void {
    console.log('updateProgress')
    const interval = setInterval(() => {
      setCount(prevCount => {
        if (prevCount < 100) {
          console.log('count', prevCount, prevCount < 100);
          return prevCount + 1;
        } else {
          console.log('count is 100');
          clearInterval(interval); // 确保在count达到100时清除定时器
          return prevCount;
        }
      });
    }, 100); // 更新间隔为100毫秒
  }
  function handleInvite(): void {
    console.log('handleInvite')
  }

  return (
    <div className="bg-black h-screen px-16 py-10">
      <img className='w-52 h-44 mx-auto' src="/images/pdd_logo.jpeg" alt="" />
      <h3 className='mt-8 text-white text-center'>Referral Reward</h3>
      <div className='w-full border border-red-500 rounded p-1'>
        <div className='p-2 bg-red-300 rounded-sm relative'>
          <div className='w-20 bg-red-500 h-4 rounded-e-lg'  style={{width: count + '%'}}></div>
          <span className='absolute top-1 inset-x-1/2 translate-x-negative-5 text-white translate-x-50'>{count}%</span>
        </div>
      </div>
      <p className="text-white text-center mt-12">Token Reward</p>
      <p className="text-white text-center mt-10"><span className="text-red-600">666</span>$AAA</p>

      <div className="bg-red-600 text-white text-center mt-16 h-10 leading-10 rounded-lg" onClick={handleInvite}>Invite Friends</div>
    </div>
  );
}