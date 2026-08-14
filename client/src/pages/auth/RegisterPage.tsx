import { BrainCircuit, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import Input from '../../components/Input'
import React, { useState } from 'react'
import Button from '../../components/buttom';
import { useNavigate } from 'react-router-dom'
import { register } from '../../api/auth';
import axios from 'axios';


const RegisterPage = () =>{
    const navigate = useNavigate();

    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
     
    const handleChange = (field: keyof typeof form) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm((prev)=>({...prev,[field]:e.target.value}))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if(form.password !== form.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            setLoading(true)
            const res = await register({
                name: form.name,
                email: form.email,
                password: form.password
            });

            localStorage.setItem('token', res.data.token)
            navigate('/dashboard')
        } catch(err){
            if(axios.isAxiosError(err)){
                setError(err.response?.data?.message || ' Registration failed')
            } else {
                setError('Registration failed')
            }
        } finally {
            setLoading(false)
        }
    }


    return <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 md:p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-3xl border border-slate-100 p-8">
            <div className="flex items-center gap-2 mb-8">
                <div className="w-9 h-9 flex items-center justify-center brand-gradient rounded-xl">
                    <BrainCircuit size={18} className="text-white" />
                </div>
                <span className='font-bold text-slate-900 text-lg'>AI Learning Assistant</span>
            </div>

            <h1 className='font-bold text-2xl text-slate-900 mb-1'>Create Your Account</h1>
            <p className='text-slate-500 text-sm mb-8'>Start your AI-powered learning journey today</p>

            <form className='space-y-4' onSubmit={handleSubmit}>
                <Input
                    label="Full Name"
                    type="text"
                    placeholder="Alex Johnson"
                    value={form.name}
                    onChange={handleChange('name')}
                    icon={<User size={16} />}
                />
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="denny@gmail.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    icon={<Mail size={16} />}
                />

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:border-transparent transition-all"
                        value={form.password}
                        onChange={handleChange('password')}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    </div>
                </div>
                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    icon={<Lock size={16} />}
                />
                {error && <p className='text-sm text-red-500'>{error}</p>}
                <Button
                    type='submit'
                    variant='primary'
                    className='w-full'
                    loading={loading}
                    size='lg'
                >
                   Create Account 
                </Button>
            </form>

            <p className='text-sm text-slate-500 mt-6 text-center'>
                Already have an account?{' '}
                <button 
                    className='font-medium text-[#00B86B] hover:text-[#007a53]'
                    onClick={()=>navigate('/login')}
                >
                    Sign In
                </button>
            </p>



        </div>
    </div>
}

export default RegisterPage