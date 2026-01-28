import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/userApi'; // Your axios instance

const PublicProfile = () => {
  const { userId } = useParams(); // Gets the ID from the URL
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inside PublicProfile.jsx
  useEffect(() => {
    console.log('1. UseEffect Triggered with userId:', userId);
    if (userId && userId !== 'undefined') {
      fetchProfile();
    } else {
      console.log('1a. UserId is missing or undefined string!');
    }
  }, [userId]);

  const fetchProfile = async () => {
    console.log('2. fetchProfile started for:', userId);
    try {
      setLoading(true);
      const response = await api.get(`/users/profile/${userId}`);
      console.log('3. API Success! Data:', response.data);
      setProfile(response.data);
    } catch (error) {
      console.error('3. API Error:', error.response || error);
    } finally {
      console.log('4. fetchProfile finished (finally)');
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      // Reusing your FollowController logic
      await api.post(`/api/social/follow/${userId}`);
      // Refresh the data to update follower count and "isFollowing" status
      fetchProfile();
    } catch (error) {
      console.error('Follow failed', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (loading) return <div>Loading Profile Data...</div>;
  if (!profile) return <div>User not found or data is empty.</div>; // Add this!

  return (
    <div className="profile-container">
      {/* 1. Header Section */}
      <div className="profile-header">
        <h1>
          {profile.firstName} {profile.lastName}
        </h1>
        <span className={`rank-badge ${profile.rank.toLowerCase()}`}>{profile.rank}</span>
        <div className="stats">
          <span>
            <strong>{profile.followersCount}</strong> Followers
          </span>
          <span>
            <strong>{profile.followingCount}</strong> Following
          </span>
        </div>
        <button onClick={handleFollowToggle}>{profile.isFollowing ? 'Unfollow' : 'Follow'}</button>
      </div>

      <hr />

      {/* 2. Global Calendar (Heatmap) */}
      <h3>Activity Heatmap</h3>
      <div className="heatmap-section">
        {/* Pass profile.calendarData to your existing Heatmap component 
                   It already matches the GlobalContributionDto format! 
                */}
      </div>

      {/* 3. Public Goals List */}
      <h3>Active Goals</h3>
      <div className="goals-list">
        {profile.goals.map((goal) => (
          <div key={goal.id} className="goal-card-readonly">
            <h4>{goal.title}</h4>
            <p>Consistency: {goal.checkDates.length} checks in this period</p>
            {/* Progress Bar or Mini-Calendar for this specific goal */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicProfile;
