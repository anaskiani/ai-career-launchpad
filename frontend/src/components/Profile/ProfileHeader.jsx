import { AvatarUpload } from './AvatarUpload';
import { MapPin, Target, Mail } from 'lucide-react';

export const ProfileHeader = ({ profile }) => {
  if (!profile) return null;

  const completion = profile.profileCompletion || 0;

  const getCompletionColor = (pct) => {
    if (pct >= 80) return 'from-emerald-500 to-green-400';
    if (pct >= 50) return 'from-amber-500 to-yellow-400';
    return 'from-red-500 to-orange-400';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Banner gradient */}
      <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC04aDR2MWgtNHYtMXptMTYgMTZoNHYxaC00di0xem0wLThoNHYxaC00di0xem0tMTYtMTZoNHYxaC00di0xem0xNiAwaDR2MWgtNHYtMXoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      </div>

      {/* Profile info */}
      <div className="px-8 pb-6">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
          <AvatarUpload profileImage={profile.profileImage} />

          <div className="flex-1 text-center md:text-left md:pb-2">
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Mail size={14} /> {profile.email}
              </span>
              {profile.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} /> {profile.location}
                </span>
              )}
              {profile.targetRole && (
                <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                  <Target size={14} /> {profile.targetRole}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Completion bar */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Profile Completion</span>
            <span className="text-sm font-bold text-gray-900">{completion}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getCompletionColor(completion)} transition-all duration-700 ease-out`}
              style={{ width: `${completion}%` }}
            />
          </div>
          {completion < 100 && (
            <p className="text-xs text-gray-400 mt-2">
              Complete your profile to improve AI recommendations
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
