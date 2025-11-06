import { API } from '@/lib/axios-client';
import type { ApiReponse } from '@/types/api.types';
import type { LoginType, RegisterType, UserType } from '@/types/auth.types';
import { toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSocket } from './use-socket';

interface AuthState {
    user: UserType | null;
    isLoggingIn: boolean;
    isSigningUp: boolean;
    isAuthStatusLoading: boolean;

    register: (data: RegisterType) => void;
    login: (data: LoginType) => void;
    logout: () => void;
    isAuthStatus: () => void;
}


export const useAuth = create<AuthState>()(
    persist(
        (set) => (
            {
                user: null,
                isLoggingIn: false,
                isSigningUp: false,
                isAuthStatusLoading: false,
                register: async (data: RegisterType) => {
                    set({ isSigningUp: true });
                    try {
                        const response = await API.post<ApiReponse<UserType>>('/auth/register', data);
                        set({ user: response.data.data });
                        useSocket.getState().connectSocket();
                        toast.success(response.data.message);
                    } catch (error: any) {
                        console.log(error)
                        toast.error(error.response.data.message || error.message);
                    } finally {
                        set({ isSigningUp: false });
                    }
                },
                login: async (data: LoginType) => {
                    set({ isLoggingIn: true });
                    try {
                        const response = await API.post<ApiReponse<UserType>>('/auth/login', data);
                        set({ user: response.data.data });
                        useSocket.getState().connectSocket();
                        toast.success(response.data.message);
                    } catch (error: any) {
                        console.log(error)
                        toast.error(error.response.data.message || error.message);
                    } finally {
                        set({ isLoggingIn: false });
                    }
                },
                logout: async () => {
                    try {
                        set({ user: null });
                        await API.post('/auth/logout');
                        useSocket.getState().disconnectSocket();
                    } catch (error: any) {
                        console.log(error)
                        toast.error(error.response.data.message || error.message);
                    }
                },
                isAuthStatus: async () => {
                    set({ isAuthStatusLoading: true });
                    try {
                        const response = await API.get<ApiReponse<UserType>>('/auth/status');
                        set({ user: response.data.data });
                        useSocket.getState().connectSocket();
                    } catch (error: any) {
                        console.log(error)
                        toast.error(error.response.data.message || error.message);
                    } finally {
                        set({ isAuthStatusLoading: false });
                    }
                }
            }
        ),
        {
            name: "baatchit:root"
        }
    )
);


