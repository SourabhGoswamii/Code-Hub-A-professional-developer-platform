import mongoose from "mongoose";
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  profilePicture: string;

  code: number;
  codeExpires: Date;
  isverified: boolean ;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    code: { type: Number, default: 0 },
    codeExpires: { type: Date, default: null },
    isverified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema);
export default UserModel;
