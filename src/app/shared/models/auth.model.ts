export interface RequestTokenResponse {
    success: boolean;
    request_token: string;
    expires_at: string;
}

export interface CreateSessionResponse {
    success: boolean;
    session_id: string;
    account: {
        id: number;
        username: string;
    };
}

export interface DeleteSessionResponse {
    success: boolean;
}
