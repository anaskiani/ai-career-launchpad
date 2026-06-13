import { useRef, useState } from 'react';
import { Camera, Trash2, Upload, X } from 'lucide-react';
import { useProfileStore } from '../../context/profileStore';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export const AvatarUpload = ({ profileImage }) => {
  const { uploadAvatar, deleteAvatar, isSaving } = useProfileStore();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const avatarUrl = profileImage
    ? `${API_BASE}/${profileImage}`
    : null;

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Only JPEG, PNG, and WebP images are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload
    uploadAvatar(file).then(() => setPreview(null));
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleDelete = () => {
    if (confirm('Remove your profile photo?')) {
      deleteAvatar();
      setPreview(null);
    }
  };

  const displayImage = preview || avatarUrl;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar circle */}
      <div
        className={`relative group cursor-pointer ${dragOver ? 'scale-105' : ''} transition-transform`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div
          className={`w-32 h-32 rounded-full overflow-hidden border-4 ${
            dragOver ? 'border-blue-400 shadow-lg shadow-blue-200' : 'border-white shadow-lg'
          } transition-all`}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Camera size={36} className="text-white/80" />
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Upload size={24} className="text-white" />
        </div>

        {/* Loading spinner */}
        {isSaving && (
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium disabled:opacity-50"
        >
          <Camera size={14} /> Change Photo
        </button>
        {avatarUrl && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            <Trash2 size={14} /> Remove
          </button>
        )}
      </div>

      <p className="text-xs text-gray-400">JPEG, PNG, or WebP · Max 5MB</p>
    </div>
  );
};
