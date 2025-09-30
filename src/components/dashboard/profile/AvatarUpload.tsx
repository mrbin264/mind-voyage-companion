'use client'

import React, { useState, useRef } from 'react'
import { Camera, Upload, X } from 'lucide-react'

interface AvatarUploadProps {
  currentAvatar?: string
  userName: string
  onAvatarChange?: () => void
  disabled?: boolean
}

export function AvatarUpload({
  currentAvatar,
  userName,
  onAvatarChange,
  disabled = false,
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileSelect = (file: File) => {
    if (disabled) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    uploadAvatar(file)
  }

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true)

      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        onAvatarChange?.()
      } else {
        throw new Error('Failed to upload avatar')
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      alert('Failed to upload avatar. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const removeAvatar = async () => {
    if (disabled) return

    try {
      setUploading(true)
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE',
      })

      if (response.ok) {
        onAvatarChange?.()
      } else {
        throw new Error('Failed to remove avatar')
      }
    } catch (error) {
      console.error('Avatar removal error:', error)
      alert('Failed to remove avatar. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative">
      {/* Avatar Display */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-200 ${
          disabled
            ? 'border-gray-600 cursor-not-allowed'
            : dragOver
              ? 'border-blue-500 bg-blue-500/10 cursor-pointer'
              : 'border-gray-600 hover:border-blue-500 cursor-pointer'
        }`}
      >
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt={`${userName}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
            {getInitials(userName)}
          </div>
        )}

        {/* Upload Overlay */}
        {!disabled && (
          <div
            className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${
              dragOver || uploading
                ? 'opacity-100'
                : 'opacity-0 hover:opacity-100'
            }`}
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : dragOver ? (
              <Upload className="w-8 h-8 text-white" />
            ) : (
              <Camera className="w-8 h-8 text-white" />
            )}
          </div>
        )}
      </div>

      {/* Remove Avatar Button */}
      {currentAvatar && !disabled && !uploading && (
        <button
          onClick={e => {
            e.stopPropagation()
            removeAvatar()
          }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
          title="Remove avatar"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload Instructions */}
      {!disabled && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          {dragOver ? (
            'Drop image here'
          ) : (
            <>
              Click or drag to upload
              <br />
              Max 5MB, JPG/PNG
            </>
          )}
        </div>
      )}
    </div>
  )
}
