export type ApiResponse = {
  status: 'fail' | 'success';
  data?: Record<string, string>;
  errors?: { code: number; message: string; details?: Record<string, string> };
};

export type ApiResponseGeneric<T> = {
  status: 'fail' | 'success';
  data?: T | any;
  errors?: { code: number; message: string; details?: Record<string, string> };
};

export type ApiResponseError = {
  status: 'fail';
  errors: { code: number; message: string; details?: Record<string, string> };
};
