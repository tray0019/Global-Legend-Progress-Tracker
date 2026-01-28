import React, { useState } from 'react';
import axios from 'axios';

const FollowButton = ({ targetUserId, initialIsFollowing }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false); // Add a loading state to prevent double-clicks

  const handleFollow = async () => {
    setLoading(true);
    try {
      // It's better to use a generic 'toggle' endpoint or specific follow/unfollow
      await axios.post(
        `http://localhost:8080/api/users/follow/${targetUserId}`,
        {},
        { withCredentials: true },
      );
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Follow action failed:', err);
      alert('Could not update follow status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`follow-btn ${isFollowing ? 'following' : 'not-following'}`}
      style={{
        padding: '8px 16px',
        borderRadius: '20px',
        cursor: loading ? 'not-allowed' : 'pointer',
        backgroundColor: isFollowing ? '#e0e0e0' : '#00b894',
        color: isFollowing ? '#666' : '#fff',
        border: 'none',
        fontWeight: 'bold',
      }}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
