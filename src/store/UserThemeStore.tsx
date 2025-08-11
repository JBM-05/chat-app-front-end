import {create} from 'zustand';
import type { UserThemeStoreType } from '../types/UserTypesStore';
const UserThemeStore = create<UserThemeStoreType>((set) => ({
    theme:localStorage.getItem('theme') || 'light',
    setTheme: (theme: string) => {
        localStorage.setItem('theme', theme);
        set({theme});
    },
}));
export default UserThemeStore;