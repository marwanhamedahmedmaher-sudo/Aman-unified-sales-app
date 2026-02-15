import type { User, Merchant, Task } from './types';

// Mock Users
export const users: User[] = [
    // Loan Officers
    { id: 'u1', name: 'Ahmed Hassan', mobile: '01012345678', hrid: 'LO001', role: 'LO', territory: 'Cairo - Nasr City', status: 'ACTIVE' },
    { id: 'u2', name: 'Sara Ali', mobile: '01123456789', hrid: 'LO002', role: 'LO', territory: 'Cairo - Heliopolis', status: 'ACTIVE' },
    { id: 'u3', name: 'Mohamed Ibrahim', mobile: '01234567890', hrid: 'LO003', role: 'LO', territory: 'Giza - Dokki', status: 'ACTIVE' },

    // Cross-Sell Reps
    { id: 'u4', name: 'Fatma Sayed', mobile: '01512345678', hrid: 'CS001', role: 'CROSS_SELL', territory: 'Cairo - Nasr City', status: 'ACTIVE' },
    { id: 'u5', name: 'Mahmoud Adel', mobile: '01098765432', hrid: 'CS002', role: 'CROSS_SELL', territory: 'Cairo - Downtown', status: 'ACTIVE' },

    // Admins
    { id: 'a1', name: 'Admin User', mobile: '01000000001', hrid: 'ADM001', role: 'SUPER_ADMIN', territory: 'All', status: 'ACTIVE' },
    { id: 'tm1', name: 'Tarek Manager', mobile: '01000000002', hrid: 'TM001', role: 'TERRITORY_MANAGER', territory: 'Cairo', status: 'ACTIVE' },
];

const firstNames = ['Ahmed', 'Mohamed', 'Mahmoud', 'Ali', 'Hassan', 'Ibrahim', 'Mostafa', 'Omar', 'Youssef'];
const middleNames = ['Hassan', 'Ali', 'Mohamed', 'Ibrahim', 'Saeed', 'Abdelrahman', 'Fathy'];
const lastNames = ['Elsayed', 'Kamel', 'Nabil', 'Fawzy', 'Radwan', 'Zaki', 'Hafez'];

const businessPrefixes = ['محل', 'سوبر ماركت', 'صيدلية', 'مكتبة', 'مطعم', 'كافيه'];
const businessNames = ['الأمانة', 'النور', 'الفلاح', 'البركة', 'السعادة', 'التوفيق', 'الحمد'];

function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomMobile(): string {
    const prefixes = ['010', '011', '012', '015'];
    const prefix = getRandomElement(prefixes);
    const number = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return prefix + number;
}

function generateRandomNID(): string {
    // Simple mock: 2 + year + month + day + governorate + unique
    return '29001011234567'.replace(/\d/g, () => Math.floor(Math.random() * 10).toString());
}

export const merchants: Merchant[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `m${i + 1}`,
    businessName: `${getRandomElement(businessPrefixes)} ${getRandomElement(businessNames)}`,
    personalName: `${getRandomElement(firstNames)} ${getRandomElement(middleNames)} ${getRandomElement(lastNames)}`,
    nid: generateRandomNID(),
    mobile: generateRandomMobile(),
    address: `شارع ${getRandomElement(firstNames)}, ${getRandomElement(['مدينة نصر', 'مصر الجديدة', 'الدقي', 'وسط البلد'])}`,
    territory: getRandomElement(['Cairo - Nasr City', 'Cairo - Heliopolis', 'Giza - Dokki', 'Cairo - Downtown']),
    amanScore: getRandomElement(['HIGH', 'MEDIUM', 'LOW']),
    products: [
        { type: 'MF', status: Math.random() > 0.3 ? 'ACTIVE' : 'NOT_ONBOARDED' },
        Math.random() > 0.5 ? { type: 'BP', status: 'ACTIVE' } : { type: 'BP', status: 'PENDING' },
    ],
    ownerId: getRandomElement(users.filter(u => u.role === 'LO').map(u => u.id)),
    notes: [],
}));

export const tasks: Task[] = Array.from({ length: 30 }).map((_, i) => ({
    id: `t${i + 1}`,
    type: getRandomElement(['CROSS_SELL_BP', 'CROSS_SELL_ACC', 'FOLLOW_UP']),
    merchantId: getRandomElement(merchants).id,
    assignedToId: getRandomElement(users.filter(u => u.role === 'CROSS_SELL' || u.role === 'LO').map(u => u.id)),
    priority: getRandomElement(['HIGH', 'MEDIUM', 'LOW']),
    status: Math.random() > 0.7 ? 'COMPLETED' : 'OPEN',
    dueDate: new Date(Date.now() + Math.random() * 1000000000).toISOString(),
    createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
}));
