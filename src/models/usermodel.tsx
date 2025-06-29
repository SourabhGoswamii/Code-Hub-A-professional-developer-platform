import mongoose, { ObjectId } from 'mongoose';

export interface User {
    username: string;
    email: string;
    password: string;
    isVerified: boolean; // Email verification status

    code: string;              // Verification code for email confirmation
    codeexpires: Date;         // Expiration date for verification code

    name?: string;              // Full name
    bio?: string;               // Short about me
    avatarUrl?: string;         // Profile image URL
    location?: string;          // City, country
    website?: string;           // Personal or project site

    karma: number;
    xp: number;              // Points earned from challenges, posts, votes
    badges: string[];           // e.g., ["early_adopter", "top_coder"]
    followers: mongoose.Types.ObjectId[];      // Users who follow this user
    following: mongoose.Types.ObjectId[];      // Users this user follows

    joinedChallenges: ObjectId[];   // Challenges the user joined
    createdChallenges: ObjectId[];  // Challenges the user created
    teams: ObjectId[];              // Teams the user is part of
    
    posts: ObjectId[];              // Community posts authored by user
    comments: ObjectId[];           // Comments authored by user

    notifications: {
    type: string;                 // e.g., "comment", "follow", "challenge_invite"
    message: string;
    read: boolean;
    createdAt: Date;
  }[];

    createdAt: Date;
    updatedAt: Date;
}


export const userSchema = new mongoose.Schema<User>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // Email verification status
    
    code: { type: String, default: '' },
    codeexpires:{ type: Date, default: Date.now }, // Expiration date for verification code
    
    name: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    
    karma: { type: Number, default: 0 },
    xp: { type: Number, default: 0 }, // Optional: XP for leveling up
    badges: { type: [String], default: [] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    
    joinedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
    createdChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }],
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
    
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    notifications: [{
        type: { type: String, required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
}, {
    timestamps: true,
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema);
export default UserModel;