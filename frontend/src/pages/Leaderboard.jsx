import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Added this import
import axios from 'axios';
import '../Leaderboard.css';

const Leaderboard = () => {
  // Note: Removed currentUser if not using it for logic
  const [players, setPlayers] = useState([]);

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
        {rankOrder
          .slice(0)
          .reverse()
          .map((rank) => {
            const playersInRank = players.filter((p) => p.currentRank === rank);

            return (
              <div key={rank} className={`stair-segment rank-${rank.toLowerCase()}`}>
                <div className="stair-tread">
                  <span className="rank-name">{rank}</span>
                  <div className="player-list">
                    {playersInRank.map((player, pIdx) => (
                      <div key={pIdx} className="player-entry">
                        {/* 2. Changed 'user' to 'player' to match the map variable */}
                        <Link to={`/profile/${player.id}`} className="p-link">
                          <span className="p-name">
                            {player.firstName} {player.lastName}
                          </span>
                        </Link>
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
