export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProjectType = "video" | "web";
export type VideoProvider = "youtube" | "vimeo" | "tiktok" | "facebook" | "instagram" | "local" | "other";
export type AspectRatio = "16:9" | "9:16";

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          type: ProjectType;
          title: string;
          slug: string;
          description: string;
          client_name: string | null;
          year: string | null;
          video_url: string | null;
          video_provider: VideoProvider | null;
          video_id: string | null;
          aspect_ratio: AspectRatio;
          live_url: string | null;
          github_url: string | null;
          can_embed: boolean;
          tags: string[];
          preview_image_url: string | null;
          is_published: boolean;
          published_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: ProjectType;
          title: string;
          slug?: string;
          description?: string;
          client_name?: string | null;
          year?: string | null;
          video_url?: string | null;
          video_provider?: VideoProvider | null;
          video_id?: string | null;
          aspect_ratio?: AspectRatio;
          live_url?: string | null;
          github_url?: string | null;
          can_embed?: boolean;
          tags?: string[];
          preview_image_url?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: ProjectType;
          title?: string;
          slug?: string;
          description?: string;
          client_name?: string | null;
          year?: string | null;
          video_url?: string | null;
          video_provider?: VideoProvider | null;
          video_id?: string | null;
          aspect_ratio?: AspectRatio;
          live_url?: string | null;
          github_url?: string | null;
          can_embed?: boolean;
          tags?: string[];
          preview_image_url?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: "admin" | "superadmin";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: "admin" | "superadmin";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "admin" | "superadmin";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
