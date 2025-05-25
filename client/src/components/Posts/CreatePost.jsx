"use client"

import { useState, useRef } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { postsAPI } from "../../services/api"
import { Camera, X, User, MapPin } from "lucide-react"
import toast from "react-hot-toast"
import LoadingSpinner from "../UI/LoadingSpinner"

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [selectedImages, setSelectedImages] = useState([])
  const [isPosting, setIsPosting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fileInputRef = useRef(null)
  const { user } = useAuth()

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + selectedImages.length > 5) {
      toast.error("You can only upload up to 5 images")
      return
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setSelectedImages((prev) => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    setSelectedImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim() && selectedImages.length === 0) {
      toast.error("Please add some content or images")
      return
    }

    setIsPosting(true)

    try {
      const formData = new FormData()
      formData.append("content", content.trim())
      if (location.trim()) {
        formData.append("location", location.trim())
      }

      selectedImages.forEach((image) => {
        formData.append("images", image.file)
      })

      const response = await postsAPI.createPost(formData)
      onPostCreated(response.data.post)

      // Reset form
      setContent("")
      setLocation("")
      setSelectedImages([])
      setShowForm(false)

      toast.success("Post created successfully!")
    } catch (error) {
      toast.error("Failed to create post")
    } finally {
      setIsPosting(false)
    }
  }

  const handleCancel = () => {
    setContent("")
    setLocation("")
    setSelectedImages([])
    setShowForm(false)
  }

  return (
    <div className="card shadow-soft-lg">
      <div className="p-4">
        {!showForm ? (
          <div className="flex items-center space-x-3">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture || "/placeholder.svg"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-primary-200 transition-all duration-200"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center ring-2 ring-transparent hover:ring-primary-200 transition-all duration-200">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              What's on your mind, {user?.fullName?.split(" ")[0]}?
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Info */}
            <div className="flex items-center space-x-3">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture || "/placeholder.svg"}
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">{user?.fullName}</p>
                <p className="text-sm text-gray-500">@{user?.username}</p>
              </div>
            </div>

            {/* Content Textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              className="input-primary resize-none"
              rows={3}
              maxLength={2200}
              autoFocus
            />

            {/* Location Input */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location (optional)"
                className="input-primary pl-10"
                maxLength={100}
              />
            </div>

            {/* Selected Images */}
            {selectedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview || "/placeholder.svg"}
                      alt={`Selected ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-sm font-medium">Photo</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button type="button" onClick={handleCancel} className="btn-ghost">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPosting || (!content.trim() && selectedImages.length === 0)}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isPosting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Posting...</span>
                    </>
                  ) : (
                    <span>Post</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CreatePost
