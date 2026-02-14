import { useState } from 'react';
import { users as initialUsers } from '@shared/mockData';
import type { User } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Search, UserPlus, Filter, UserX, UserCheck } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'LO' | 'CROSS_SELL'>('ALL');

    const filteredUsers = users.filter(user => {
        const matchSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.mobile.includes(search) ||
            user.hrid.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'ALL' ? true : user.role === roleFilter;
        return matchSearch && matchRole;
    });

    const handleStatusChange = (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED') => {
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
                    <p className="text-gray-500">عرض وإدارة الحسابات والصلاحيات</p>
                </div>
                <Button className="bg-blue-700 hover:bg-blue-800">
                    <UserPlus className="h-4 w-4 ml-2" />
                    إضافة مستخدم جديد
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                            <div className="relative w-64">
                                <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="بحث بالاسم، الموبايل، HRID"
                                    className="pr-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 mr-2">
                                <Button
                                    variant={roleFilter === 'ALL' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setRoleFilter('ALL')}
                                >
                                    الكل
                                </Button>
                                <Button
                                    variant={roleFilter === 'LO' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setRoleFilter('LO')}
                                >
                                    مسؤولي القروض
                                </Button>
                                <Button
                                    variant={roleFilter === 'CROSS_SELL' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setRoleFilter('CROSS_SELL')}
                                >
                                    مسؤولي الكروس سيل
                                </Button>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">الاسم</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">الموبايل</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">HRID</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">الدور الوظيفي</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">المنطقة</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">الحالة</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="h-24 text-center text-gray-500">
                                            لا توجد نتائج مطابقة
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-medium">{user.name}</td>
                                            <td className="p-4 text-gray-600">{user.mobile}</td>
                                            <td className="p-4 text-gray-600">{user.hrid}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.role === 'LO' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {user.role === 'LO' ? 'Loan Officer' : user.role === 'CROSS_SELL' ? 'Cross-Sell Rep' : user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600">{user.territory}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'}`}>
                                                    {user.status === 'ACTIVE' ? 'نشط' : 'موقوف'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {user.status === 'ACTIVE' ? (
                                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusChange(user.id, 'SUSPENDED')}>
                                                            <UserX className="h-4 w-4 ml-1" />
                                                            إيقاف
                                                        </Button>
                                                    ) : (
                                                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusChange(user.id, 'ACTIVE')}>
                                                            <UserCheck className="h-4 w-4 ml-1" />
                                                            تفعيل
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
