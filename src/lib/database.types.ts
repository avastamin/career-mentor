export interface Database {
  public: {
    Tables: {
      career_analyses: {
        Row: {
          id: string;
          user_id: string;
          profile: {
            currentRole: string;
            desiredRole: string;
            yearsExperience: number;
            education: string;
            skills: string[];
            interests: string[];
            industryPreference: string;
          };
          analysis_results: {
            careerPath: string;
            skillGaps: string[];
            recommendations: {
              immediate: string[];
              shortTerm: string[];
              longTerm: string[];
            };
            potentialRoles: string[];
            learningResources: {
              title: string;
              type: string;
              url: string;
              priority: string;
            }[];
            progressLevel?: string;
          };
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['career_analyses']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['career_analyses']['Insert']>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: unknown;
    };
  };
}