import { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import RestApiClient from '../services/api';

interface ApiRequestOptions {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  data?: any;
  onSuccess?: (response: any) => void;
  onError?: (error: AxiosError) => void;
  successMessage?: string;
  redirectTo?: string;
}

const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const makeRequest = async (options: ApiRequestOptions) => {
    const {
      url,
      method = 'post',
      data,
      onSuccess,
      onError,
      successMessage,
      redirectTo,
    } = options;

    setIsLoading(true);

    try {
      const response = await RestApiClient[method](url, data);

      if (successMessage) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(response.data);
      }

      if (redirectTo) {
        navigate(redirectTo);
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message || 'Error en la solicitud');
        if (onError) {
          onError(error);
        }
      } else {
        console.error('Error desconocido:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { makeRequest, isLoading };
};

export default useApiRequest;