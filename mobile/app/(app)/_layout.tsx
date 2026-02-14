import { Tabs, Redirect } from 'expo-router';
import { Home, Users as UsersIcon, Search, ListTodo } from 'lucide-react-native';
import { useAuthStore } from '../../store/authStore';

export default function AppLayout() {
    const { isAuthenticated } = useAuthStore();

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#1E40AF',
            tabBarStyle: { direction: 'rtl' },
            tabBarLabelStyle: { fontFamily: 'System' }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'الرئيسية',
                    tabBarIcon: ({ color }: { color: string }) => <Home color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="my-merchants"
                options={{
                    title: 'تجاهي',
                    tabBarIcon: ({ color }: { color: string }) => <UsersIcon color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'بحث',
                    tabBarIcon: ({ color }: { color: string }) => <Search color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: 'المهام',
                    tabBarIcon: ({ color }: { color: string }) => <ListTodo color={color} size={24} />,
                }}
            />
        </Tabs>
    );
}
