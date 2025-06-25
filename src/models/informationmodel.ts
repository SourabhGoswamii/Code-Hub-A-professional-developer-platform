import UserModel from "./usermodel";
import mongoose, { Schema } from "mongoose";

export interface projects {
  title: string;
  description: string;
  githubLink: string;
  liveLink: string;
  technologies: string[];
}

const projectsSchema = new Schema<projects>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    githubLink: { type: String, required: true },
    liveLink: { type: String, required: true },
    technologies: { type: [String], required: true },
  },
  { timestamps: true }
);

export interface Information {
  userId: mongoose.Types.ObjectId;
  username: string;
  role: { role: string; institude?: string; year?: string; branch?: string };
  about: string;
  technologies: string[];
  location: [];
  socialLinks: {
    github?: string;
    linkedin?: string;
    website?: string;
    twitter?: string;
  };
  projects: projects[];
}

const InformationSchema = new Schema<Information>(
  {
    userId: { type: Schema.Types.ObjectId, ref: UserModel, required: true },
    username: { type: String, required: true },
    role: {
      role: { type: String, required: true },
      institude: { type: String, required: false },
      year: { type: String, required: false },
      branch: { type: String, required: false },
    },
    about: { type: String, required: true },
    technologies: { type: [String], required: true },
    location: { type: [String], required: false },
    socialLinks: {
      github: { type: String, required: false },
      linkedin: { type: String, required: false },
      website: { type: String, required: false },
      twitter: { type: String, required: false },
    },
    projects: { type: [projectsSchema], required: false },
  },
  { timestamps: true }
);
const InformationModel =
  mongoose.models.Information ||
  mongoose.model<Information>("Information", InformationSchema);

export default InformationModel;



// Export the Information model for use in other parts of the application
// This model represents user profiles with their personal information, skills, and projects
// The model is created only if it doesn't already exist in the mongoose models collection