import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Phone, Lock, Camera, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, updateAvatar } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [className, setClassName] = useState(user?.class || '11th');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const payload = { name, phone, class: className };
    if (password) {
      payload.password = password;
    }

    const result = await updateProfile(payload);
    setLoading(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    setSuccess('');
    setUploadingAvatar(true);

    const formData = new FormData();
    formData.append('avatar', file);

    const result = await updateAvatar(formData);
    setUploadingAvatar(false);

    if (result.success) {
      setSuccess('Avatar updated successfully!');
    } else {
      setError(result.error || 'Failed to upload avatar.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">My Profile Settings</h2>
        <p className="text-sm text-slate-500">Manage your credentials, phone number, and avatar</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/30 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-100 dark:border-emerald-900/30 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{success}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-150 dark:border-slate-805">
          <div className="relative group">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-primary-500 shadow" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-550 dark:text-slate-300 font-bold text-3xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 rounded-full bg-slate-900/60 flex items-center justify-center text-white">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <label className="absolute bottom-0 right-0 p-2 rounded-full bg-primary-600 hover:bg-primary-750 text-white cursor-pointer shadow-md transform hover:scale-105 active:scale-95 transition-all">
              <Camera className="w-4.5 h-4.5" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-bold text-base text-slate-850 dark:text-slate-150">{user?.name}</h3>
            <p className="text-xs text-slate-400">Class: {user?.class || 'N/A'} • Role: {user?.role}</p>
            <p className="text-[10px] text-slate-400">Supported formats: JPG, PNG, JPEG. Max 2MB.</p>
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Phone className="w-5 h-5" />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Email (Read Only)</label>
              <input
                type="email"
                disabled
                value={user?.email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 text-slate-500 dark:text-slate-450 cursor-not-allowed"
              />
            </div>

            {user?.role === 'student' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Class / Grade</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <GraduationCap className="w-5 h-5" />
                  </span>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="9th">9th Grade</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                    <option value="B.Sc">B.Sc Physics</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-slate-150 dark:border-slate-805 pt-6 space-y-6">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password (optional)"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-805 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-350 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-805 dark:text-slate-200 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-primary-655 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-600/10 transition mt-2 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
