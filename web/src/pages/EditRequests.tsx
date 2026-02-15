import { useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { editRequests as initialRequests } from '@shared/mockData';
import type { EditRequest, EditRequestStatus, EditableField } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Search, Filter, Check, X, AlertTriangle, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';

export default function EditRequestsPage() {
    const { user: currentUser } = useAuth();
    const [requests, setRequests] = useState<EditRequest[]>(initialRequests);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ESCALATED' | 'HISTORY'>('PENDING');
    const [search, setSearch] = useState('');

    // Rejection Dialog State
    const [rejectId, setRejectId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            // RBAC: TM only sees their territory
            if (currentUser?.role === 'TERRITORY_MANAGER' && req.territory !== currentUser.territory) {
                return false;
            }

            // Status Filter
            if (statusFilter === 'PENDING') {
                return req.status === 'PENDING' || req.status === 'ESCALATED';
            } else if (statusFilter === 'ESCALATED') {
                return req.status === 'ESCALATED';
            } else if (statusFilter === 'HISTORY') {
                return req.status === 'APPROVED' || req.status === 'REJECTED';
            }
            return true;
        });
    }, [requests, search, statusFilter, currentUser]);

    const handleApprove = (id: string) => {
        if (confirm('هل أنت متأكد من قبول هذا التعديل؟ سيتم تحديث بيانات التاجر فوراً.')) {
            setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' as EditRequestStatus } : r));
        }
    };

    const handleReject = () => {
        if (!rejectId || !rejectReason.trim()) return;
        setRequests(prev => prev.map(r => r.id === rejectId ? { ...r, status: 'REJECTED' as EditRequestStatus, rejectionReason: rejectReason } : r));
        setRejectId(null);
        setRejectReason('');
    };

    const getFieldLabel = (field: EditableField) => {
        const labels: Record<EditableField, string> = {
            MOBILE: 'رقم الموبايل',
            BUSINESS_NAME: 'اسم العمل',
            ADDRESS: 'العنوان',
            TERRITORY: 'المنطقة',
            LOCATION: 'الموقع الجغرافي'
        };
        return labels[field];
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

        if (diffInHours < 24) return `${Math.floor(diffInHours)} ساعات`;
        return `${Math.floor(diffInHours / 24)} أيام`;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">طلبات التعديل</h1>
                    <p className="text-gray-500">مراجعة طلبات تعديل بيانات التجار</p>
                </div>
                {currentUser?.role === 'SUPER_ADMIN' && (
                    <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="text-yellow-800 font-bold">
                            {requests.filter(r => r.status === 'ESCALATED').length} طلبات متأخرة (Escalated)
                        </span>
                    </div>
                )}
            </div>

            <Card>
                <CardHeader className="pb-3 border-b bg-gray-50/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                            <div className="relative w-64">
                                <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="بحث باسم التاجر أو المندوب"
                                    className="pr-8"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 mr-2">
                                <Button
                                    variant={statusFilter === 'PENDING' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setStatusFilter('PENDING')}
                                >
                                    قيد الانتظار
                                </Button>
                                <Button
                                    variant={statusFilter === 'ESCALATED' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setStatusFilter('ESCALATED')}
                                    className={statusFilter === 'ESCALATED' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'text-yellow-600 border-yellow-200 hover:bg-yellow-50'}
                                >
                                    متأخرة (Escalated)
                                </Button>
                                <Button
                                    variant={statusFilter === 'HISTORY' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setStatusFilter('HISTORY')}
                                >
                                    السجل
                                </Button>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-md border">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">التاجر</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">الحقل</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">التغيير المقترح</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">مقدم الطلب</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">السبب</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">الحالة</th>
                                    <th className="h-12 px-4 text-right font-medium text-gray-500">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="h-24 text-center text-gray-500">
                                            لا توجد طلبات
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((req) => (
                                        <tr key={req.id} className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${req.status === 'ESCALATED' ? 'bg-yellow-50/30' : ''}`}>
                                            <td className="p-4 font-medium">
                                                <div>{req.merchantName}</div>
                                                {currentUser?.role === 'SUPER_ADMIN' && <div className="text-xs text-gray-400">{req.territory}</div>}
                                            </td>
                                            <td className="p-4">
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-700">
                                                    {getFieldLabel(req.field)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-gray-400 line-through text-xs">{req.oldValue}</span>
                                                    <span className="text-green-700 font-bold">{req.newValue}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-gray-900">{req.requestedBy.name}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatTimeAgo(req.requestedAt)}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600 max-w-[200px] truncate" title={req.reason}>
                                                "{req.reason}"
                                            </td>
                                            <td className="p-4">
                                                {req.status === 'PENDING' && <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs font-bold">قيد الانتظار</span>}
                                                {req.status === 'ESCALATED' && <span className="text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><AlertTriangle className="h-3 w-3" /> متأخر</span>}
                                                {req.status === 'APPROVED' && <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">تم القبول</span>}
                                                {req.status === 'REJECTED' && <span className="text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-bold">مرفوض</span>}
                                            </td>
                                            <td className="p-4">
                                                {(req.status === 'PENDING' || req.status === 'ESCALATED') && (
                                                    <div className="flex items-center gap-2">
                                                        <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50 h-8 w-8 px-2" onClick={() => handleApprove(req.id)}>
                                                            <Check className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 px-2" onClick={() => setRejectId(req.id)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!rejectId} onOpenChange={(open) => !open && setRejectId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>رفض التعديل</DialogTitle>
                        <DialogDescription>
                            الرجاء ذكر سبب رفض هذا التعديل. سيظهر هذا السبب للمندوب.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="reject-reason" className="text-right mb-2 block">سبب الرفض</Label>
                        <Input
                            id="reject-reason"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="مثال: البيانات غير صحيحة، الاسم مخالف..."
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectId(null)}>إلغاء</Button>
                        <Button variant="destructive" onClick={handleReject}>رفض الطلب</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
