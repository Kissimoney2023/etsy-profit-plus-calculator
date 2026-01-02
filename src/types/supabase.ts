export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    plan: 'free' | 'starter' | 'pro'
                    stripe_customer_id: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    plan?: 'free' | 'starter' | 'pro'
                    stripe_customer_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    plan?: 'free' | 'starter' | 'pro'
                    stripe_customer_id?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            products: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    sku: string | null
                    currency: string
                    inputs: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    sku?: string | null
                    currency: string
                    inputs: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    sku?: string | null
                    currency?: string
                    inputs?: Json
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "products_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
