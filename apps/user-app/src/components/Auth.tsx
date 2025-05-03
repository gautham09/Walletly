import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupType } from "@repo/repo-config/sharedType";
// import { useAuth } from "../hooks/useAuth";
import { useUser } from "../atoms/usecontext";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { User } from "../types/types";

export const Auth = ({type}: {type:"signin" | "signup"}) =>{
    const navigate = useNavigate();

       const { user, signIn } = useUser();  // Access the signIn function

    const [postInputs, setPostInputs] = useState<SignupType>({
        email: "",
        password: "",
        name: ""
    });

    async function sendRequest(){
      try {
        const res = await axios.post(`${BACKEND_URL}/api/v1/user/${type}`,postInputs,{
            withCredentials: true
          });
          console.log(`response of ${type} = ${res.data}`);
          
        const loggeduser: User = {
            email: res.data.email,
            name:res.data.name,
            id: res.data.id,
            
         }
         console.log(`logged in user = ${loggeduser.email}, ${loggeduser.name}, ${loggeduser.id}`);
        signIn(loggeduser);
        console.log(`user after ${type} = ${user}`);
        navigate('/');
      } catch (error) {
        alert("Error in signing up");
      }
    }

    return (
        <div className="h-screen flex justify-center">
            <div className=" flex flex-col justify-center">
                <div className="text-2xl font-extrabold text-center px-10">
                    {type == "signin"? "Log In" :"Create Account"}
                </div>
                <div className="text-slate-400 text-center">
                    {type == "signin" ? "Don't have an account?" : "Already have an account?"}
                    <Link className="pl-2 underline" to ={type=="signin"? "/signup" :"/signin"}>{type =="signin"?"SignUp" :"Login"}</Link>
                </div>
                <div className="pt-4">
               {type=="signup"? <LabelledInput label="Name" placeholder="John Doe " onChange={(e)=>{
                    setPostInputs(c =>({
                        ...c,
                        name:e.target.value
                    }))
                }}></LabelledInput>:null}
                <LabelledInput label="Username" placeholder="johnDoe@gmail.com" type="email" onChange={(e)=>{
                    setPostInputs(c =>({
                        ...c,
                        email:e.target.value
                    }))
                }}></LabelledInput>
                <LabelledInput label="Password" placeholder="password" type="password" onChange={(e)=>{
                    setPostInputs(c =>({
                        ...c,
                        password:e.target.value
                    }))
                }}></LabelledInput>
                <button onClick={sendRequest} type="button" className="mt-8 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 w-full ">{type == "signup"? "Sign Up": "Sign In"}</button>
                </div>
            </div>
        </div>
    );
};

interface LabelledInputType{
    label: string;
    placeholder: string;
    onChange : (e: ChangeEvent<HTMLInputElement>)=> void;
    type?: string;
}

function LabelledInput ({label,placeholder, onChange, type}: LabelledInputType){
    return (
        <div>
            <label  className="block mb-2 text-sm text-black font-extrabold pt-4">{label}</label>
            <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder={placeholder} required />
        </div>
    );
}