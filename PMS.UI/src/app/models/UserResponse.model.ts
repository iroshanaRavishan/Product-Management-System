export interface UserResponse {
    Message: string,
    IsSuccess: boolean,
    Errors: string[],
    ExpireDate: Date | null,
}