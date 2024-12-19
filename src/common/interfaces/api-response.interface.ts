export interface ApiResponse<T> {
    status: string; // "success" or "error"
    data?: T;
    error?: string;
}
