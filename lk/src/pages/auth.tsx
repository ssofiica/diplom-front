import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {url} from '../const/const'
import Button from '../components/button/button';
import { jwtDecode } from 'jwt-decode';
import './css/auth.css'

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pageIn, setPageIn] = useState<boolean>(true)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate(-1);
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/signup', userData);
      
      if (response.status === 200){
        const authHeader = response.headers['authorization'];
        console.log(authHeader)
        const token = authHeader?.split(' ')[1];
        console.log(token)
        if (!token) {
            throw new Error('No token received');
        }
        const decoded = jwtDecode(token); // Декодируем токен
        console.log(JSON.stringify(decoded))
        localStorage.setItem('userData', JSON.stringify(decoded));
        localStorage.setItem('token', token);
        navigate("/menu");
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/signin', userData);
      
      if (response.status === 200){
        const authHeader = response.headers['authorization'];
        console.log(authHeader)
        const token = authHeader?.split(' ')[1];
        console.log(token)
        if (!token) {
            throw new Error('No token received');
        }
        const decoded = jwtDecode(token); // Декодируем токен
        console.log(JSON.stringify(decoded))
        localStorage.setItem('userData', JSON.stringify(decoded));
        localStorage.setItem('token', token);
        navigate("/menu");
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth">      
          {pageIn ?
            <p className="auth-title">Вход в личный кабинет</p>
          : <>
          <p className="auth-title">Регистрация ресторана</p>
          {/* <label htmlFor="name">Имя</label> */}
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Название ресторана"
            value={userData.name}
            onChange={handleChange}
          />
          </>}
          {/* <label htmlFor="email">Email</label> */}
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
          />
          {/* <label htmlFor="password">Password</label> */}
          <input
            id="password"
            name="password"
            type="password"
            maxLength={10}
            required
            placeholder="Пароль"
            value={userData.password}
            onChange={handleChange}
          />
        {pageIn ? <>
            <Button style={{marginTop: '14px', backgroundColor: '#222', color: '#fff'}} onClick={handleSignIn}>Войти</Button>
            <p style={{cursor: 'pointer', marginTop: '5px'}} onClick={()=> setPageIn(false)}>Зарегистрироваться</p>
           </>
         : <>
            <Button style={{marginTop: '14px', backgroundColor: '#222', color: '#fff'}} onClick={handleSignup}>Зарегистрироваться</Button>
            <p style={{cursor: 'pointer', marginTop: '5px'}} onClick={()=> setPageIn(true)}>Авторизоваться</p>
        </>}
    </div>
  );
};

export default AuthPage;