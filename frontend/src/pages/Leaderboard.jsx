import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Leaderboard.css';

const Leaderboard = (currentUser) => {
  const [players, setPlayers] = useState([]);

  // Define the order from bottom to top
  const rankOrder = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'CHALLENGER'];

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/leaderboard/global', { withCredentials: true })
      .then((res) => setPlayers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="leaderboard-page">
      <h2 className="title">Leaderboard</h2>

      <div className="staircase-wrapper">
        {/* .reverse() so Challenger is at the top of the code, but we use flex-direction: column-reverse */}
        {rankOrder
          .slice(0)
          .reverse()
          .map((rank, index) => {
            const playersInRank = players.filter((p) => p.currentRank === rank);

            return (
              <div key={rank} className={`stair-segment rank-${rank.toLowerCase()}`}>
                <div className="stair-tread">
                  <span className="rank-name">{rank}</span>
                  <div className="player-list">
                    {playersInRank.map((player, pIdx) => (
                      <div key={pIdx} className="player-entry">
                        <span className="p-name">{player.firstName}</span>
                        <span className="p-xp">{player.totalXP} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Leaderboard;
