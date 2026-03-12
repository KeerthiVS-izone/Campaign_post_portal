export interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  role: string;
  has_details: boolean;
}

export interface UserDetail {
  id: number;
  user_id: number;
  name: string;
  phone_number: string;
  district: string;
  constituency: string;
  responsibility: string;
  created_at: string;
}

export interface Post {
  id: number;
  content: string;
  created_by: string;
  created_at: string;
}

export interface Retweet {
  id: number;
  content: string;
  created_by: string;
  created_at: string;
}

export interface UploadedPost {
  id: number;
  content: string;
  uploaded_by_admin: string;
  created_at: string;
}
