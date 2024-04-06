export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      invoice_position: {
        Row: {
          description: string
          id: number
          price: number
          sender_id: number
          vat_rate: number
        }
        Insert: {
          description: string
          id?: number
          price: number
          sender_id: number
          vat_rate: number
        }
        Update: {
          description?: string
          id?: number
          price?: number
          sender_id?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_position_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "sender"
            referencedColumns: ["id"]
          },
        ]
      }
      recipient: {
        Row: {
          address_line: string
          city: string
          country: string
          id: number
          name: string
          sender_id: number
          zip_code: number
        }
        Insert: {
          address_line: string
          city: string
          country: string
          id?: number
          name: string
          sender_id: number
          zip_code: number
        }
        Update: {
          address_line?: string
          city?: string
          country?: string
          id?: number
          name?: string
          sender_id?: number
          zip_code?: number
        }
        Relationships: [
          {
            foreignKeyName: "recipient_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "sender"
            referencedColumns: ["id"]
          },
        ]
      }
      sender: {
        Row: {
          address_line: string
          city: string
          country: string
          foot_note: string[] | null
          id: number
          logo_url: string | null
          name: string
          running_invoice_number: number
          user_id: string
          zip_code: number
        }
        Insert: {
          address_line: string
          city: string
          country: string
          foot_note?: string[] | null
          id?: number
          logo_url?: string | null
          name: string
          running_invoice_number?: number
          user_id: string
          zip_code: number
        }
        Update: {
          address_line?: string
          city?: string
          country?: string
          foot_note?: string[] | null
          id?: number
          logo_url?: string | null
          name?: string
          running_invoice_number?: number
          user_id?: string
          zip_code?: number
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
