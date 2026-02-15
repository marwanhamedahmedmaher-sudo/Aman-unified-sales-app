import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Users, LayoutDashboard, Settings, LogOut, Shield, FilePenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const role = localStorage.getItem('userRole') || 'ADMIN';

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-100" dir="rtl">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <Shield className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">أمان القابضة</h1>
                        <p className="text-xs text-gray-500">بوابة الإدارة</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavLink
                        to="/dashboard"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`
                        }
                    >
                        <Users className="h-5 w-5" />
                        <span>إدارة المستخدمين</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/leads"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`
                        }
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        <span>توزيع الفرص (Leads)</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/requests"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`
                        }
                    >
                        <FilePenLine className="h-5 w-5" />
                        <span>طلبات التعديل</span>
                    </NavLink>

                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <NavLink
                            to="/dashboard/settings"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`
                            }
                        >
                            <Settings className="h-5 w-5" />
                            <span>الإعدادات</span>
                        </NavLink>
                    </div>
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                            {role === 'ADMIN' ? 'AD' : 'TM'}
                        </div>
                        <div>
                            <p className="text-sm font-bold">{role === 'ADMIN' ? 'Super Admin' : 'Territory Mgr'}</p>
                            <p className="text-xs text-gray-500">مفعل</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 ml-2" />
                        تسجيل الخروج
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8">
                    <h2 className="text-lg font-bold text-gray-700">لوحة التحكم</h2>
                    <div className="text-sm text-gray-500">
                        {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
