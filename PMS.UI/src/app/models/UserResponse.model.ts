export interface UserResponse {
    message: string,
    isSuccess: boolean,
    errors: string[],
    expireDate: Date | null,
}