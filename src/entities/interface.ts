
export interface UserData {
  message?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: Date|string;
  password: string;
  articlePreferences: string[];
}

export interface LoginData {
  identifier: string;
    password: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}


export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: Date; 
  password: string;
  articlePreferences: string[];
}

export interface LoginData {
 message:string;
 user:{
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    articlePreferences: string[];
 }
}

export interface ReduxData{
  payload: any;
  user:{
    user: any;
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    articlePreferences: string[];
 }
}

export interface UserLoginData {
  identifier: string;
  password: string;
}

export interface UserState {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  articlePreferences: string[];
}

export interface AuthState {
  user: UserState | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: { message: string } | null;
  registrationSuccess: boolean;
    fieldErrors: {
    email: string | null,
    phone: string | null,
  };
}

export interface ArticleFormValues {
  title: string;
  description: string;
  category: string;
  tags: string;
  image: File | null;
}

export interface SubmitStatus {
  type: 'success' | 'error' | '';
  message: string;
}

export interface CloudinaryResponse {
  secure_url: string;
  [key: string]: any;
}


export interface ArticleData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  userId:string
}

export interface ArticleResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface ArticleDetails {
  id: string
  title: string
  imageUrl: string
  likes: number
  dislikes: number
  blocks: number
  totalReaders: number
  createdAt: string
  category: string
  tags: string[]
  description:string
}

export interface ArticleStatsResponse {
  articles: any;
  data: any;
  article: ArticleDetails
}