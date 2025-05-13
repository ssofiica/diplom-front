import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  exp: number;       // Время истечения (timestamp в секундах)
  iat: number;       // Время выдачи
  id: string;       // ID пользователя
  email: string;    // Дополнительные поля
  name: string;
  [key: string]: any; // Для остальных возможных полей
}

export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('token');
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp < currentTime) {
      console.warn('Token expired');
      return false;
    }

    if (!decoded.user.ID || !decoded.user.Name || !decoded.user.Email) {
      console.warn('Invalid token payload');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Invalid token format', error);
    return false;
  }
};

export const getTokenData = (token: string): any => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Failed to decode token', error);
    return null;
  }
};

export const checkAuth = () => {
  const token = getTokenFromStorage();
  
  if (!token) {
    return {
      isAuthenticated: false,
      userData: null,
      token: null
    };
  }
  
  const isValid = isTokenValid(token);
  const userData = isValid ? getTokenData(token) : null;
  console.log(userData)
  
  return {
    isAuthenticated: isValid,
    data: userData.user,
    token: isValid ? token : null
  };
};

export const initAuth = () => {
  const { isAuthenticated, token } = checkAuth();
  
  if (!isAuthenticated && token) {
    // Удаляем невалидный токен
    localStorage.removeItem('token');
  }
  
  return isAuthenticated;
};