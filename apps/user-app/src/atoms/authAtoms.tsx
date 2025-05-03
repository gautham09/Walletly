import { atom } from "recoil";
import { User } from "../types/types";


export const userAtom = atom<User | null>({key: 'user', default: null});

