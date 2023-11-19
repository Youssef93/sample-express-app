export interface IErrorDetails {
  errorCode?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorDetails?: IErrorDetails;

  constructor(statusCode: number, message: string, errorDetails?: IErrorDetails) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
  }
}
