import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/userApi'; // Your axios instance

const PublicProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('RENDER - Current Path Param userId:', userId);

  useEffect(() => {
    // 1. Log for debugging
    console.log('Effect check - ID is:', userId);

    // 2. Only fetch if we have a valid ID string
    if (userId && userId !== 'undefined') {
      fetchProfile();
    } else {
      // 3. If ID is gone, stop the loading spinner so we don't hang
      setLoading(false);
    }
  }, [userId]); // This dependency is crucial!

  const fetchProfile = async () => {
    // 2. IMPORTANT: Reset profile and set loading to true
    // so the UI doesn't try to show '3' while loading '2'
    setProfile(null);
    setLoading(true);

    try {
      const response = await api.get(`/users/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile', error);
    } finally {
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

  // 4. THE UI GUARD: If there's no ID yet, show nothing or a tiny spinner
  if (!userId || userId === 'undefined') {
    return <div className="profile-container">Searching for user...</div>;
  }

  if (loading) return <div className="profile-container">Loading profile...</div>;

  if (!profile) return <div className="profile-container">User not found.</div>;

  if (loading) return <div>Loading...</div>;
  if (loading) return <div>Loading Profile Data...</div>;
  if (!profile) return <div>User not found or data is empty.</div>; // Add this!

  return (
    <div className="profile-container">
      {/* 1. Header Section */}
      {/* Inside the Public Goals List section */}
      <div className="goals-list">
        {profile.goals && profile.goals.length > 0 ? (
          profile.goals.map((goal) => (
            <div key={goal.id} className="goal-card-readonly">
              <h4>{goal.title}</h4>
              <p>Consistency: {goal.checkDates.length} checks</p>
            </div>
          ))
        ) : (
          <p className="no-goals-text">This user hasn't set any public goals yet.</p>
        )}
      </div>
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
