import { Link } from "react-router-dom";
import { Avatar } from "./Avatar"
import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/authAtoms";
import { useEffect } from "react";

// export const Appbar = ({name}: {name: string}) => {
//     return <div className= "border-b flex justify-between px-10 py-4">
//         <Link to={"/"} className="flex flex-col justify-center">
//             <div className="cursor-pointer flex flex-col justify-center">WALLZEE</div>
//         </Link>
//         <div className="flex">
//             <Link to={"/write"}>
//                 <div className="px-5">
//                     <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">Write</button>
//                 </div>
//             </Link>
//         <Avatar name= {name} size="big"></Avatar>
//         </div>
//     </div>
// };

export const AppBar = function AppBar({name}: {name: string}) {
  
    return (
      <div className="w-full h-16 bg-gray-800 flex items-center justify-between px-6 shadow-md">
        <div className="text-white font-bold text-lg">
          Walletly
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white">
            🔔
          </button>
          <Link to="/settings">
            <Avatar name={name} size="big" />
          </Link>
        </div>
      </div>
    );
  };
  
