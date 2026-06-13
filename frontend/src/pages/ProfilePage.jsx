import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { ProfileForm } from '../components/Profile/ProfileForm';
import { useProfileStore } from '../context/profileStore';

export const ProfilePage = () => {
  const { profile } = useProfileStore();

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto w-full">
      <ProfileHeader profile={profile} />
      <div className="mt-6">
        <ProfileForm />
      </div>
    </div>
  );
};
