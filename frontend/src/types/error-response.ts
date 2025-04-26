export type ErrorResponse = {
  success: boolean;
  errors: Array<{
    code: string;
    message: string;
    stack?: string;
  }>
}