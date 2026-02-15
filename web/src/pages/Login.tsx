import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [hrid, setHrid] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (role: 'SUPER_ADMIN' | 'TERRITORY_MANAGER') => {
        // Mock login
        if (hrid && password) {
            login(role);
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100" dir="rtl">
            <Card className="w-[400px]">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
                        <ShieldCheck className="h-8 w-8 text-blue-700" />
                    </div>
                    <CardTitle className="text-2xl font-bold">بوابة الإدارة - أمان</CardTitle>
                    <CardDescription>تسجيل الدخول للمشرفين ومديري المناطق</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="admin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="admin">Super Admin</TabsTrigger>
                            <TabsTrigger value="manager">Territory Manager</TabsTrigger>
                        </TabsList>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="hrid">الرقم الوظيفي (HRID)</Label>
                                <Input
                                    id="hrid"
                                    placeholder="HR-xxxx"
                                    value={hrid}
                                    onChange={(e) => setHrid(e.target.value)}
                                    className="text-right"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">كلمة المرور</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="text-right"
                                />
                            </div>
                        </div>

                        <TabsContent value="admin">
                            <Button className="w-full mt-4 bg-blue-700 hover:bg-blue-800" onClick={() => handleLogin('SUPER_ADMIN')}>
                                دخول (Admin)
                            </Button>
                        </TabsContent>
                        <TabsContent value="manager">
                            <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleLogin('TERRITORY_MANAGER')}>
                                دخول (Manager)
                            </Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-500">نسيت كلمة المرور؟ تواصل مع IT</p>
                </CardFooter>
            </Card>
        </div>
    );
}
