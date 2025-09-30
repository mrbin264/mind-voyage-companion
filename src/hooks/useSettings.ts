import { useState, useEffect, useCallback } from 'react'
import type {
  UserSettings,
  UserProfile,
  NotificationSettings,
  PrivacySettings,
  UserPreferences,
  SecuritySettings,
  AccountStatistics,
  SettingsSection,
  ProfileFormData,
  SettingsFormState,
  PasswordChangeData,
} from '@/types/settings'

interface UseSettingsReturn {
  // Data
  settings: UserSettings | null
  profile: UserProfile | null
  statistics: AccountStatistics | null

  // Loading states
  loading: boolean
  saving: boolean

  // Error state
  error: string | null

  // Actions
  fetchSettings: (section?: SettingsSection) => Promise<void>
  updateProfile: (data: Partial<ProfileFormData>) => Promise<void>
  updateNotifications: (data: Partial<NotificationSettings>) => Promise<void>
  updatePrivacy: (data: Partial<PrivacySettings>) => Promise<void>
  updatePreferences: (data: Partial<UserPreferences>) => Promise<void>
  uploadProfilePhoto: (file: File) => Promise<void>
  changePassword: (data: PasswordChangeData) => Promise<void>
  refreshData: () => Promise<void>
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [statistics, setStatistics] = useState<AccountStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async (section?: SettingsSection) => {
    try {
      setLoading(true)
      setError(null)

      const url = section ? `/api/settings?section=${section}` : '/api/settings'

      const response = await fetch(url)
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch settings')
      }

      if (section === 'profile') {
        setProfile(result.data)
      } else if (section === 'statistics') {
        setStatistics(result.data)
      } else {
        setSettings(result.data)
        setProfile(result.data.profile)
        setStatistics(result.data.statistics)
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Settings fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(
    async (data: Partial<ProfileFormData>) => {
      try {
        setSaving(true)
        setError(null)

        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            section: 'profile',
            data,
          }),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to update profile')
        }

        setProfile(result.data)

        // Update settings if available
        if (settings) {
          setSettings({
            ...settings,
            profile: result.data,
          })
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update profile'
        setError(errorMessage)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [settings]
  )

  const updateNotifications = useCallback(
    async (data: Partial<NotificationSettings>) => {
      try {
        setSaving(true)
        setError(null)

        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            section: 'notifications',
            data,
          }),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to update notifications')
        }

        // Update settings if available
        if (settings) {
          setSettings({
            ...settings,
            notifications: result.data,
          })
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update notifications'
        setError(errorMessage)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [settings]
  )

  const updatePrivacy = useCallback(
    async (data: Partial<PrivacySettings>) => {
      try {
        setSaving(true)
        setError(null)

        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            section: 'privacy',
            data,
          }),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to update privacy settings')
        }

        // Update settings if available
        if (settings) {
          setSettings({
            ...settings,
            privacy: result.data,
          })
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to update privacy settings'
        setError(errorMessage)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [settings]
  )

  const updatePreferences = useCallback(
    async (data: Partial<UserPreferences>) => {
      try {
        setSaving(true)
        setError(null)

        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            section: 'preferences',
            data,
          }),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to update preferences')
        }

        // Update settings if available
        if (settings) {
          setSettings({
            ...settings,
            preferences: result.data,
          })
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update preferences'
        setError(errorMessage)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [settings]
  )

  const uploadProfilePhoto = useCallback(
    async (file: File) => {
      try {
        setSaving(true)
        setError(null)

        // Create form data for file upload
        const formData = new FormData()
        formData.append('photo', file)

        const response = await fetch('/api/settings/profile-photo', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to upload photo')
        }

        // Update profile with new photo URL
        if (profile) {
          const updatedProfile = {
            ...profile,
            profilePhoto: result.data.photoUrl,
          }
          setProfile(updatedProfile)

          if (settings) {
            setSettings({
              ...settings,
              profile: updatedProfile,
            })
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to upload photo'
        setError(errorMessage)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [profile, settings]
  )

  const changePassword = useCallback(async (data: PasswordChangeData) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch('/api/settings/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to change password')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to change password'
      setError(errorMessage)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const refreshData = useCallback(async () => {
    await fetchSettings()
  }, [fetchSettings])

  // Load settings on mount
  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return {
    settings,
    profile,
    statistics,
    loading,
    saving,
    error,
    fetchSettings,
    updateProfile,
    updateNotifications,
    updatePrivacy,
    updatePreferences,
    uploadProfilePhoto,
    changePassword,
    refreshData,
  }
}

// Form-specific hooks for different settings sections
interface UseProfileFormReturn {
  formData: ProfileFormData
  setFormData: (data: ProfileFormData) => void
  updateField: (field: keyof ProfileFormData, value: any) => void
  isDirty: boolean
  reset: () => void
  submit: () => Promise<void>
  loading: boolean
  error: string | null
}

export function useProfileForm(
  initialData?: UserProfile
): UseProfileFormReturn {
  const { updateProfile, saving, error } = useSettings()

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    avatar: initialData?.profilePhoto || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    bio: initialData?.bio || '', // Changed from aboutMe to bio
    location: initialData?.location || '',
    timezone: initialData?.timezone || '(GMT-8) Pacific Time',
    language: initialData?.language || 'en-US',
    website: initialData?.website || '',
    socialLinks: initialData?.socialLinks || {},
  })

  const [initialFormData] = useState(formData)
  const [isDirty, setIsDirty] = useState(false)

  const updateField = useCallback(
    (field: keyof ProfileFormData, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      setIsDirty(true)
    },
    []
  )

  const reset = useCallback(() => {
    setFormData(initialFormData)
    setIsDirty(false)
  }, [initialFormData])

  const submit = useCallback(async () => {
    if (!isDirty) return

    await updateProfile(formData)
    setIsDirty(false)
  }, [formData, isDirty, updateProfile])

  // Update form data when initial data changes
  useEffect(() => {
    if (initialData) {
      const newFormData: ProfileFormData = {
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        avatar: initialData.profilePhoto || '',
        dateOfBirth: initialData.dateOfBirth || '',
        bio: initialData.bio || '', // Changed from aboutMe to bio
        location: initialData.location || '',
        timezone: initialData.timezone || '(GMT-8) Pacific Time',
        language: initialData.language || 'en-US',
        website: initialData.website || '',
        socialLinks: initialData.socialLinks || {},
      }
      setFormData(newFormData)
      setIsDirty(false)
    }
  }, [initialData])

  return {
    formData,
    setFormData,
    updateField,
    isDirty,
    reset,
    submit,
    loading: saving,
    error,
  }
}

// Timezone and Language options for form selects
export const timezoneOptions = [
  {
    value: '(GMT-12) International Date Line West',
    label: '(GMT-12) International Date Line West',
    offset: '-12:00',
  },
  {
    value: '(GMT-11) Coordinated Universal Time-11',
    label: '(GMT-11) Coordinated Universal Time-11',
    offset: '-11:00',
  },
  { value: '(GMT-10) Hawaii', label: '(GMT-10) Hawaii', offset: '-10:00' },
  { value: '(GMT-9) Alaska', label: '(GMT-9) Alaska', offset: '-09:00' },
  {
    value: '(GMT-8) Pacific Time',
    label: '(GMT-8) Pacific Time (US & Canada)',
    offset: '-08:00',
  },
  {
    value: '(GMT-7) Mountain Time',
    label: '(GMT-7) Mountain Time (US & Canada)',
    offset: '-07:00',
  },
  {
    value: '(GMT-6) Central Time',
    label: '(GMT-6) Central Time (US & Canada)',
    offset: '-06:00',
  },
  {
    value: '(GMT-5) Eastern Time',
    label: '(GMT-5) Eastern Time (US & Canada)',
    offset: '-05:00',
  },
  {
    value: '(GMT-4) Atlantic Time',
    label: '(GMT-4) Atlantic Time (Canada)',
    offset: '-04:00',
  },
  { value: '(GMT-3) Brasilia', label: '(GMT-3) Brasilia', offset: '-03:00' },
  {
    value: '(GMT-2) Coordinated Universal Time-02',
    label: '(GMT-2) Coordinated Universal Time-02',
    offset: '-02:00',
  },
  { value: '(GMT-1) Azores', label: '(GMT-1) Azores', offset: '-01:00' },
  {
    value: '(GMT) Greenwich Mean Time',
    label: '(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London',
    offset: '+00:00',
  },
  {
    value: '(GMT+1) Central European Time',
    label: '(GMT+1) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
    offset: '+01:00',
  },
  {
    value: '(GMT+2) Eastern European Time',
    label: '(GMT+2) Athens, Bucharest, Cairo, Helsinki, Kiev',
    offset: '+02:00',
  },
  {
    value: '(GMT+3) Moscow Time',
    label: '(GMT+3) Baghdad, Kuwait, Riyadh, Moscow, St. Petersburg',
    offset: '+03:00',
  },
  {
    value: '(GMT+4) Gulf Standard Time',
    label: '(GMT+4) Abu Dhabi, Muscat, Baku, Tbilisi, Yerevan',
    offset: '+04:00',
  },
  {
    value: '(GMT+5) Pakistan Standard Time',
    label: '(GMT+5) Islamabad, Karachi, Tashkent',
    offset: '+05:00',
  },
  {
    value: '(GMT+6) Bangladesh Standard Time',
    label: '(GMT+6) Astana, Dhaka, Almaty, Novosibirsk',
    offset: '+06:00',
  },
  {
    value: '(GMT+7) Indochina Time',
    label: '(GMT+7) Bangkok, Hanoi, Jakarta, Krasnoyarsk',
    offset: '+07:00',
  },
  {
    value: '(GMT+8) China Standard Time',
    label: '(GMT+8) Beijing, Chongqing, Hong Kong, Urumqi',
    offset: '+08:00',
  },
  {
    value: '(GMT+9) Japan Standard Time',
    label: '(GMT+9) Osaka, Sapporo, Tokyo, Seoul, Yakutsk',
    offset: '+09:00',
  },
  {
    value: '(GMT+10) Australian Eastern Time',
    label: '(GMT+10) Canberra, Melbourne, Sydney, Brisbane',
    offset: '+10:00',
  },
  {
    value: '(GMT+11) Solomon Islands Time',
    label: '(GMT+11) Magadan, Solomon Is., New Caledonia',
    offset: '+11:00',
  },
  {
    value: '(GMT+12) New Zealand Time',
    label: '(GMT+12) Auckland, Wellington, Fiji, Kamchatka',
    offset: '+12:00',
  },
]

export const languageOptions = [
  { value: 'en-US', label: 'English (US)', code: 'en' },
  { value: 'en-GB', label: 'English (UK)', code: 'en' },
  { value: 'es-ES', label: 'Español (España)', code: 'es' },
  { value: 'es-MX', label: 'Español (México)', code: 'es' },
  { value: 'fr-FR', label: 'Français', code: 'fr' },
  { value: 'de-DE', label: 'Deutsch', code: 'de' },
  { value: 'it-IT', label: 'Italiano', code: 'it' },
  { value: 'pt-BR', label: 'Português (Brasil)', code: 'pt' },
  { value: 'pt-PT', label: 'Português (Portugal)', code: 'pt' },
  { value: 'ja-JP', label: '日本語', code: 'ja' },
  { value: 'ko-KR', label: '한국어', code: 'ko' },
  { value: 'zh-CN', label: '中文 (简体)', code: 'zh' },
  { value: 'zh-TW', label: '中文 (繁體)', code: 'zh' },
  { value: 'ru-RU', label: 'Русский', code: 'ru' },
  { value: 'ar-SA', label: 'العربية', code: 'ar' },
  { value: 'hi-IN', label: 'हिन्दी', code: 'hi' },
]
