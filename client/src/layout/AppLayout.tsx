import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, FileText, BookOpen, HelpCircle, User,
    ChevronLeft, ChevronRight, Bell, Search, LogOut, Settings,
    BrainCircuit, X, Menu,
  } from 'lucide-react'

  const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/documents', label: 'Documents', icon: FileText },
    { to: '/flashcards', label: 'Flashcards', icon: BookOpen },
    { to: '/quizzes', label: 'Quizzes', icon: HelpCircle },
    { to: '/profile', label: 'Profile', icon: User },
  ] as const
  
  const PAGE_TITLES: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/documents': 'Documents',
    '/flashcards': 'Flashcards',
    '/quizzes': 'Quizzes',
    '/profile': 'Profile',
  }

const AppLayout = ()=>{

    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [notifOpen, setNotifOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()
    const title = PAGE_TITLES[location.pathname] ?? 'Dashboard'
    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={()=> setMobileOpen(false)}
                />
            )}

            <aside 
                className={`
                    fixed lg:relative z-50 flex flex-col h-full bg-white border-r border-slate-100 transition-all duration-300
                    ${collapsed ? 'w-16' : 'w-60'}
                    ${mobileOpen ? 'translate-x-0': '-translate-x-full lg:translate-x-0'}

                    `}
            >
                {/* Logo */}   
                <div className={`flex items-center gap-3 px-3 h-16 border-b border-slate-100 ${collapsed ? 'justify-center':''}`}>
                    <div className="w-8 h-8 brand-gradient rounded-xl flex items-center justify-center">
                        <BrainCircuit size={18} className="text-white"/>
                    </div>
                    {!collapsed && <span className="font-bold text-slate-900 text-base">LearnAI</span>}
                </div> 

                {/* Nav */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {
                        NAV_ITEMS.map(({to,label,icon:Icon})=>(
                            <NavLink
                                key={to}
                                to={to}
                                onClick={()=>setMobileOpen(false)}
                                title={collapsed ? label : undefined}
                                className={({isActive})=>`
                                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                                    ${isActive ? 'bg-[#e6fff5] text-[#007a53]':'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
                                    ${collapsed ? 'justify-center':''}
                                `}
                            >
                                <Icon size={18} className="flex-shrink-0"/>
                                {!collapsed && <span>{label}</span>}

                            </NavLink>
                        ))
                    }
                </nav>

                {/* Collapse — desktop only */}
                <div className="px-2 pb-4 hidden lg:block">
                    <button 
                        type="button"
                        onClick={()=>setCollapsed(!collapsed)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all ${collapsed ? 'justify-center':''}`}
                    >
                        {collapsed ? <ChevronRight size={18}/> :<><ChevronLeft size={18}/> <span>Collapse</span></>}
                        
                    </button>
                </div>

                <div className="border-t border-slate-100 px-2 pt-2 pb-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        title={collapsed ? 'Logout' : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-50 hover:text-red-500 trasition-all ${collapsed ? 'justify-center':''}`}
                    >
                        <LogOut size={18}/>
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>


            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <header className="h-16 bg-white border-b border-slate-100 flex items-center gap-4 px-6 flex-shrink-0">
                        {/*mobiel menu*/}
                        <button
                            type="button"
                            className="lg:hidden text-slate-500 hover:text-slate-700"
                            onClick={()=>setMobileOpen(true)}
                        >
                            <Menu size={20}/>
                        </button>

                        <h1 className="text-lg font-semibold text-slate-900 hidden md:block">{title}</h1>

                        <div className="flex-1 max-w-sm relative hidden md:block">
                            <Search  size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <input
                                value={search}
                                onChange={(e)=> setSearch(e.target.value)}
                                placeholder="Search anything..."
                                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00B86B] focus:bg-white transition-all"
                            />
                            {search && (
                                <button type="button" onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <X size={14} />
                                </button>
                                )}
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                             {/* Notifications — UI stub */}
                             <div className="relative">
                                <button
                                    type="button"
                                    onClick={()=>{ setNotifOpen(!notifOpen); setProfileOpen(false)}}
                                    className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
                                >
                                    <Bell size={18}/>
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00B86B] rounded-full"/>
                                </button>

                                {notifOpen && (
                                    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl z-50">
                                        <div className="p-4 border-b border-slate-100 font-semibold text-sm">Notifications</div>
                                        <p className="p-4 text-sm text-slate-500">No notifications yets</p>
                                    </div>
                                )}
                             </div>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={()=>{setProfileOpen(!profileOpen); setNotifOpen(false);}}
                                    className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-100"
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                        <User size={16} className="text-slate-500"/>
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 hidden md:block">User</span>
                                    
                                </button> 

                                { profileOpen && (
                                    <div className="absolute top-12 right-0 w-52 bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden">
                                        <div className="p-2">
                                            <button 
                                                type="button"
                                                onClick={()=>{navigate('/profile'); setProfileOpen(false);}}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                                            >
                                                <User size={15}/>Profile
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={()=>{ setProfileOpen(false);}}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                                            >
                                                <Settings size={15}/>Setting
                                            </button>

                                            <button 
                                                type="button"
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50"
                                            >
                                                <LogOut size={15}/>Logout
                                            </button>
                                        </div>
                                    </div>
                                )

                                }
                            </div>   
                        </div>


                    </header>
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default AppLayout