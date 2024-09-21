'use client'
import WebApp from "@twa-dev/sdk";
import { useEffect, useState, useRef } from "react";
import { message } from 'antd';
import generateInviteCode from './utils/encode_decode';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://139.177.202.65:6543' : '/api';
interface UserRegistration {
  id: number;
  registrationDate: string;  // format: "YYYY.MM"
}

const userRegistrations: UserRegistration[] = [
  { id: 100000000, registrationDate: "2015.06" },
  { id: 250000000, registrationDate: "2016.06" },
  { id: 410000000, registrationDate: "2017.06" },
  { id: 630000000, registrationDate: "2018.07" },
  { id: 970000000, registrationDate: "2019.07" },
  { id: 1370000000, registrationDate: "2020.06" },
  { id: 1930000000, registrationDate: "2021.07" },
  { id: 5500000000, registrationDate: "2022.06" },
  { id: 6245952118, registrationDate: "2023.07" }
];

export default function Home() {
  const [tokenToTake, setTokenToTake] = useState(0);
  const [btcToTake, setBtcToTake] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [registerYears, setRegisterYears] = useState(0);
  const [recommender, setRecommender] = useState<string>("0");
  const dataFetchedRef = useRef(false);
  const [messageApi, contextHolder] = message.useMessage();
  console.log('process.env', process)
  useEffect(() => {
    // Initialize WebApp and get user_id
    WebApp.ready();
    // const initData = WebApp.initData || '';
    const user = WebApp.initDataUnsafe.user;
    if (user) {
      setUserId(user.id.toString());
      setRegisterYears(binarySearch(user.id));
    }

    if (WebApp.initDataUnsafe.start_param) {
      // post ref request to server
      setRecommender(WebApp.initDataUnsafe.start_param);
    }

    // Generate or retrieve an encryption key
    console.log('process.env', process)
  }, []);

  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;

    const fetchData = async () => {
      setUserId('1390026482')
      setRegisterYears(1)
      // if (!userId) return;

      try {
        // Use the API_BASE_URL and interpolate the userId
        const recommendationResponse = await fetch(`${API_BASE_URL}/api/user/score?user_id=${userId}&years=${registerYears}`);
        // const recommendationResponse = await fetch('/api', { method: 'GET'});
        console.log(recommendationResponse)
        if (!recommendationResponse.ok) {
          throw new Error('API request failed');
        }
        const response = await recommendationResponse.json();
        console.log('API Response:', response);
        
        // Uncomment these lines when the API is ready
        setTokenToTake(response.token_score);
        const btcScore = Number((response.btc_score * 100).toFixed(6));
        setBtcToTake(btcScore);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      // Set recommand
      try {
        const encryptedOldUser = generateInviteCode(Number(userId));
        const refResponse = await fetch(`${API_BASE_URL}/api/recommend`, { method: 'POST',headers: {
          'Content-Type': 'application/json',
        }, body: JSON.stringify({"old_user": encryptedOldUser, "new_user": recommender})});
        if (!refResponse.ok) {
          throw new Error('API request failed');
        }
        const response = await refResponse.json();
        console.log('API Response:', response);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  function calculateYearsSince(dateString: string) {
    const now = new Date();
    const [year, month] = dateString.split('.').map(Number);
    const registrationDate = new Date(year, month - 1);
    const diff = now.getTime() - registrationDate.getTime();
    return diff / (1000 * 60 * 60 * 24 * 365);  // returns decimal registerYears
  }

  function binarySearch(userId: number) {
    let low = 0;
    let high = userRegistrations.length - 1;
  
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midValue = userRegistrations[mid].id;
  
        if (midValue === userId) {
            return calculateYearsSince(userRegistrations[mid].registrationDate);
        } else if (midValue < userId) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
  
    return 1;  
  }

  async function handleInvite() {
    
    console.log('handleInvite')
    // https://t.me/ppppooogg_bot/pdd123?startapp=1BSNLB
    const recommendationResponse = await fetch(`${API_BASE_URL}/api/user/referral-code/${userId}`)
    if (!recommendationResponse.ok) {
      throw new Error('API request failed');
    }
    const response = await recommendationResponse.json();
    console.log(response)
    await navigator.clipboard.writeText(`https://t.me/ppppooogg_bot/pdd123?startapp=${response.referral_code}`)
    messageApi.open({
      type: 'success',
      content: 'Copy Success!',
    });
  }

  return (
    <div className="bg-black h-screen px-16 py-10">
      {contextHolder}
      <img className='w-52 h-44 mx-auto' src="/images/final.svg" alt="" />
      <h3 className='mt-8 text-white text-center'>Referral Reward</h3>
      <div className='w-full border border-teal-600 rounded p-1'>
        <div className='p-2 bg-lime-300 rounded-sm relative'>
          <div className='w-20 bg-lime-500 h-4 rounded-e-lg'  style={{width: btcToTake + '%'}}></div>
          <span className='absolute top-1 inset-x-1/2 translate-x-negative-5 text-black translate-x-50'>{btcToTake}%</span>
        </div>
      </div>
      <p className="text-white text-center mt-12">Token Reward</p>
      <p className="text-white text-center mt-10"><span className="text-lime-600">{tokenToTake}</span>$AAA</p>

      <div className="bg-lime-500 text-black text-center mt-16 h-10 leading-10 rounded-lg" onClick={handleInvite}>Invite Friends</div>
    </div>
  );
}