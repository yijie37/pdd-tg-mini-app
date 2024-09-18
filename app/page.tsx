'use client'
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";

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
      if (!userId) return;

      try {
        // Fetch recommended user number
        // const recommendationResponse = await fetch(`https://127.0.0.1:6543/user/${userId}/recommendation-scores`);
        const recommendationResponse = await fetch(`http://127.0.0.1:6543/user/score/111`);
        const response = await recommendationResponse.json();
        console.log('API Response:', response);
        setRecommendedUserNumber(response.recommendedUserNumber);
        setTokenToTake(response.tokenToTake);
        setBtcToTake(response.btcToTake);
        // setRecommendedUserNumber(100);
        // setTokenToTake(100);
        // setBtcToTake(50);
      } catch (error) {
        console.error('Error fetching data:', error);
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
