import { useEffect, useState } from 'react';
import { getProgressToNextRank, RANK_THRESHOLDS } from '../utils/rankUtils';

export default function RankTest() {
  const [userProgress, setUserProgress] = useState(null);

  useEffect(() => {
    const mockUser = {
      currentRank: 'BRONZE',
      totalXP: 150,
    };
    setUserProgress(mockUser);
    console.log('Simulated user progress:', mockUser);
    console.log(
      'Progress to next rank:',
      getProgressToNextRank(mockUser.currentRank, mockUser.totalXP),
    );
  }, []);

  if (!userProgress) return <div>Loading...</div>;

  return (
    <div>
      <p>Rank: {userProgress.currentRank}</p>
      <p>Total XP: {userProgress.totalXP}</p>
      <p>
        Progress to next rank:{' '}
        {getProgressToNextRank(userProgress.currentRank, userProgress.totalXP)}%
      </p>
    </div>
  );
}
