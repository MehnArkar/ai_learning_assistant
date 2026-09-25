import type { ReactNode } from "react";
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLElement>{
    variant?:'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    loading?:boolean
    children: ReactNode
}

const Button = ({variant='primary', size = 'md', loading, children, className = '', disabled, ...props }:ButtonProps) => {

    const base = 'inline-flex item-center justify-center gap-2 font-medium rounded-xl transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus:ring-offset-2 focus:ring-[#00B86B]';
    const variants = { 
        primary: 'brand-gradient text-white hover:opacithy-90 active:scale-[0.98] shadow-sm shadow-[#00B86B]/20',
        secondary: 'brand-gradient-soft text-[#007a53] hover:opacity-90 active:scale-[0.98]',
        outline: 'border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 active:scale-[0.98]',
        danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]',
        ghost: 'text-slate-600 hover:bg-slate-100 active:scale-[0.98]',
    };
    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      }

    return <button
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading }
        {...props}
    >
     {loading && <Loader2 size={16} className="animate-spin" />}
     {children}  
    </button>
};


export default Button