import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { users, tasks } from '@shared/mockData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LeadDistribution() {
    const { user: currentUser } = useAuth();
    const [selectedTerritory, setSelectedTerritory] = useState<string>(currentUser?.territory === 'All' ? 'Cairo - Nasr City' : currentUser?.territory || 'Cairo - Nasr City');

    // Enforce territory for non-admins
    useEffect(() => {
        if (currentUser && currentUser.role !== 'SUPER_ADMIN' && currentUser.territory !== 'All') {
            setSelectedTerritory(currentUser.territory);
        }
    }, [currentUser]);

    // get unique territories
    const territories = useMemo(() => {
        const ts = new Set(users.map(u => u.territory).filter(t => t !== 'All'));
        return Array.from(ts);
    }, []);

    // Calculate stats per user in selected territory
    const territoryStats = useMemo(() => {
        const territoryUsers = users.filter(u => u.territory === selectedTerritory && u.role !== 'SUPER_ADMIN' && u.role !== 'TERRITORY_MANAGER');

        const stats = territoryUsers.map(user => {
            const userTasks = tasks.filter(t => t.assignedToId === user.id && t.status === 'OPEN');
            return {
                user,
                pendingTasks: userTasks.length,
            };
        });

        const totalTasks = stats.reduce((acc, curr) => acc + curr.pendingTasks, 0);
        const avgTasks = stats.length > 0 ? totalTasks / stats.length : 0;

        return { stats, avgTasks };
    }, [selectedTerritory]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">توزيع الفرص والمهام</h1>
                    <p className="text-gray-500">مراقبة الأحمال وتوزيع العمل على الفريق</p>
                </div>
                <div className="flex gap-2">
                    {/* RBAC: Only Super Admin can switch territories */}
                    {currentUser?.role === 'SUPER_ADMIN' ? (
                        territories.map(t => (
                            <Button
                                key={t}
                                variant={selectedTerritory === t ? 'default' : 'outline'}
                                onClick={() => setSelectedTerritory(t)}
                                size="sm"
                            >
                                {t}
                            </Button>
                        ))
                    ) : (
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-bold text-sm">
                            منطقة: {selectedTerritory}
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {territoryStats.stats.map(({ user, pendingTasks }) => {
                    const isImbalanced = pendingTasks >= territoryStats.avgTasks * 2 && pendingTasks > 2; // Simple heuristic
                    const workloadPercent = Math.min((pendingTasks / (territoryStats.avgTasks * 2 || 1)) * 100, 100);

                    return (
                        <Card key={user.id} className={isImbalanced ? 'border-red-200 bg-red-50' : ''}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{user.name}</CardTitle>
                                        <CardDescription>{user.role === 'LO' ? 'مسؤول قروض' : 'مسؤول كروس سيل'}</CardDescription>
                                    </div>
                                    <div className={`text-2xl font-bold ${isImbalanced ? 'text-red-600' : 'text-blue-600'}`}>
                                        {pendingTasks}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>متوسط المنطقة: {territoryStats.avgTasks.toFixed(1)}</span>
                                        <span>{Math.round(workloadPercent)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${isImbalanced ? 'bg-red-500' : 'bg-blue-500'}`}
                                            style={{ width: `${workloadPercent}%` }}
                                        />
                                    </div>

                                    {isImbalanced ? (
                                        <div className="flex items-center gap-2 text-red-700 text-sm mt-2 bg-red-100 p-2 rounded-lg">
                                            <AlertCircle size={16} />
                                            <span>حمل عمل مرتفع جداً (أكثر من الضعف)</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-green-700 text-sm mt-2 bg-green-100 p-2 rounded-lg">
                                            <CheckCircle2 size={16} />
                                            <span>حمل عمل متوازن</span>
                                        </div>
                                    )}

                                    <div className="flex justify-end mt-4">
                                        <Button variant="outline" size="sm">عرض التفاصيل</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
