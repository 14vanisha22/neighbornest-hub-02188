export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      call_history: {
        Row: {
          call_type: string
          created_at: string
          id: string
          medical_center_id: string | null
          medical_center_name: string
          phone_number: string
          user_id: string
        }
        Insert: {
          call_type?: string
          created_at?: string
          id?: string
          medical_center_id?: string | null
          medical_center_name: string
          phone_number: string
          user_id: string
        }
        Update: {
          call_type?: string
          created_at?: string
          id?: string
          medical_center_id?: string | null
          medical_center_name?: string
          phone_number?: string
          user_id?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string
          description: string
          id: string
          image_url: string | null
          media_link: string | null
          status: Database["public"]["Enums"]["item_status"] | null
          title: string
          views_count: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by: string
          description: string
          id?: string
          image_url?: string | null
          media_link?: string | null
          status?: Database["public"]["Enums"]["item_status"] | null
          title: string
          views_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string
          description?: string
          id?: string
          image_url?: string | null
          media_link?: string | null
          status?: Database["public"]["Enums"]["item_status"] | null
          title?: string
          views_count?: number | null
        }
        Relationships: []
      }
      community_kitchens: {
        Row: {
          address: string
          capacity: number | null
          contact_email: string | null
          contact_phone: string
          created_at: string | null
          description: string | null
          food_type: string | null
          id: string
          image_url: string | null
          is_free: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          meal_types: string[] | null
          name: string
          price_range: string | null
          rating: number | null
          status: string | null
          timings: string
          total_reviews: number | null
        }
        Insert: {
          address: string
          capacity?: number | null
          contact_email?: string | null
          contact_phone: string
          created_at?: string | null
          description?: string | null
          food_type?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          meal_types?: string[] | null
          name: string
          price_range?: string | null
          rating?: number | null
          status?: string | null
          timings: string
          total_reviews?: number | null
        }
        Update: {
          address?: string
          capacity?: number | null
          contact_email?: string | null
          contact_phone?: string
          created_at?: string | null
          description?: string | null
          food_type?: string | null
          id?: string
          image_url?: string | null
          is_free?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          meal_types?: string[] | null
          name?: string
          price_range?: string | null
          rating?: number | null
          status?: string | null
          timings?: string
          total_reviews?: number | null
        }
        Relationships: []
      }
      drive_registrations: {
        Row: {
          age_group: string | null
          availability: string | null
          created_at: string | null
          drive_id: string
          email: string
          full_name: string
          gender: string | null
          id: string
          liability_accepted: boolean
          number_of_participants: number | null
          phone: string
          photo_consent: boolean
          terms_accepted: boolean
          tshirt_size: string | null
          user_id: string
          volunteer_role: string | null
        }
        Insert: {
          age_group?: string | null
          availability?: string | null
          created_at?: string | null
          drive_id: string
          email: string
          full_name: string
          gender?: string | null
          id?: string
          liability_accepted?: boolean
          number_of_participants?: number | null
          phone: string
          photo_consent?: boolean
          terms_accepted?: boolean
          tshirt_size?: string | null
          user_id: string
          volunteer_role?: string | null
        }
        Update: {
          age_group?: string | null
          availability?: string | null
          created_at?: string | null
          drive_id?: string
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          liability_accepted?: boolean
          number_of_participants?: number | null
          phone?: string
          photo_consent?: boolean
          terms_accepted?: boolean
          tshirt_size?: string | null
          user_id?: string
          volunteer_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drive_registrations_drive_id_fkey"
            columns: ["drive_id"]
            isOneToOne: false
            referencedRelation: "drives"
            referencedColumns: ["id"]
          },
        ]
      }
      drives: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          date: string
          description: string
          id: string
          image_url: string | null
          location: string
          organizer: string
          participants_count: number | null
          registration_link: string | null
          status: Database["public"]["Enums"]["item_status"] | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          date: string
          description: string
          id?: string
          image_url?: string | null
          location: string
          organizer: string
          participants_count?: number | null
          registration_link?: string | null
          status?: Database["public"]["Enums"]["item_status"] | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          date?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          organizer?: string
          participants_count?: number | null
          registration_link?: string | null
          status?: Database["public"]["Enums"]["item_status"] | null
          title?: string
        }
        Relationships: []
      }
      dumping_reports: {
        Row: {
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          latitude: number | null
          location: string
          longitude: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          description: string
          id: string
          name: string
          phone_number: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          name: string
          phone_number: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          phone_number?: string
          type?: string
        }
        Relationships: []
      }
      event_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          event_id: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          event_id: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          event_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          rsvp_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          rsvp_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          rsvp_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_volunteers: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          user_id: string
          volunteer_role: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          user_id: string
          volunteer_role?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          user_id?: string
          volunteer_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_volunteers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          description: string
          end_date: string | null
          event_date: string
          id: string
          image_url: string | null
          impact_data: Json | null
          location: string
          rsvp_count: number | null
          status: Database["public"]["Enums"]["event_status"] | null
          title: string
          volunteer_spots: number | null
          volunteers_joined: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          description: string
          end_date?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          impact_data?: Json | null
          location: string
          rsvp_count?: number | null
          status?: Database["public"]["Enums"]["event_status"] | null
          title: string
          volunteer_spots?: number | null
          volunteers_joined?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string
          end_date?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          impact_data?: Json | null
          location?: string
          rsvp_count?: number | null
          status?: Database["public"]["Enums"]["event_status"] | null
          title?: string
          volunteer_spots?: number | null
          volunteers_joined?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_bank_inventory: {
        Row: {
          availability_status: string | null
          category: string | null
          food_bank_id: string
          id: string
          item_name: string
          last_updated: string | null
          quantity: string
          unit: string | null
        }
        Insert: {
          availability_status?: string | null
          category?: string | null
          food_bank_id: string
          id?: string
          item_name: string
          last_updated?: string | null
          quantity: string
          unit?: string | null
        }
        Update: {
          availability_status?: string | null
          category?: string | null
          food_bank_id?: string
          id?: string
          item_name?: string
          last_updated?: string | null
          quantity?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_bank_inventory_food_bank_id_fkey"
            columns: ["food_bank_id"]
            isOneToOne: false
            referencedRelation: "food_banks"
            referencedColumns: ["id"]
          },
        ]
      }
      food_banks: {
        Row: {
          address: string
          contact_email: string | null
          contact_phone: string
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_partner: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          organization_type: string | null
          services: string[] | null
          status: string | null
          timings: string
          website: string | null
        }
        Insert: {
          address: string
          contact_email?: string | null
          contact_phone: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_partner?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          organization_type?: string | null
          services?: string[] | null
          status?: string | null
          timings: string
          website?: string | null
        }
        Update: {
          address?: string
          contact_email?: string | null
          contact_phone?: string
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_partner?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          organization_type?: string | null
          services?: string[] | null
          status?: string | null
          timings?: string
          website?: string | null
        }
        Relationships: []
      }
      food_donations: {
        Row: {
          assigned_volunteer_id: string | null
          contact_email: string | null
          contact_phone: string
          created_at: string | null
          donor_id: string
          donor_name: string
          donor_type: string
          expiry_time: string
          food_type: string
          id: string
          image_url: string | null
          latitude: number | null
          longitude: number | null
          notes: string | null
          pickup_location: string
          quantity: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_volunteer_id?: string | null
          contact_email?: string | null
          contact_phone: string
          created_at?: string | null
          donor_id: string
          donor_name: string
          donor_type: string
          expiry_time: string
          food_type: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          pickup_location: string
          quantity: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_volunteer_id?: string | null
          contact_email?: string | null
          contact_phone?: string
          created_at?: string | null
          donor_id?: string
          donor_name?: string
          donor_type?: string
          expiry_time?: string
          food_type?: string
          id?: string
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          pickup_location?: string
          quantity?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      food_requests: {
        Row: {
          contact_email: string | null
          contact_phone: string
          created_at: string | null
          food_type_needed: string
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          organization_name: string
          organization_type: string
          pickup_location: string
          quantity_needed: string
          requester_id: string
          status: string | null
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone: string
          created_at?: string | null
          food_type_needed: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          organization_name: string
          organization_type: string
          pickup_location: string
          quantity_needed: string
          requester_id: string
          status?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string
          created_at?: string | null
          food_type_needed?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          organization_name?: string
          organization_type?: string
          pickup_location?: string
          quantity_needed?: string
          requester_id?: string
          status?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: []
      }
      food_resources: {
        Row: {
          contact_phone: string
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          image_url: string | null
          location: string
          pickup_details: string | null
          posted_by: string
          quantity: string | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          status: Database["public"]["Enums"]["item_status"] | null
          title: string
        }
        Insert: {
          contact_phone: string
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          location: string
          pickup_details?: string | null
          posted_by: string
          quantity?: string | null
          resource_type: Database["public"]["Enums"]["resource_type"]
          status?: Database["public"]["Enums"]["item_status"] | null
          title: string
        }
        Update: {
          contact_phone?: string
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          image_url?: string | null
          location?: string
          pickup_details?: string | null
          posted_by?: string
          quantity?: string | null
          resource_type?: Database["public"]["Enums"]["resource_type"]
          status?: Database["public"]["Enums"]["item_status"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_resources_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      food_waste_tips: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          media_url: string | null
          tip_type: string | null
          title: string
          views_count: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          media_url?: string | null
          tip_type?: string | null
          title: string
          views_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          media_url?: string | null
          tip_type?: string | null
          title?: string
          views_count?: number | null
        }
        Relationships: []
      }
      impact_projects: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          current_amount: number | null
          description: string
          goal_amount: number | null
          id: string
          image_url: string | null
          status: string | null
          title: string
          volunteers_joined: number | null
          volunteers_needed: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          current_amount?: number | null
          description: string
          goal_amount?: number | null
          id?: string
          image_url?: string | null
          status?: string | null
          title: string
          volunteers_joined?: number | null
          volunteers_needed?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          current_amount?: number | null
          description?: string
          goal_amount?: number | null
          id?: string
          image_url?: string | null
          status?: string | null
          title?: string
          volunteers_joined?: number | null
          volunteers_needed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "impact_projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          job_id: string
          linkedin_url: string | null
          phone: string
          resume_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          job_id: string
          linkedin_url?: string | null
          phone: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          job_id?: string
          linkedin_url?: string | null
          phone?: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          company: string
          created_at: string | null
          description: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          expires_at: string | null
          id: string
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
          posted_by: string
          salary_max: number | null
          salary_min: number | null
          skills: string[] | null
          status: Database["public"]["Enums"]["item_status"] | null
          title: string
          updated_at: string | null
          urgency: Database["public"]["Enums"]["urgency_level"] | null
          verified: boolean | null
        }
        Insert: {
          company: string
          created_at?: string | null
          description: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          expires_at?: string | null
          id?: string
          job_type: Database["public"]["Enums"]["job_type"]
          location: string
          posted_by: string
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["item_status"] | null
          title: string
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"] | null
          verified?: boolean | null
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          expires_at?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"]
          location?: string
          posted_by?: string
          salary_max?: number | null
          salary_min?: number | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["item_status"] | null
          title?: string
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"] | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kitchen_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          food_quality: number | null
          hygiene_rating: number | null
          id: string
          kitchen_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          food_quality?: number | null
          hygiene_rating?: number | null
          id?: string
          kitchen_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          food_quality?: number | null
          hygiene_rating?: number | null
          id?: string
          kitchen_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_reviews_kitchen_id_fkey"
            columns: ["kitchen_id"]
            isOneToOne: false
            referencedRelation: "community_kitchens"
            referencedColumns: ["id"]
          },
        ]
      }
      kitchen_volunteers: {
        Row: {
          availability: string | null
          created_at: string | null
          id: string
          kitchen_id: string
          role: string | null
          user_id: string
        }
        Insert: {
          availability?: string | null
          created_at?: string | null
          id?: string
          kitchen_id: string
          role?: string | null
          user_id: string
        }
        Update: {
          availability?: string | null
          created_at?: string | null
          id?: string
          kitchen_id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_volunteers_kitchen_id_fkey"
            columns: ["kitchen_id"]
            isOneToOne: false
            referencedRelation: "community_kitchens"
            referencedColumns: ["id"]
          },
        ]
      }
      lost_found_items: {
        Row: {
          category: string
          contact_phone: string
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          location: string
          posted_by: string
          status: Database["public"]["Enums"]["item_status"] | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          contact_phone: string
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          location: string
          posted_by: string
          status?: Database["public"]["Enums"]["item_status"] | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          contact_phone?: string
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          posted_by?: string
          status?: Database["public"]["Enums"]["item_status"] | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lost_found_items_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_centers: {
        Row: {
          address: string
          contact: string
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          specialization: string | null
          timings: string | null
          type: string
        }
        Insert: {
          address: string
          contact: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          specialization?: string | null
          timings?: string | null
          type: string
        }
        Update: {
          address?: string
          contact?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          specialization?: string | null
          timings?: string | null
          type?: string
        }
        Relationships: []
      }
      medicine_inventory: {
        Row: {
          address: string
          contact: string
          created_at: string | null
          id: string
          last_updated: string | null
          latitude: number | null
          longitude: number | null
          medicine_name: string
          pharmacy_name: string
          stock_status: string
        }
        Insert: {
          address: string
          contact: string
          created_at?: string | null
          id?: string
          last_updated?: string | null
          latitude?: number | null
          longitude?: number | null
          medicine_name: string
          pharmacy_name: string
          stock_status?: string
        }
        Update: {
          address?: string
          contact?: string
          created_at?: string | null
          id?: string
          last_updated?: string | null
          latitude?: number | null
          longitude?: number | null
          medicine_name?: string
          pharmacy_name?: string
          stock_status?: string
        }
        Relationships: []
      }
      pickups: {
        Row: {
          address: string
          created_at: string | null
          id: string
          notes: string | null
          preferred_date: string
          status: string | null
          updated_at: string | null
          user_id: string
          waste_type: string
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          notes?: string | null
          preferred_date: string
          status?: string | null
          updated_at?: string | null
          user_id: string
          waste_type: string
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          preferred_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
          waste_type?: string
        }
        Relationships: []
      }
      poll_votes: {
        Row: {
          created_at: string | null
          id: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          option_index?: number
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          description: string | null
          expires_at: string | null
          id: string
          image_url: string | null
          options: Json
          status: Database["public"]["Enums"]["item_status"] | null
          title: string
          total_votes: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          description?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          options: Json
          status?: Database["public"]["Enums"]["item_status"] | null
          title: string
          total_votes?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          options?: Json
          status?: Database["public"]["Enums"]["item_status"] | null
          title?: string
          total_votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "polls_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_reports: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          location: string
          reported_by: string
          status: string | null
          title: string
          upvotes: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          location: string
          reported_by: string
          status?: string | null
          title: string
          upvotes?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          reported_by?: string
          status?: string | null
          title?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "problem_reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_upvotes: {
        Row: {
          created_at: string | null
          id: string
          problem_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          problem_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          problem_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_upvotes_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problem_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_upvotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          points: number | null
          show_on_leaderboard: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          phone?: string | null
          points?: number | null
          show_on_leaderboard?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          points?: number | null
          show_on_leaderboard?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      recyclables: {
        Row: {
          contact_info: string
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          item_name: string
          price: number | null
          quantity: string
          status: Database["public"]["Enums"]["item_status"] | null
          user_id: string
        }
        Insert: {
          contact_info: string
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          item_name: string
          price?: number | null
          quantity: string
          status?: Database["public"]["Enums"]["item_status"] | null
          user_id: string
        }
        Update: {
          contact_info?: string
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          item_name?: string
          price?: number | null
          quantity?: string
          status?: Database["public"]["Enums"]["item_status"] | null
          user_id?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: []
      }
      service_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number
          service_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating: number
          service_id: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          service_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          availability: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          location: string
          price_max: number | null
          price_min: number | null
          provider_id: string
          rating: number | null
          status: Database["public"]["Enums"]["item_status"] | null
          title: string
          total_reviews: number | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          availability?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          location: string
          price_max?: number | null
          price_min?: number | null
          provider_id: string
          rating?: number | null
          status?: Database["public"]["Enums"]["item_status"] | null
          title: string
          total_reviews?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          availability?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          location?: string
          price_max?: number | null
          price_min?: number | null
          provider_id?: string
          rating?: number | null
          status?: Database["public"]["Enums"]["item_status"] | null
          title?: string
          total_reviews?: number | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_organizations: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          donation_link: string | null
          id: string
          image_url: string | null
          location: string
          name: string
          type: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          donation_link?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          type: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          donation_link?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          type?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          created_at: string | null
          id: string
          responses: Json
          survey_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          responses: Json
          survey_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          responses?: Json
          survey_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          category: string
          created_at: string | null
          created_by: string
          description: string | null
          expires_at: string | null
          id: string
          is_anonymous: boolean | null
          questions: Json
          status: Database["public"]["Enums"]["item_status"] | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          questions: Json
          status?: Database["public"]["Enums"]["item_status"] | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          questions?: Json
          status?: Database["public"]["Enums"]["item_status"] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "surveys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_food_impact: {
        Row: {
          action_description: string | null
          action_type: string
          created_at: string | null
          id: string
          impact_points: number | null
          user_id: string
        }
        Insert: {
          action_description?: string | null
          action_type: string
          created_at?: string | null
          id?: string
          impact_points?: number | null
          user_id: string
        }
        Update: {
          action_description?: string | null
          action_type?: string
          created_at?: string | null
          id?: string
          impact_points?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_points: {
        Row: {
          action_description: string | null
          action_type: string
          created_at: string | null
          id: string
          points: number | null
          user_id: string
        }
        Insert: {
          action_description?: string | null
          action_type: string
          created_at?: string | null
          id?: string
          points?: number | null
          user_id: string
        }
        Update: {
          action_description?: string | null
          action_type?: string
          created_at?: string | null
          id?: string
          points?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_opportunities: {
        Row: {
          created_at: string | null
          date: string | null
          description: string
          id: string
          location: string
          organization_id: string | null
          status: Database["public"]["Enums"]["item_status"] | null
          title: string
          volunteers_needed: number | null
          volunteers_registered: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          description: string
          id?: string
          location: string
          organization_id?: string | null
          status?: Database["public"]["Enums"]["item_status"] | null
          title: string
          volunteers_needed?: number | null
          volunteers_registered?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          description?: string
          id?: string
          location?: string
          organization_id?: string | null
          status?: Database["public"]["Enums"]["item_status"] | null
          title?: string
          volunteers_needed?: number | null
          volunteers_registered?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_opportunities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "social_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_registrations: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_registrations_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "volunteer_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      employment_type: "full-time" | "part-time" | "freelance" | "contract"
      event_status: "upcoming" | "ongoing" | "completed" | "cancelled"
      item_status: "active" | "resolved" | "expired"
      job_type: "skilled" | "unskilled"
      resource_type: "food" | "clothes" | "books" | "furniture" | "other"
      urgency_level: "low" | "medium" | "high" | "urgent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      employment_type: ["full-time", "part-time", "freelance", "contract"],
      event_status: ["upcoming", "ongoing", "completed", "cancelled"],
      item_status: ["active", "resolved", "expired"],
      job_type: ["skilled", "unskilled"],
      resource_type: ["food", "clothes", "books", "furniture", "other"],
      urgency_level: ["low", "medium", "high", "urgent"],
    },
  },
} as const
