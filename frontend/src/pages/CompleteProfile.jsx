import React, { useState } from 'react';
import { completeProfile } from '../api/userApi';
import { useNavigate } from 'react-router-dom';

function CompleteProfile({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  // Local state for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(''); // should match your enum: MAN, WOMAN, NON_BINARY, etc.
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  if (!currentUser) {
    // if no logged-in user, redirect to login
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!firstName || !lastName || !gender || !birthDate) {
      setError('All fields are required.');
      return;
    }

    const profileData = {
      firstName,
      lastName,
      gender, // send exact enum string
      birthDate, // format: yyyy-MM-dd
    };

    try {
      const updatedUser = await completeProfile(currentUser.id, profileData);
      console.log('Profile updated:', updatedUser);
      setCurrentUser(updatedUser);
      // Optionally, update currentUser in context or state
      navigate('/'); // go to home after completing profile
    } catch (err) {
      console.error('Failed to complete profile:', err);
      setError('Failed to complete profile. Please check your data.');
    }
  };

  return (
    <div>
      <h1>Complete Your Profile</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div>
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="MAN">Man</option>
            <option value="WOMAN">Woman</option>
            <option value="NON_BINARY">Non-binary</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </select>
        </div>
        <div>
          <label>Birth Date:</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
        </div>
        <button type="submit">Complete Profile</button>
      </form>
    </div>
  );
}

export default CompleteProfile;
