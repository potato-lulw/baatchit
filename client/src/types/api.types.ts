export type ApiReponse<T> = {
    status?: "success" | "error",
    message: string,
    data: T
}

