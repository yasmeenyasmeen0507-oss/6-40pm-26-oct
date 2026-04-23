export interface PickupAgent {
  id: string;
  username: string;
  phone?: string;
  created_at?: string;
}

export interface PickupAssignmentRecord {
  id: string;
  pickup_request_id: string;
  pickup_agent_id: string;
  assigned_amount: number;
  collected_amount: number;
  notes?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  pickup_agent?: PickupAgent;
  pickup_request?: {
    order_id: string | null;
    customer_name: string;
    user_phone: string;
    email?: string | null;
    address?: string | null;
    pincode?: string | null;
    pickup_date: string | null;
    pickup_time?: string | null;
    final_price: number | null;
    status?: string | null;
    age_group?: string | null;
    overall_condition?: string | null;
    display_condition?: string | null;
    body_condition?: string | null;
    can_make_calls?: boolean | null;
    is_touch_working?: boolean | null;
    is_screen_original?: boolean | null;
    is_battery_healthy?: boolean | null;
    has_charger?: boolean | null;
    has_box?: boolean | null;
    has_bill?: boolean | null;
    device?: {
      model_name: string;
      brand?: {
        name: string;
      };
    };
    variant?: {
      storage_gb: number;
    };
    city?: {
      name: string;
    };
  };
}

export interface PickupPartnerSession {
  agent: PickupAgent;
  token: string;
  expiresAt: number;
}
