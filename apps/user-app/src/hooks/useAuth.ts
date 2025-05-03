// import { useSetRecoilState } from "recoil";
// import { userAtom } from "../atoms/authAtoms";
// import axios from "axios";
// import { BACKEND_URL } from "../config";
// import { User } from "../types/types";
// import { SignupType } from "@repo/repo-config/sharedType";


// export function useAuth() {
//     const setUser = useSetRecoilState(userAtom);
  
//     const signIn = async (postInputs: SignupType, type: string) => {
//       const res = await axios.post(`${BACKEND_URL}/api/v1/user/${type}`,postInputs,{
//         withCredentials: true
//       });
//       console.log(`response of ${type} = ${res.data}`);
//     const user: User = {
//         email: res.data.email,
//         name:res.data.name,
//         id: res.data.id,
        
//      }
//      console.log('user after signin: ', user);
//       setUser(user);
//     };
  
//     const signOut = () => {
//       setUser(null);
//     };

//     return { signIn, signOut };
//   }