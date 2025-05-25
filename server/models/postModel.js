const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxlength: 2200,
    },
    images: [
      {
        type: String,
      },
    ],
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    location: {
      type: String,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  },
)

// Virtual for like count
postSchema.virtual("likesCount").get(function () {
  return this.likes.length
})

// Virtual for comments count
postSchema.virtual("commentsCount").get(function () {
  return this.comments.length
})

module.exports = mongoose.model("Post", postSchema)
