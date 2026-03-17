import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { app } from '../firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './ProjectViewer.css';

const db = getFirestore(app);

export default function ProjectViewer() {
  const { token } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid project link');
      setLoading(false);
      return;
    }

    loadProject();
  }, [token]);

  const loadProject = async () => {
    try {
      const docRef = doc(db, 'shared_projects', token);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setError('Project not found or link has been revoked');
        return;
      }

      setProject(docSnap.data());
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    const colors = { 'Active': '#2196f3', 'On Hold': '#ff9800', 'Completed': '#4caf50' };
    return colors[status] || '#9e9e9e';
  };

  const getTagColor = (tag) => {
    const colors = { 'Before': '#2196f3', 'After': '#4caf50', 'Issue': '#f44336', 'Completed': '#9c27b0' };
    return colors[tag] || '#9e9e9e';
  };

  const getCustomTagColor = (colorName) => {
    const colors = {
      red: '#f44336', orange: '#ff9800', yellow: '#ffc107', green: '#4caf50',
      teal: '#009688', blue: '#2196f3', purple: '#9c27b0', pink: '#e91e63', gray: '#9e9e9e'
    };
    return colors[colorName] || '#9e9e9e';
  };

  if (loading) {
    return (
      <div className="project-viewer">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-viewer">
        <div className="error-card">
          <h2>❌ {error}</h2>
          <p>This project may have been deleted or the link is no longer valid.</p>
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="project-viewer">
      <div className="container">
        <div className="project-header">
          <h1>{project.name}</h1>
          {project.address && (
            <div className="project-address">
              <span className="icon">📍</span>
              {project.address}
            </div>
          )}
          <div className="project-meta">
            <span className="status-badge" style={{ backgroundColor: getStatusColor(project.status) }}>
              {project.status}
            </span>
            <span className="meta-item">📷 {project.photoCount} {project.photoCount === 1 ? 'photo' : 'photos'}</span>
            <span className="meta-item">📅 Created {formatDate(project.createdAt)}</span>
          </div>
        </div>

        {project.photos && project.photos.length > 0 ? (
          <div className="photos-grid">
            {project.photos.map((photo) => (
              <div key={photo.id} className="photo-card" onClick={() => setLightboxImage(photo.thumbnailURL)}>
                <img src={photo.thumbnailURL} alt="Project photo" loading="lazy" />
                <div className="photo-info">
                  <div className="photo-date">
                    {formatDate(photo.timestamp)} at {formatTime(photo.timestamp)}
                  </div>
                  {photo.tag && (
                    <span className="photo-tag" style={{ backgroundColor: getTagColor(photo.tag) }}>
                      {photo.tag}
                    </span>
                  )}
                  {photo.customTag && (
                    <span className="photo-tag" style={{ backgroundColor: getCustomTagColor(photo.customTagColor) }}>
                      {photo.customTag}
                    </span>
                  )}
                  {photo.notes && <div className="photo-notes">{photo.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No photos in this project yet</p>
          </div>
        )}
      </div>

      {lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="Full size" />
        </div>
      )}
    </div>
  );
}