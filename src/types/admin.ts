export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface ActivityLog {
  id: string;
  admin_user_id: string | null;
  action_type: 'create' | 'update' | 'delete' | 'export' | 'login' | 'logout' | 'status_change';
  table_name: string;
  record_id: string | null;
  before_data: any;
  after_data: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

export interface PickupRequestWithDetails {
  id: string;
  user_phone: string;
  customer_name: string;
  address: string;
  pincode: string;
  pickup_date: string;
  pickup_time: string;
  status: string;
  final_price: number;
  created_at: string;
  device: {
    id: string;
    model_name: string;
    series: string | null;
    image_url: string | null;
    brand: {
      name: string;
      category: string;
    };
  };
  variant: {
    storage_gb: number;
  };
  city: {
    name: string;
  };
  condition: string;
  age_group: string;
  has_charger: boolean;
  has_bill: boolean;
  has_box: boolean;
  device_powers_on: boolean;
  display_condition: string;
  body_condition: string;
  can_make_calls: boolean;
  is_touch_working: boolean;
  is_screen_original: boolean;
  is_battery_healthy: boolean;
  overall_condition: string;
}
