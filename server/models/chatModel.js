import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const chatSchema = mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    messages: [messageSchema],
    lastMessage: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;