
export interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dob: Date;
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