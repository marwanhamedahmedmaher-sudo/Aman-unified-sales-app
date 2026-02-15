import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { users as initialUsers } from '@shared/mockData';
import type { User, UserRole } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Search, UserPlus, Filter, UserX, UserCheck } from 'lucide-react';

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'LO' | 'CROSS_SELL'>('ALL');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        hrid: '',
        role: 'LO' as UserRole,
        territory: currentUser?.territory === 'All' ? 'Cairo - Nasr City' : currentUser?.territory || 'Cairo - Nasr City'
    });

    // Reset form when dialog opens or user changes
    const handleOpenDialog = (open: boolean) => {
        if (open) {
            setFormData({
                name: '',
                mobile: '',
                hrid: '',
                role: 'LO',
                territory: currentUser?.territory === 'All' ? 'Cairo - Nasr City' : currentUser?.territory || 'Cairo - Nasr City'
            });
        }
        setIsDialogOpen(open);
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            // RBAC Filter: Territory Manager can only see their territory
            if (currentUser?.role === 'TERRITORY_MANAGER' && user.territory !== currentUser.territory) {
                return false;
            }

            const matchSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.mobile.includes(search) ||
                user.hrid.toLowerCase().includes(search.toLowerCase());
            const matchRole = roleFilter === 'ALL' ? true : user.role === roleFilter;
            return matchSearch && matchRole;
        });
    }, [users, search, roleFilter, currentUser]);

    const handleStatusChange = (userId: string, newStatus: 'ACTIVE' | 'SUSPENDED') => {
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser: User = {
            id: `u${Date.now()}`,
            name: formData.name,
            mobile: formData.mobile,
            hrid: formData.hrid,
            role: formData.role,
            territory: formData.territory,
            status: 'ACTIVE'
        };

        setUsers([newUser, ...users]);
        setFormData({
            name: '',
            mobile: '',
            hrid: '',
            role: 'LO',
            territory: 'Cairo - Nasr City'
        });
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
                    <p className="text-gray-500">عرض وإدارة الحسابات والصلاحيات</p>
                </div>

                {/* Actions relocated to table header */}

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

                            <div className="flex items-center gap-2 mr-2 border-r pr-2">
                                {/* Only Super Admin see "Import" (Mock) */}
                                {currentUser?.role === 'SUPER_ADMIN' && (
                                    <Button variant="outline" size="sm" className="h-8 gap-2">
                                        <span className="hidden lg:inline">استيراد (Bulk)</span>
                                        <span className="lg:hidden">استيراد</span>
                                    </Button>
                                )}

                                {/* TM can only add users if looking at their territory */}
                                <Dialog open={isDialogOpen} onOpenChange={handleOpenDialog}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="bg-blue-700 hover:bg-blue-800 h-8 gap-2">
                                            <UserPlus className="h-3.5 w-3.5" />
                                            <span className="hidden lg:inline">إضافة مستخدم</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <form onSubmit={handleAddUser}>
                                            <DialogHeader>
                                                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                                                <DialogDescription>
                                                    أدخل بيانات الموظف الجديد لإنشاء حساب له.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        الاسم
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="col-span-3"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="mobile" className="text-right">
                                                        الموبايل
                                                    </Label>
                                                    <Input
                                                        id="mobile"
                                                        value={formData.mobile}
                                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                        className="col-span-3"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="hrid" className="text-right">
                                                        HRID
                                                    </Label>
                                                    <Input
                                                        id="hrid"
                                                        value={formData.hrid}
                                                        onChange={(e) => setFormData({ ...formData, hrid: e.target.value })}
                                                        className="col-span-3"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="role" className="text-right">
                                                        الدور
                                                    </Label>
                                                    <select
                                                        id="role"
                                                        value={formData.role}
                                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <option value="LO">Loan Officer</option>
                                                        <option value="CROSS_SELL">Cross-Sell Rep</option>
                                                        <option value="TERRITORY_MANAGER">Territory Manager</option>
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="territory" className="text-right">
                                                        المنطقة
                                                    </Label>
                                                    {currentUser?.role === 'SUPER_ADMIN' ? (
                                                        <select
                                                            id="territory"
                                                            value={formData.territory}
                                                            onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                                                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <option value="Cairo - Nasr City">Cairo - Nasr City</option>
                                                            <option value="Cairo - Heliopolis">Cairo - Heliopolis</option>
                                                            <option value="Giza - Dokki">Giza - Dokki</option>
                                                            <option value="Cairo - Downtown">Cairo - Downtown</option>
                                                        </select>
                                                    ) : (
                                                        <Input
                                                            id="territory"
                                                            value={formData.territory}
                                                            disabled
                                                            className="col-span-3 bg-gray-100 text-gray-500"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">حفظ المستخدم</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="flex items-center gap-2 mr-2 border-r pr-2">
                                {/* Only Super Admin see "Import" (Mock) */}
                                {currentUser?.role === 'SUPER_ADMIN' && (
                                    <Button variant="outline" size="sm" className="h-8 gap-2">
                                        <span className="hidden lg:inline">استيراد (Bulk)</span>
                                        <span className="lg:hidden">استيراد</span>
                                    </Button>
                                )}

                                {/* TM can only add users if looking at their territory */}
                                <Dialog open={isDialogOpen} onOpenChange={handleOpenDialog}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="bg-blue-700 hover:bg-blue-800 h-8 gap-2">
                                            <UserPlus className="h-3.5 w-3.5" />
                                            <span className="hidden lg:inline">إضافة مستخدم</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <form onSubmit={handleAddUser}>
                                            <DialogHeader>
                                                <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                                                <DialogDescription>
                                                    أدخل بيانات الموظف الجديد لإنشاء حساب له.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        الاسم
                                                    </Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="col-span-3"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="mobile" className="text-right">
                                                        الموبايل
                                                    </Label>
                                                    <Input
                                                        id="mobile"
                                                        value={formData.mobile}
                                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                        className="col-span-3"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="hrid" className="text-right">
                                                        HRID
                                                    </Label>
                                                    <Input
                                                        id="hrid"
                                                        value={formData.hrid}
                                                        onChange={(e) => setFormData({ ...formData, hrid: e.target.value })}
                                                        className="col-span-3"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="role" className="text-right">
                                                        الدور
                                                    </Label>
                                                    <select
                                                        id="role"
                                                        value={formData.role}
                                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <option value="LO">Loan Officer</option>
                                                        <option value="CROSS_SELL">Cross-Sell Rep</option>
                                                        <option value="TERRITORY_MANAGER">Territory Manager</option>
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="territory" className="text-right">
                                                        المنطقة
                                                    </Label>
                                                    {currentUser?.role === 'SUPER_ADMIN' ? (
                                                        <select
                                                            id="territory"
                                                            value={formData.territory}
                                                            onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                                                            className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <option value="Cairo - Nasr City">Cairo - Nasr City</option>
                                                            <option value="Cairo - Heliopolis">Cairo - Heliopolis</option>
                                                            <option value="Giza - Dokki">Giza - Dokki</option>
                                                            <option value="Cairo - Downtown">Cairo - Downtown</option>
                                                        </select>
                                                    ) : (
                                                        <Input
                                                            id="territory"
                                                            value={formData.territory}
                                                            disabled
                                                            className="col-span-3 bg-gray-100 text-gray-500"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">حفظ المستخدم</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
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
                                                        {/* RBAC: Cannot suspend Super Admins. TM cannot suspend outside territory (already filtered) */}
                                                        {user.role !== 'SUPER_ADMIN' && (
                                                            <>
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
                                                            </>
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
        </div>
    );
}
