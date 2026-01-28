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

  console.log(players);
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
                      <div key={player.id} className="player-entry">
                        {/* 2. Changed 'user' to 'player' to match the map variable */}
                        {playersInRank.map((player, pIdx) => {
                          console.log(
                            `Generating link for ${player.firstName}: /profile/${player.id}`,
                          );
                          return (
                            <div key={player.id} className="player-entry">
                              <Link to={`/profile/${player.id}`} className="p-link">
                                {player.firstName}
                              </Link>
                            </div>
                          );
                        })}
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
