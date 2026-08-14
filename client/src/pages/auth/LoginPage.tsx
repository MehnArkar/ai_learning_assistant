import { BrainCircuit, Mail, Lock, EyeOff, Eye } from "lucide-react"
import Input from "../../components/Input"
import { useState } from "react"
import Button from "../../components/buttom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../../api/auth";

const LoginPage = () =>{
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({ email: '', password: '', remember: false })
    const navigate = useNavigate();

    const handleChange = (field: keyof typeof form) =>(e:React.ChangeEvent<HTMLInputElement>)=>{
        setForm((prev)=>({...prev,[field]:e.target.value}))
    }

    const handleSubmit = async (e: React.SubmitEvent)=>{
        e.preventDefault();
        setError('');

        try{
            if (!form.email.trim() || !form.password) {
                setError('Email and password are required')
                return
            }

            setLoading(true);
            const res = await login(form);
            localStorage.setItem('token', res.data.token)
            navigate('/dashboard')
        }catch (e){
            if(axios.isAxiosError(e)){
                setError(e.response?.data?.message || 'Login Failed');
            } else {
                setError('Login Failed');
            }
        }finally{
            setLoading(false);
        }
    }
  

    return (
      <div className="min-h-screen flex bg-white">
        {/* Left visual panel */}
        <div className="hidden lg:flex flex-col flex-1 brand-gradient p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
  
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <BrainCircuit size={22} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl">LearnAI</span>
          </div>
  
          <div className="flex-1 flex flex-col justify-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Your AI-powered<br />study companion
            </h2>
            <p className="text-green-100 text-lg max-w-sm">
              Upload documents, generate flashcards and quizzes, and chat with AI to master any subject.
            </p>
  
            <div className="mt-12 grid grid-cols-2 gap-4">
              {[
                { label: 'Documents', value: '50K+' },
                { label: 'Flashcards', value: '2M+' },
                { label: 'Quizzes', value: '500K+' },
                { label: 'Students', value: '100K+' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-green-200 text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Right form panel */}
        <div className="flex-1 lg:max-w-md flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center">
                <BrainCircuit size={18} className="text-white" />
              </div>
              <span className="font-bold text-slate-900 text-lg">LearnAI</span>
            </div>
  
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm mb-8">Sign in to continue your learning journey</p>
  
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="alex@university.edu"
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
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange('password')}
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
  
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => setForm(prev => ({ ...prev, remember: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-[#00B86B] focus:ring-[#00B86B] accent-[#00B86B]"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button type="button" className="text-sm text-[#00B86B] hover:text-[#007a53] font-medium">
                  Forgot password?
                </button>
              </div>
              {error && <p className='text-sm text-red-500'>{error}</p>}
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
                Sign in
              </Button>
            </form>
  
            <p className="text-sm text-center text-slate-500 mt-6">
              Don&apos;t have an account?{' '}
              <button onClick={() => navigate('/register')} className="text-[#00B86B] hover:text-[#007a53] font-medium">
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    )
}

export default LoginPage