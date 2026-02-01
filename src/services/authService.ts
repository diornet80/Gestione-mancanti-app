import { supabase } from './supabase';
import { User } from '../types';

export const AuthService = {
    async login(username: string, password: string): Promise<User | null> {
        const { data, error } = await supabase
            .from('app_users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();

        if (error || !data) return null;
        return data as User;
    },

    async getUsers(): Promise<User[]> {
        const { data, error } = await supabase
            .from('app_users')
            .select('*')
            .order('username');

        if (error) throw error;
        return data as User[];
    },

    async createUser(user: Omit<User, 'id'>): Promise<void> {
        const { error } = await supabase.from('app_users').insert([{
            username: user.username.trim().toLowerCase(),
            password: user.password.trim(),
            role: user.role
        }]);
        if (error) throw error;
    },

    async updateUser(username: string, updates: Partial<User>): Promise<void> {
        const { error } = await supabase
            .from('app_users')
            .update(updates)
            .eq('username', username);
        if (error) throw error;
    },

    async deleteUser(username: string): Promise<void> {
        const { error } = await supabase.from('app_users').delete().eq('username', username);
        if (error) throw error;
    }
};
