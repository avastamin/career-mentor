import { z } from 'zod';

export type AdminRole = 'admin';
export type UserRole = 'free' | 'pro' | 'premium' | AdminRole;

export const CareerProfileSchema = z.object({
  currentRole: z.string().min(1, "Current role is required"),
  yearsExperience: z.number().min(0, "Years of experience must be positive"),
  skills: z.union([
    z.string().min(1, "Skills are required"),
    z.array(z.string()).min(1, "At least one skill is required")
  ]),
  interests: z.union([
    z.string().min(1, "Interests are required"),
    z.array(z.string()).min(1, "At least one interest is required")
  ]),
  desiredRole: z.string().min(1, "Desired role is required"),
  education: z.string().min(1, "Education is required"),
  industryPreference: z.string().min(1, "Industry preference is required")
});

export type CareerProfile = {
  currentRole: string;
  yearsExperience: number;
  skills: string[];
  interests: string[];
  desiredRole: string;
  education: string;
  industryPreference: string;
};

export interface LearningResource {
  id: string;
  title: string;
  type: string;
  url: string;
  priority: string;
  duration: string;
  skills: string[];
  provider?: string;
  partnerInfo?: {
    name: string;
    description: string;
    banner?: string;
    location?: {
      city: string;
      state: string;
      country: string;
    };
  }[];
  description?: string;
  photoUrl?: string;
  certification?: boolean;
}

// Rest of the types remain unchanged...