import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IPageVisit {
  path: string;
  title: string;
  timeSpent: number;
  timestamp: Date;
}

export interface IFeedback {
  rating: number; // 1-5 star rating
  comment?: string;
  timestamp: Date;
}

export interface IChatHistory extends Document {
  ipAddress: string;
  userAgent: string;
  messages: IChatMessage[];
  pagesVisited: IPageVisit[];
  feedback?: IFeedback[];
  firstVisit: Date;
  lastVisit: Date;
}

const ChatHistorySchema: Schema = new Schema<IChatHistory>({
  ipAddress: {
    type: String,
    required: true,
    index: true
  },
  userAgent: {
    type: String,
    required: true
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  pagesVisited: [{
    path: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    timeSpent: {
      type: Number,
      default: 0
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: [{
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  firstVisit: {
    type: Date,
    default: Date.now
  },
  lastVisit: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.ChatHistory || mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
