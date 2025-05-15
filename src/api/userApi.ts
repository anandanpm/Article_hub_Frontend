import type { ArticleData, ArticleResponse, ErrorResponse, LoginData, UserData, UserLoginData } from '../entities/interface';
import axiosInstance from './axiosInstance';
import { AxiosError } from 'axios';




 const userApi= {

  register: async (userData: UserData): Promise<UserData> => {
    try {
      const response = await axiosInstance.post<UserData>('/register', userData);
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data || { message: 'Network error occurred' };
    }
  },

   login: async (values:UserLoginData): Promise<LoginData> => {
    try {
        const response = await axiosInstance.post<LoginData>('/login', values);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        throw axiosError.response?.data || { message: 'Network error occurred' };
    }
   },

    createArticle: async (articleData: ArticleData): Promise<ArticleResponse> => {
    try {
      console.log('Article data:', articleData);
      const response = await axiosInstance.post<ArticleResponse>('/articles', articleData);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw axiosError.response?.data || { message: 'Network error occurred' };
    }
  },
}

export default userApi