export class ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    timestamp: string;
  
    constructor(
      success: boolean,
      message: string,
      data?: T,
    ) {
      this.success = success;
      this.message = message;
      this.data = data;
      this.timestamp = new Date().toISOString();
    }
  
    // static successResponse<T>(
    //   message: string,
    //   data?: T,
    //   code: number = 200,
    // ): ApiResponse<T> {
    //   return new ApiResponse(true, code, message, data);
    // }
  }