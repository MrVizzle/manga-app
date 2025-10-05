import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Image } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, updateProfile, updateAvatar, isProfileOwner, fileToBase64, validateProfileData } from '../services/profileServices';
import '../pages/PageStyles/Profile.css';

export default function ProfilePage() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user, updateUser } = useContext(AuthContext);
    
    // State management
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editMode, setEditMode] = useState(''); // 'username', 'bio', or ''
    const [editValues, setEditValues] = useState({ userName: '', bio: '' });
    const [isOwner, setIsOwner] = useState(false);
    const [updating, setUpdating] = useState(false);

    // Load profile data
    useEffect(() => {
        loadProfile();
    }, [username]);

    // Check if current user owns this profile
    useEffect(() => {
        if (profile && user) {
            setIsOwner(isProfileOwner(profile.userName, user));
        }
    }, [profile, user]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError('');
            const profileData = await getUserProfile(username);
            setProfile(profileData);
            setEditValues({
                userName: profileData.userName,
                bio: profileData.bio || ''
            });
        } catch (err) {
            setError(err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleEditStart = (field) => {
        setEditMode(field);
        setError('');
        setSuccess('');
    };

    const handleEditCancel = () => {
        setEditMode('');
        setEditValues({
            userName: profile.userName,
            bio: profile.bio || ''
        });
    };

    const handleEditSave = async (field) => {
        try {
            setUpdating(true);
            setError('');

            const updateData = {};
            if (field === 'username') {
                updateData.userName = editValues.userName;
            } else if (field === 'bio') {
                updateData.bio = editValues.bio;
            }

            // Validate data
            const validation = validateProfileData(updateData);
            if (!validation.isValid) {
                const errorMessage = Object.values(validation.errors)[0];
                setError(errorMessage);
                return;
            }

            // Update profile
            const result = await updateProfile(updateData);
            setProfile(prev => ({
                ...prev,
                ...result.user
            }));

            // If username was changed, update the AuthContext and navigate to new URL
            if (field === 'username' && result.user.userName !== username) {
                console.log('Username changed from', username, 'to', result.user.userName);
                console.log('Current user before update:', user);
                
                // Update the user context with new username
                updateUser({ userName: result.user.userName });
                
                console.log('Called updateUser with:', { userName: result.user.userName });
                
                // Navigate to the new profile URL
                navigate(`/profile/${result.user.userName}`, { replace: true });
            }


            setEditMode('');
            setSuccess('Profile updated successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setUpdating(true);
            setError('');

            const base64 = await fileToBase64(file);
            const result = await updateAvatar(base64);
            
            setProfile(prev => ({
                ...prev,
                profilePicture: result.profilePicture
            }));

            setSuccess('Profile picture updated successfully!');
            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            setError(err.message || 'Failed to update profile picture');
        } finally {
            setUpdating(false);
        }
    };

    const getDefaultAvatar = () => {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNzUiIHI9Ijc1IiBmaWxsPSIjNmM3NTdkIi8+CjxjaXJjbGUgY3g9Ijc1IiBjeT0iNjAiIHI9IjIyIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzAgMTIwYzAtMjQuODUzIDIwLjE0Ny00NSA0NS00NXM0NSAyMC4xNDcgNDUgNDUiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==';
    };

    if (loading) {
        return (
            <div className="profile-page">
                <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <Spinner animation="border" variant="primary" />
                </Container>
            </div>
        );
    }

    if (error && !profile) {
        return (
            <div className="profile-page">
                <Container className="mt-4">
                    <Alert variant="danger">{error}</Alert>
                    <Button variant="outline-primary" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                </Container>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <Card className="profile-card shadow">
                            <Card.Body className="text-center">
                                
                                {/* Success/Error Messages */}
                                {success && <Alert variant="success" className="mb-3">{success}</Alert>}
                                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                                {/* Profile Avatar Section */}
                                <div className="avatar-section mb-4 position-relative">
                                    <Image
                                        src={profile?.profilePicture || getDefaultAvatar()}
                                        alt={`${profile?.userName}'s profile`}
                                        roundedCircle
                                        width="150"
                                        height="150"
                                        className="profile-avatar shadow-sm"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    
                                    {isOwner && (
                                        <>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                style={{ display: 'none' }}
                                                id="avatar-upload"
                                                disabled={updating}
                                            />
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="avatar-edit-btn position-absolute"
                                                onClick={() => document.getElementById('avatar-upload').click()}
                                                disabled={updating}
                                            >
                                                📷
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Profile Information */}
                                <div className="profile-info text-start">
                                    
                                    {/* Username Field */}
                                    <div className="field-group mb-3">
                                        <label className="form-label fw-bold">Username</label>
                                        {editMode === 'username' ? (
                                            <div className="d-flex gap-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={editValues.userName}
                                                    onChange={(e) => setEditValues(prev => ({ ...prev, userName: e.target.value }))}
                                                    disabled={updating}
                                                />
                                                <Button 
                                                    variant="success" 
                                                    size="sm" 
                                                    onClick={() => handleEditSave('username')}
                                                    disabled={updating}
                                                >
                                                    ✓
                                                </Button>
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={handleEditCancel}
                                                    disabled={updating}
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="field-value">@{profile?.userName}</span>
                                                {isOwner && (
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        onClick={() => handleEditStart('username')}
                                                        disabled={updating}
                                                    >
                                                        ✏️
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Bio Field */}
                                    <div className="field-group mb-4">
                                        <label className="form-label fw-bold">Bio</label>
                                        {editMode === 'bio' ? (
                                            <div>
                                                <textarea
                                                    className="form-control mb-2"
                                                    rows="3"
                                                    placeholder="Tell us about yourself..."
                                                    value={editValues.bio}
                                                    onChange={(e) => setEditValues(prev => ({ ...prev, bio: e.target.value }))}
                                                    maxLength="500"
                                                    disabled={updating}
                                                />
                                                <small className="text-muted">{editValues.bio.length}/500 characters</small>
                                                <div className="d-flex gap-2 mt-2">
                                                    <Button 
                                                        variant="success" 
                                                        size="sm" 
                                                        onClick={() => handleEditSave('bio')}
                                                        disabled={updating}
                                                    >
                                                        ✓ Save
                                                    </Button>
                                                    <Button 
                                                        variant="secondary" 
                                                        size="sm" 
                                                        onClick={handleEditCancel}
                                                        disabled={updating}
                                                    >
                                                        ✕ Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-between align-items-start">
                                                <p className="field-value mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {profile?.bio || 'No bio yet...'}
                                                </p>
                                                {isOwner && (
                                                    <Button 
                                                        variant="outline-secondary" 
                                                        size="sm"
                                                        onClick={() => handleEditStart('bio')}
                                                        disabled={updating}
                                                    >
                                                        ✏️
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Loading indicator when updating */}
                                    {updating && (
                                        <div className="text-center">
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Updating...
                                        </div>
                                    )}

                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}