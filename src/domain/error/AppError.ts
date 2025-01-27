class AppError extends Error {
    public statusCode: number;
  
    constructor(statusCode: number,message: string) {
      super(message);
      this.statusCode = statusCode;
      Object.setPrototypeOf(this, new.target.prototype); 
      Error.captureStackTrace(this);
    }
  }

  export default AppError