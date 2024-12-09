import {AxiosError} from 'axios';

export type ResponseError = {
  message?: string;
  error: {
    code?: number;
    message?: string;
    name?: string;
  };
};

function apiError(err: Error) {
  const {response} = err as AxiosError<ResponseError>;
  const error = response?.data;
  console.log("error", error)
  return error ? error.message : 'Something went wrong';
}

export default apiError;
