import React, { useState } from 'react';
import axios from 'axios';
import FollowButton from '../components/FollowButton';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length > 2) {
      // Only search after 3 characters
      const res = await axios.get(`http://localhost:8080/api/users/search?query=${val}`, {
        withCredentials: true,
      });
      setResults(res.data);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Find friends..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
      <div className="search-results">
        {results.map((user) => (
          <div key={user.id} className="search-item">
            <div className="user-info">
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              <span>
                {user.currentRank} • {user.totalXP} XP
              </span>
            </div>
            {/* Use the FollowButton we discussed earlier */}
            <FollowButton targetUserId={user.id} isFollowingInitial={user.isFollowing} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
