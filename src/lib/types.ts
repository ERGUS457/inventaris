// ──────────────────────────────────────────────────────────────────────────────
// Database Entity Types
// ──────────────────────────────────────────────────────────────────────────────

export type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type Location = {
  id: string;
  name: string;
  created_at: string;
};

export interface Profile {
  id: string;
  email: string;
  role: "superadmin" | "user";
  is_verified: boolean;
  created_at: string;
}

export type ItemCondition = "Baik" | "Rusak" | "Perlu Perbaikan";

export type Item = {
  id: string;
  item_code: string;
  name: string;
  category_id: string;
  location_id: string;
  quantity: number;
  condition: ItemCondition;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  owner_id?: string;
  // Joined relations
  categories?: Category;
  locations?: Location;
  profiles?: { email: string };
};

export type TransactionType = "masuk" | "keluar" | "mutasi";

export type Transaction = {
  id: string;
  item_id: string;
  transaction_type: TransactionType;
  quantity: number;
  notes: string | null;
  transaction_date: string;
  created_by: string | null;
  from_location_id: string | null;
  to_location_id: string | null;
  owner_id?: string;
  // Joined relation
  items?: Pick<Item, "id" | "name" | "item_code">;
  profiles?: { email: string };
  from_location?: Location;
  to_location?: Location;
};

// ──────────────────────────────────────────────────────────────────────────────
// Form Input Types (used with React Hook Form)
// ──────────────────────────────────────────────────────────────────────────────

export type ItemFormValues = {
  item_code: string;
  name: string;
  category_id: string;
  location_id: string;
  quantity: number;
  condition: ItemCondition;
  image_url?: string;
};

export type CategoryFormValues = {
  name: string;
  description?: string;
};

export type LocationFormValues = {
  name: string;
};

// ──────────────────────────────────────────────────────────────────────────────
// Dashboard Metric Types
// ──────────────────────────────────────────────────────────────────────────────

export type DashboardMetrics = {
  totalItems: number;
  goodCondition: number;
  damagedCondition: number;
  needsRepair: number;
};
