import { useState, useCallback } from 'react';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import RestApiClient from '../services/api';

interface ApiRequestOptions extends AxiosRequestConfig {
  onSuccess?: (response: any) => void;
  onError?: (error: AxiosError) => void;
  successMessage?: string;
  redirectTo?: string;
}

const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const makeRequest = useCallback(async (options: ApiRequestOptions) => {
    const {
      url,
      method = 'get',
      data,
      params,
      onSuccess,
      onError,
      successMessage,
      redirectTo,
      ...config
    } = options;

    setIsLoading(true);

    try {
      const response = await RestApiClient.request({
        url,
        method,
        data,
        params,
        ...config
      });

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
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Error en la solicitud';
        toast.error(errorMessage);
        
        if (onError) {
          onError(error);
        }
      } else {
        console.error('Error desconocido:', error);
        toast.error('Ocurrió un error inesperado');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return { makeRequest, isLoading };
};

export default useApiRequest;