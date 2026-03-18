import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { signInAnonymously } from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { app, auth } from '../firebase'
import './ProjectViewer.css'

const db = getFirestore(app)
const GENERIC_ACCESS_ERROR = 'Project unavailable'
const STATUS_COLORS = {
  Active: '#7a4c14',
  'On Hold': '#b06f17',
  Completed: '#45603b',
}
const TAG_COLORS = {
  Before: '#7f5d2b',
  After: '#45603b',
  Issue: '#9a3d2c',
  Completed: '#5d503d',
}
const CUSTOM_TAG_COLORS = {
  red: '#9a3d2c',
  orange: '#b06f17',
  yellow: '#b88d1f',
  green: '#45603b',
  teal: '#34645f',
  blue: '#3f6484',
  purple: '#6a557d',
  pink: '#8b5f61',
  gray: '#6e6a63',
}

function normalizeProjectId(value) {
  return value?.trim() ?? ''
}

function isValidProjectId(value) {
  return /^[A-Za-z0-9_-]{6,128}$/.test(value)
}

function timestampToDate(timestamp) {
  if (!timestamp) return null
  if (typeof timestamp.toDate === 'function') return timestamp.toDate()
  if (typeof timestamp.seconds === 'number') return new Date(timestamp.seconds * 1000)
  const parsed = new Date(timestamp)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function isExpired(project) {
  const expirationDate = timestampToDate(
    project.expiresAt ?? project.expiresOn ?? project.shareExpiresAt,
  )

  if (!expirationDate) {
    return false
  }

  return expirationDate.getTime() <= Date.now()
}

function isShareBlocked(project) {
  if (!project || typeof project !== 'object') {
    return true
  }

  if (project.isRevoked === true || project.revoked === true || project.deleted === true) {
    return true
  }

  if (project.isActive === false || project.shareEnabled === false) {
    return true
  }

  if (project.visibility === 'private') {
    return true
  }

  return isExpired(project)
}

export default function ProjectViewer() {
  const { token, projectId } = useParams()
  const resolvedProjectId = normalizeProjectId(projectId ?? token)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lightboxImage, setLightboxImage] = useState(null)

  useEffect(() => {
    if (!isValidProjectId(resolvedProjectId)) {
      setError(GENERIC_ACCESS_ERROR)
      setLoading(false)
      return
    }

    let cancelled = false

    const loadProject = async () => {
      try {
        setLoading(true)
        setError(null)
        setProject(null)

        if (!auth.currentUser) {
          try {
            await signInAnonymously(auth)
          } catch (authError) {
            console.warn('Anonymous auth unavailable for shared project access:', authError)
          }
        }

        const docRef = doc(db, 'shared_projects', resolvedProjectId)
        const docSnap = await getDoc(docRef)

        if (cancelled) {
          return
        }

        if (!docSnap.exists()) {
          setError(GENERIC_ACCESS_ERROR)
          return
        }

        const projectData = docSnap.data()

        if (isShareBlocked(projectData)) {
          setError(GENERIC_ACCESS_ERROR)
          return
        }

        setProject(projectData)
      } catch (err) {
        if (!cancelled) {
          console.error('Error loading project:', err)
          setError(GENERIC_ACCESS_ERROR)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProject()

    return () => {
      cancelled = true
    }
  }, [resolvedProjectId])

  const formatDate = (timestamp) => {
    const date = timestampToDate(timestamp)
    if (!date) return ''
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (timestamp) => {
    const date = timestampToDate(timestamp)
    if (!date) return ''
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status) => STATUS_COLORS[status] || '#6e6a63'
  const getTagColor = (tag) => TAG_COLORS[tag] || '#6e6a63'
  const getCustomTagColor = (colorName) => CUSTOM_TAG_COLORS[colorName] || '#6e6a63'

  if (loading) {
    return (
      <div className="project-viewer">
        <div className="project-viewer-shell loading">
          <div className="spinner"></div>
          <p>Loading project...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="project-viewer">
        <div className="project-viewer-shell">
          <div className="viewer-masthead">
            <div>
              <div className="viewer-eyebrow">Shared project</div>
              <h1>{error}</h1>
            </div>
            <Link className="viewer-back-link" to="/#projects">
              Back to projects
            </Link>
          </div>
          <div className="error-card">
            <p>
              This share link is invalid, revoked, expired, or not available to
              this viewer.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!project) return null

  return (
    <div className="project-viewer">
      <div className="project-viewer-shell">
        <div className="viewer-masthead">
          <div>
            <div className="viewer-eyebrow">Shared project</div>
            <h1>{project.name}</h1>
          </div>
          <Link className="viewer-back-link" to="/#projects">
            Open another ID
          </Link>
        </div>

        <div className="project-header">
          <div className="project-header-main">
            <div className="project-stamp">Field Record</div>
            <div className="project-meta">
              <span className="status-badge" style={{ backgroundColor: getStatusColor(project.status) }}>
                {project.status || 'Shared'}
              </span>
              <span className="meta-item">{project.photoCount || project.photos?.length || 0} photos</span>
              <span className="meta-item">Created {formatDate(project.createdAt)}</span>
            </div>
          </div>

          {project.address && (
            <div className="project-address">
              <span className="icon">Location</span>
              {project.address}
            </div>
          )}

          {project.notes || project.description ? (
            <div className="project-summary">
              {project.notes || project.description}
            </div>
          ) : null}

          <div className="project-id-row">
            <span className="project-id-label">Project ID</span>
            <span className="project-id-value">{resolvedProjectId}</span>
          </div>
        </div>

        {project.photos && project.photos.length > 0 ? (
          <div className="photos-grid">
            {project.photos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                className="photo-card"
                onClick={() => setLightboxImage(photo.annotatedImageURL || photo.fullURL || photo.imageURL || photo.thumbnailURL)}
              >
                <div className="photo-thumb-wrapper">
                  <img src={photo.annotatedImageURL || photo.thumbnailURL || photo.fullURL || photo.imageURL} alt="Project photo" loading="lazy" />
                  {photo.annotatedImageURL && <span className="annotation-badge" title="Annotated">✏️</span>}
                </div>
                <div className="photo-info">
                  <div className="photo-date">
                    {formatDate(photo.timestamp)} at {formatTime(photo.timestamp)}
                  </div>
                  <div className="photo-tag-row">
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
                  </div>
                  {photo.notes && <div className="photo-notes">{photo.notes}</div>}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No photos in this shared project yet.</p>
          </div>
        )}
      </div>

      {lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="Full size" />
        </div>
      )}
    </div>
  )
}
