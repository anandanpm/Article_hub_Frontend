import type { ArticleData, ArticleResponse, ArticleStatsResponse, ErrorResponse, LoginData, UserData, UserLoginData } from '../entities/interface';
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

   logoutUser: async (): Promise<void> => {
    try {
      let result = await axiosInstance.post('/logout'); 
      if(result){
        console.log('Logout successful');
      }
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

   getArticlesByPreferences: async (preferences: string[],userId:string) => {
    try {
      const response = await axiosInstance.post("/articles/recommendations", { preferences,userId })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>
      throw axiosError.response?.data || { message: "Network error occurred" }
    }
  },

  likeArticle: async (articleId: string,userId:string) => {
    try {
      const response = await axiosInstance.post(`/articles/${articleId}/like`,{userId})
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>
      throw axiosError.response?.data || { message: "Network error occurred" }
    }
  },

  dislikeArticle: async (articleId:string,userId:string) => {
    try {
      const response = await axiosInstance.post(`/articles/${articleId}/dislike`,{userId})
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>
      throw axiosError.response?.data || { message: "Network error occurred" }
    }
  },

  blockArticle: async (articleId: string,userId:string) => { 
    try {
      const response = await axiosInstance.post(`/articles/${articleId}/block`,{userId})
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>
      throw axiosError.response?.data || { message: "Network error occurred" }
    }
  },

  getArticle: async (userId: string): Promise<ArticleStatsResponse> => {
  try {
    const response = await axiosInstance.get<ArticleStatsResponse>(`/articles/user/${userId}`);
    console.log('Article response:', response.data);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw axiosError.response?.data || { message: "Network error occurred" };
  }
},
}



export default userApi