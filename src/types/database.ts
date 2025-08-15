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
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          description: string
          short_description: string
          price_per_night: number
          max_guests: number
          bedrooms: number
          bathrooms: number
          size_sqm: number
          amenities: string[]
          images: string[]
          location: {
            address: string
            city: string
            country: string
            coordinates: {
              lat: number
              lng: number
            }
          }
          active: boolean
          featured: boolean
          min_nights: number
          max_nights: number
          check_in_time: string
          check_out_time: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          description: string
          short_description: string
          price_per_night: number
          max_guests: number
          bedrooms: number
          bathrooms: number
          size_sqm: number
          amenities: string[]
          images: string[]
          location: {
            address: string
            city: string
            country: string
            coordinates: {
              lat: number
              lng: number
            }
          }
          active?: boolean
          featured?: boolean
          min_nights?: number
          max_nights?: number
          check_in_time?: string
          check_out_time?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          description?: string
          short_description?: string
          price_per_night?: number
          max_guests?: number
          bedrooms?: number
          bathrooms?: number
          size_sqm?: number
          amenities?: string[]
          images?: string[]
          location?: {
            address: string
            city: string
            country: string
            coordinates: {
              lat: number
              lng: number
            }
          }
          active?: boolean
          featured?: boolean
          min_nights?: number
          max_nights?: number
          check_in_time?: string
          check_out_time?: string
        }
      }
      bookings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          property_id: string
          check_in: string
          check_out: string
          guests: number
          nights: number
          customer_name: string
          customer_email: string
          customer_phone: string | null
          total_amount: number
          currency: string
          payment_intent_id: string | null
          stripe_payment_intent_id: string | null
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests: string | null
          booking_source: string
          cancellation_reason: string | null
          cancelled_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id: string
          check_in: string
          check_out: string
          guests: number
          nights: number
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          total_amount: number
          currency: string
          payment_intent_id?: string | null
          stripe_payment_intent_id?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests?: string | null
          booking_source?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id?: string
          check_in?: string
          check_out?: string
          guests?: number
          nights?: number
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          total_amount?: number
          currency?: string
          payment_intent_id?: string | null
          stripe_payment_intent_id?: string | null
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests?: string | null
          booking_source?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
        }
      }
      availability_overrides: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          property_id: string
          date: string
          available: boolean
          reason: string | null
          price_override: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id: string
          date: string
          available: boolean
          reason?: string | null
          price_override?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id?: string
          date?: string
          available?: boolean
          reason?: string | null
          price_override?: number | null
        }
      }
      booking_line_items: {
        Row: {
          id: string
          booking_id: string
          description: string
          amount: number
          quantity: number
          type: 'accommodation' | 'cleaning' | 'tax' | 'fee' | 'discount'
        }
        Insert: {
          id?: string
          booking_id: string
          description: string
          amount: number
          quantity?: number
          type: 'accommodation' | 'cleaning' | 'tax' | 'fee' | 'discount'
        }
        Update: {
          id?: string
          booking_id?: string
          description?: string
          amount?: number
          quantity?: number
          type?: 'accommodation' | 'cleaning' | 'tax' | 'fee' | 'discount'
        }
      }
      guests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          email: string
          phone?: string
          date_of_birth?: string
          nationality?: string
          address?: Json
          emergency_contact?: Json
          dietary_restrictions?: string[]
          preferences?: Json
          notes?: string
          total_bookings: number
          total_spent: number
          last_stay_date?: string
          vip_status: boolean
          marketing_consent: boolean
          id_verified: boolean
          blacklisted: boolean
          blacklist_reason?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          phone?: string
          date_of_birth?: string
          nationality?: string
          address?: Json
          emergency_contact?: Json
          dietary_restrictions?: string[]
          preferences?: Json
          notes?: string
          total_bookings?: number
          total_spent?: number
          last_stay_date?: string
          vip_status?: boolean
          marketing_consent?: boolean
          id_verified?: boolean
          blacklisted?: boolean
          blacklist_reason?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          date_of_birth?: string
          nationality?: string
          address?: Json
          emergency_contact?: Json
          dietary_restrictions?: string[]
          preferences?: Json
          notes?: string
          total_bookings?: number
          total_spent?: number
          last_stay_date?: string
          vip_status?: boolean
          marketing_consent?: boolean
          id_verified?: boolean
          blacklisted?: boolean
          blacklist_reason?: string
        }
      }
      payments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          booking_id?: string
          stripe_payment_intent_id?: string
          stripe_charge_id?: string
          amount: number
          currency: string
          status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
          payment_method: 'card' | 'bank_transfer' | 'cash'
          payment_method_details?: Json
          description?: string
          receipt_url?: string
          refunded_amount: number
          refund_reason?: string
          processed_at?: string
          failed_at?: string
          failure_reason?: string
          metadata?: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          booking_id?: string
          stripe_payment_intent_id?: string
          stripe_charge_id?: string
          amount: number
          currency?: string
          status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
          payment_method?: 'card' | 'bank_transfer' | 'cash'
          payment_method_details?: Json
          description?: string
          receipt_url?: string
          refunded_amount?: number
          refund_reason?: string
          processed_at?: string
          failed_at?: string
          failure_reason?: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          booking_id?: string
          stripe_payment_intent_id?: string
          stripe_charge_id?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
          payment_method?: 'card' | 'bank_transfer' | 'cash'
          payment_method_details?: Json
          description?: string
          receipt_url?: string
          refunded_amount?: number
          refund_reason?: string
          processed_at?: string
          failed_at?: string
          failure_reason?: string
          metadata?: Json
        }
      }
      email_templates: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          subject: string
          content: string
          template_type: string
          variables: string[]
          is_active: boolean
          language: string
          last_used_at?: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          subject: string
          content: string
          template_type: string
          variables?: string[]
          is_active?: boolean
          language?: string
          last_used_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          subject?: string
          content?: string
          template_type?: string
          variables?: string[]
          is_active?: boolean
          language?: string
          last_used_at?: string
        }
      }
      email_logs: {
        Row: {
          id: string
          created_at: string
          template_id?: string
          booking_id?: string
          recipient_email: string
          recipient_name?: string
          subject: string
          content: string
          status: 'draft' | 'scheduled' | 'sent' | 'failed' | 'cancelled'
          scheduled_for?: string
          sent_at?: string
          delivered_at?: string
          opened_at?: string
          clicked_at?: string
          failed_at?: string
          error_message?: string
          postmark_message_id?: string
          metadata?: Json
        }
        Insert: {
          id?: string
          created_at?: string
          template_id?: string
          booking_id?: string
          recipient_email: string
          recipient_name?: string
          subject: string
          content: string
          status?: 'draft' | 'scheduled' | 'sent' | 'failed' | 'cancelled'
          scheduled_for?: string
          sent_at?: string
          delivered_at?: string
          opened_at?: string
          clicked_at?: string
          failed_at?: string
          error_message?: string
          postmark_message_id?: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          template_id?: string
          booking_id?: string
          recipient_email?: string
          recipient_name?: string
          subject?: string
          content?: string
          status?: 'draft' | 'scheduled' | 'sent' | 'failed' | 'cancelled'
          scheduled_for?: string
          sent_at?: string
          delivered_at?: string
          opened_at?: string
          clicked_at?: string
          failed_at?: string
          error_message?: string
          postmark_message_id?: string
          metadata?: Json
        }
      }
      id_documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          booking_id?: string
          guest_id?: string
          document_type: 'passport' | 'id_card' | 'driving_license'
          document_front_url: string
          document_back_url?: string
          status: 'pending' | 'verified' | 'rejected' | 'expired'
          uploaded_at: string
          verified_at?: string
          verified_by?: string
          rejection_reason?: string
          expires_at: string
          auto_delete_at: string
          metadata?: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          booking_id?: string
          guest_id?: string
          document_type: 'passport' | 'id_card' | 'driving_license'
          document_front_url: string
          document_back_url?: string
          status?: 'pending' | 'verified' | 'rejected' | 'expired'
          uploaded_at?: string
          verified_at?: string
          verified_by?: string
          rejection_reason?: string
          expires_at: string
          auto_delete_at: string
          metadata?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          booking_id?: string
          guest_id?: string
          document_type?: 'passport' | 'id_card' | 'driving_license'
          document_front_url?: string
          document_back_url?: string
          status?: 'pending' | 'verified' | 'rejected' | 'expired'
          uploaded_at?: string
          verified_at?: string
          verified_by?: string
          rejection_reason?: string
          expires_at?: string
          auto_delete_at?: string
          metadata?: Json
        }
      }
      calendar_syncs: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          property_id?: string
          platform: 'airbnb' | 'booking_com' | 'vrbo' | 'expedia' | 'custom'
          sync_type: 'import' | 'export' | 'bidirectional'
          ical_url?: string
          export_url?: string
          is_active: boolean
          sync_frequency_hours: number
          last_sync_at?: string
          last_error?: string
          total_bookings_synced: number
          settings?: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          property_id?: string
          platform: 'airbnb' | 'booking_com' | 'vrbo' | 'expedia' | 'custom'
          sync_type: 'import' | 'export' | 'bidirectional'
          ical_url?: string
          export_url?: string
          is_active?: boolean
          sync_frequency_hours?: number
          last_sync_at?: string
          last_error?: string
          total_bookings_synced?: number
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          property_id?: string
          platform?: 'airbnb' | 'booking_com' | 'vrbo' | 'expedia' | 'custom'
          sync_type?: 'import' | 'export' | 'bidirectional'
          ical_url?: string
          export_url?: string
          is_active?: boolean
          sync_frequency_hours?: number
          last_sync_at?: string
          last_error?: string
          total_bookings_synced?: number
          settings?: Json
        }
      }
      system_settings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          category: string
          key: string
          value: Json
          description?: string
          is_encrypted: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          category: string
          key: string
          value: Json
          description?: string
          is_encrypted?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          category?: string
          key?: string
          value?: Json
          description?: string
          is_encrypted?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      line_item_type: 'accommodation' | 'cleaning' | 'tax' | 'fee' | 'discount'
      payment_status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled' | 'refunded'
      payment_method: 'card' | 'bank_transfer' | 'cash'
      document_type: 'passport' | 'id_card' | 'driving_license'
      document_status: 'pending' | 'verified' | 'rejected' | 'expired'
      email_status: 'draft' | 'scheduled' | 'sent' | 'failed' | 'cancelled'
      sync_type: 'import' | 'export' | 'bidirectional'
      platform_type: 'airbnb' | 'booking_com' | 'vrbo' | 'expedia' | 'custom'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
