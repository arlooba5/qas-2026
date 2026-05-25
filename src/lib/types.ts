export interface Course {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  price: number;
  instructor: string;
  capacity: number;
  enrolled?: number;
  category: string;
  description?: string;
  imageUrl?: string;
  detailUrl?: string;
  status: 'active' | 'inactive' | 'full';
  createdAt?: string;
}

export interface Report {
  id: string;
  name: string;
  category: string;
  type: 'personal' | 'organization';
  description: string;
  price: number;
  emoji: string;
  detailUrl?: string;
  status: 'active' | 'inactive';
}

export interface Consultant {
  id: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
  tags: string[];
  detailUrl?: string;
  status: 'active' | 'inactive';
}

export interface Event {
  id: string;
  name: string;
  date: string;
  type: string;
  description: string;
  imageUrl?: string;
  detailContent?: string;
  price?: number;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface Order {
  id: string;
  userId?: string;
  type: 'report' | 'course' | 'consulting';
  itemId: string;
  itemName: string;
  amount: number;
  subjectName: string;
  subjectEmail: string;
  subjectPhone: string;
  subjectCompany?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  invoiceInfo?: string;
  note?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Member {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: 'member' | 'staff' | 'admin';
  level: 'basic' | 'silver' | 'gold';
  points: number;
  createdAt: string;
}
