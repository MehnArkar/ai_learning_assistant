import type { InputHTMLAttributes, ReactNode } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    label?:string,
    error?:string,
    icon?:ReactNode
} 

const Input = ({label,error,icon,className = '',...props}:InputProps)=>{
    return (
        <div className="flex flex-col gap-1.5">
          {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
          <div className="relative">
            {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
            <input
              className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:border-transparent transition-all ${icon ? 'pl-10' : ''} ${error ? 'border-red-400 focus:ring-red-400' : ''} ${className}`}
              {...props}
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )
};


export default Input;