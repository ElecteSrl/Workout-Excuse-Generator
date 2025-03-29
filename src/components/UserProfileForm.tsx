import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Globe, Bell, Eye, EyeOff, Upload, X } from 'lucide-react';
import Select from 'react-select';
import { z } from 'zod';
import { supabase } from '../lib/supabase';

// Validation schemas
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username cannot exceed 20 characters')
  .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character');

const emailSchema = z
  .string()
  .email('Please enter a valid email address');

const displayNameSchema = z
  .string()
  .min(1, 'Display name is required')
  .max(30, 'Display name cannot exceed 30 characters');

// Available options
const timeZones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'ja', label: 'Japanese' },
];

interface FormData {
  username: string;
  password: string;
  email: string;
  displayName: string;
  profilePicture: File | null;
  timeZone: string;
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
  };
  privacy: 'public' | 'private';
}

interface ValidationErrors {
  [key: string]: string;
}

interface UserProfileFormProps {
  onClose: () => void;
}

export function UserProfileForm({ onClose }: UserProfileFormProps) {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    email: '',
    displayName: '',
    profilePicture: null,
    timeZone: 'UTC',
    language: 'en',
    notifications: {
      email: true,
      sms: false,
    },
    privacy: 'public',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    try {
      usernameSchema.parse(formData.username);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.username = error.errors[0].message;
      }
    }

    try {
      passwordSchema.parse(formData.password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.password = error.errors[0].message;
      }
    }

    try {
      emailSchema.parse(formData.email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.email = error.errors[0].message;
      }
    }

    try {
      displayNameSchema.parse(formData.displayName);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.displayName = error.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'File size must not exceed 5MB',
        }));
        return;
      }

      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          profilePicture: 'Only JPG and PNG files are allowed',
        }));
        return;
      }

      setFormData(prev => ({ ...prev, profilePicture: file }));
      setPreviewUrl(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, profilePicture: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Upload profile picture if provided
        let profilePictureUrl = '';
        if (formData.profilePicture) {
          const fileExt = formData.profilePicture.name.split('.').pop();
          const fileName = `${authData.user.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('profile-pictures')
            .upload(fileName, formData.profilePicture);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('profile-pictures')
            .getPublicUrl(fileName);

          profilePictureUrl = publicUrl;
        }

        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              username: formData.username,
              display_name: formData.displayName,
              avatar_url: profilePictureUrl,
              timezone: formData.timeZone,
              language: formData.language,
              notification_preferences: formData.notifications,
              privacy_setting: formData.privacy,
            },
          ]);

        if (profileError) throw profileError;

        // Success! Close the form
        onClose();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to create profile. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
            <User className="h-6 w-6 text-orange-500" />
            Create Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="input"
              placeholder="johndoe123"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="input pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="input"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Display Name *
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              className="input"
              placeholder="John Doe"
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-600">{errors.displayName}</p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl('');
                      setFormData(prev => ({ ...prev, profilePicture: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Upload className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Upload Photo</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png"
                  className="hidden"
                />
              </label>
            </div>
            {errors.profilePicture && (
              <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>
            )}
          </div>

          {/* Time Zone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Zone *
            </label>
            <Select
              options={timeZones}
              value={timeZones.find(tz => tz.value === formData.timeZone)}
              onChange={(option) => option && setFormData(prev => ({ ...prev, timeZone: option.value }))}
              className="react-select-container"
              classNamePrefix="react-select"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: '#f97316',
                  primary25: '#fed7aa',
                },
              })}
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language *
            </label>
            <Select
              options={languages}
              value={languages.find(lang => lang.value === formData.language)}
              onChange={(option) => option && setFormData(prev => ({ ...prev, language: option.value }))}
              className="react-select-container"
              classNamePrefix="react-select"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: '#f97316',
                  primary25: '#fed7aa',
                },
              })}
            />
          </div>

          {/* Notification Preferences */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notification Preferences
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.notifications.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: e.target.checked }
                  }))}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Email notifications</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.notifications.sms}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, sms: e.target.checked }
                  }))}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">SMS notifications</span>
              </label>
            </div>
          </div>

          {/* Account Privacy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Account Privacy
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.privacy === 'public'}
                  onChange={() => setFormData(prev => ({ ...prev, privacy: 'public' }))}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Public</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.privacy === 'private'}
                  onChange={() => setFormData(prev => ({ ...prev, privacy: 'private' }))}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Private</span>
              </label>
            </div>
          </div>

          {errors.submit && (
            <p className="mt-1 text-sm text-red-600">{errors.submit}</p>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="ml-2">Creating Profile...</span>
                </div>
              ) : (
                'Create Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}