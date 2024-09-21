'use client'
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { Fernet } from 'fernet';

// Define a base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://139.177.202.65:6543';

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

// Add these functions outside of the Home component
function encryptString(text: string, key: string): string {
  const fernet = new Fernet(key);
  return fernet.encode(text);
}

function decryptString(encryptedText: string, key: string): string {
  const fernet = new Fernet(key);
  return fernet.decode(encryptedText);
}

export default function Home() {
  const [recommendedUserNumber, setRecommendedUserNumber] = useState(0);
  const [tokenToTake, setTokenToTake] = useState(0);
  const [btcToTake, setBtcToTake] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [years, setYears] = useState(1);
  const [encryptionKey, setEncryptionKey] = useState<string | null>(null);
  // const [registerYears, setRegisterYears] = useState(0);
  // const [recommender, setRecommender] = useState<string>("0");

  useEffect(() => {
    // Initialize WebApp and get user_id
    WebApp.ready();
    // const initData = WebApp.initData || '';
    const user = WebApp.initDataUnsafe.user;
    if (user) {
      setUserId(user.id.toString());
      // setRegisterYears(binarySearch(user.id));
    }

    if (WebApp.initDataUnsafe.start_param) {
      // post ref request to server
      // setRecommender(WebApp.initDataUnsafe.start_param);
    }

    // Generate or retrieve an encryption key
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY!
    setEncryptionKey(key);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setUserId('1390026482')
      setYears(1)
      if (!userId) return;

      try {
        // Use the API_BASE_URL and interpolate the userId
        const recommendationResponse = await fetch(`${API_BASE_URL}/api/user/score?userId=${userId}&years=${years}`);
        // const recommendationResponse = await fetch('/api', { method: 'GET'});
        console.log(recommendationResponse)
        if (!recommendationResponse.ok) {
          throw new Error('API request failed');
        }
        const response = await recommendationResponse.json();
        console.log('API Response:', response);
        
        // Uncomment these lines when the API is ready
        setRecommendedUserNumber(response.recommendations);
        setTokenToTake(response.token_score);
        setBtcToTake(response.btc_score);
        
        // Remove these mock values when the API is ready
        // setRecommendedUserNumber(23);
        // setTokenToTake(100);
        // setBtcToTake(50);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally, set an error state here to display to the user
      }

      // Set recommand
      // try {
      //   const encryptedUserId = encryptString(userId, process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);
      //   const encryptedOldUser = encryptString(recommender, process.env.NEXT_PUBLIC_ENCRYPTION_KEY!);
      //   const refResponse = await fetch(`${API_BASE_URL}/api/recommend?new_user=${encryptedUserId}&old_user=${encryptedOldUser}`);
      //   if (!refResponse.ok) {
      //     throw new Error('API request failed');
      //   }
      //   const response = await refResponse.json();
      //   console.log('API Response:', response);
      // } catch (error) {
      //   console.error('Error fetching data:', error);
      // }
    };

    fetchData();
  }, [userId]);

  function calculateYearsSince(dateString: string) {
    const now = new Date();
    const [year, month] = dateString.split('.').map(Number);
    const registrationDate = new Date(year, month - 1);
    const diff = now.getTime() - registrationDate.getTime();
    return diff / (1000 * 60 * 60 * 24 * 365);  // returns decimal years
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">PDD Referral</h1>
      
      <div className="space-y-4">
        <p><strong>Recommended User Number:</strong> {recommendedUserNumber}</p>
        <p><strong>Token to be taken:</strong> {tokenToTake}</p>
        <p><strong>BTC to be taken:</strong> {(btcToTake / 100).toFixed(2)}%</p>
      </div>
    </main>
  );
}
