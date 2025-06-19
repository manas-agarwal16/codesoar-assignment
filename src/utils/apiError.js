class ApiError {
    constructor(statusCode , message = "error"){
        this.status = statusCode,
        this.message = message;
        this.success = statusCode < 400;
    }
}
export {ApiError};
