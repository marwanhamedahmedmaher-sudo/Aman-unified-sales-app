export type UserRole = 'LO' | 'CROSS_SELL' | 'SUPER_ADMIN' | 'TERRITORY_MANAGER';

export interface User {
  id: string;
  name: string;
  mobile: string;
  hrid: string;
  role: UserRole;
  territory: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export type ProductType = 'MF' | 'BP' | 'ACC';
export type ProductStatus = 'ACTIVE' | 'PENDING' | 'REJECTED' | 'NOT_ONBOARDED';
export type AmanScore = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ProductHolding {
  type: ProductType;
  status: ProductStatus;
  leadId?: string;
  rejectionDate?: string; // ISO String
}

export interface Merchant {
  id: string;
  businessName: string;
  personalName: string;
  nid: string;
  mobile: string;
  address: string;
  territory: string;
  amanScore: AmanScore;
  products: ProductHolding[];
  storePhotoUrl?: string;
  ownerId?: string; // Assigned LO or Cross-Sell rep based on context
  notes: Note[];
}

export interface Note {
  id: string;
  content: string;
  authorId: string; // User ID
  authorName: string;
  timestamp: string; // ISO String
}

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'OPEN' | 'COMPLETED';
export type TaskType = 'CROSS_SELL_BP' | 'CROSS_SELL_ACC' | 'FOLLOW_UP' | 'RE_ENGAGE';

export interface Task {
  id: string;
  type: TaskType;
  merchantId: string;
  assignedToId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // ISO String
  createdAt: string; // ISO String
  outcome?: 'INTERESTED' | 'NOT_INTERESTED' | 'RESCHEDULED' | 'CANNOT_REACH';
}

export interface LeadDistribution {
  repId: string;
  repName: string;
  territory: string;
  pendingLeads: number;
  territoryAvg: number;
  isImbalanced: boolean;
}

export type EditRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ESCALATED';
export type EditableField = 'MOBILE' | 'BUSINESS_NAME' | 'ADDRESS' | 'TERRITORY' | 'LOCATION';

export interface EditRequest {
  id: string;
  merchantId: string;
  merchantName: string;
  field: EditableField;
  oldValue: string;
  newValue: string;
  requestedBy: {
    id: string;
    name: string;
    role: UserRole;
  };
  requestedAt: string; // ISO String
  reason: string;
  status: EditRequestStatus;
  rejectionReason?: string;
  territory: string;
}
