'use client'
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";

// Define a base URL for your API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://139.177.202.65:6543';

export default function Home() {
  const [recommendedUserNumber, setRecommendedUserNumber] = useState(0);
  const [tokenToTake, setTokenToTake] = useState(0);
  const [btcToTake, setBtcToTake] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Initialize WebApp and get user_id
    WebApp.ready();
    // const initData = WebApp.initData || '';
    const user = WebApp.initDataUnsafe.user;
    if (user) {
      setUserId(user.id.toString());
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setUserId('1390026482')
      if (!userId) return;

      try {
        // Use the API_BASE_URL and interpolate the userId
        const recommendationResponse = await fetch(`${API_BASE_URL}/api/user/score/${userId}`);
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
    };

    fetchData();
  }, [userId]);

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
