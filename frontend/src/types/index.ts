export type OrderStatus =
  | 'New'
  | 'Pending Documents'
  | 'Survey'
  | 'Under MW Installation'
  | 'Under MW Installation / Pending Due to Permission Letter '
  | 'Pending Due to Ip issues at Mobily End'
  | 'Under Activation'
  | 'Under TWAL Approval'
  | 'Delivered '
  | 'Delivered / CR Pending'
  | 'Delivered /CR Pending'
  | 'Completed'
  | 'Cancelled'
  | 'On Hold'
  | 'Not Yet Set';

export type UserRole =
  | 'Super Admin'
  | 'Admin'
  | 'Project Coordinator'
  | 'Engineer'
  | 'Sales/User'
  | 'Viewer';

export interface Order {
  id: string;
  sl_no: string;
  ki_id: string;
  order_received: string;
  region: string;
  city: string;
  circuit_id: string;
  order_number: string;
  customer_name: string;
  customer_contact: string;
  bw: string;
  los_performed: string;
  los_status: 'CLOS' | 'Pending' | 'Not Started' | '';
  los_id: string;
  cwo_date: string;
  installation_start: string;
  installation_complete: string;
  delivery_date: string;
  order_status: OrderStatus;
  assigned_to: string;
  is_cancelled: boolean;
  priority?: 'High' | 'Medium' | 'Low';
  service_type?: string;
  remarks?: string;
  created_at?: string;
  updated_at?: string;
  documents?: DocumentAttachment[];
  history?: ActivityTimelineItem[];
}

export interface DocumentAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface ActivityTimelineItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface Customer {
  id: string;
  name: string;
  company_name: string;
  contact_person: string;
  mobile: string;
  email: string;
  address: string;
  region: string;
  city: string;
  national_address: string;
  vat_number: string;
  notes: string;
  order_count: number;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  target: string;
  details: string;
  ip_address: string;
}

export interface DashboardMetrics {
  total_orders: number;
  active_orders: number;
  cancelled_orders: number;
  los_completed: number;
  in_process_installing: number;
  awaiting_twal_approval: number;
  brown_condition_flagged: number;
  status_not_yet_set: number;
  delivered: number;
  orders_today: number;
  orders_this_week: number;
  orders_this_month: number;
  stc_orders: number;
  mobily_orders: number;
  region_breakdown: Record<string, number>;
  city_breakdown: Record<string, number>;
  bw_breakdown: Record<string, number>;
  status_breakdown: Record<string, number>;
}
