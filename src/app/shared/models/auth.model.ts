export interface RequestTokenResponse {
    success: boolean;
    request_token: string;
    expires_at: string;
}

export interface SessionResponse {
    success: boolean;
    session_id: string;
}

export interface UserInfo {
    name: string;
    username: string;
    avatar_path: string | null;
}
