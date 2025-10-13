-- Create emergency contacts table
CREATE TABLE public.emergency_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  phone_number text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Policies for emergency contacts
CREATE POLICY "Emergency contacts viewable by everyone"
ON public.emergency_contacts FOR SELECT
USING (true);

CREATE POLICY "Admins can manage emergency contacts"
ON public.emergency_contacts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create medical centers table
CREATE TABLE public.medical_centers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  address text NOT NULL,
  type text NOT NULL,
  latitude numeric,
  longitude numeric,
  contact text NOT NULL,
  timings text,
  specialization text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medical_centers ENABLE ROW LEVEL SECURITY;

-- Policies for medical centers
CREATE POLICY "Medical centers viewable by everyone"
ON public.medical_centers FOR SELECT
USING (true);

CREATE POLICY "Admins can manage medical centers"
ON public.medical_centers FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create medicine inventory table
CREATE TABLE public.medicine_inventory (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pharmacy_name text NOT NULL,
  address text NOT NULL,
  contact text NOT NULL,
  medicine_name text NOT NULL,
  stock_status text NOT NULL DEFAULT 'in_stock',
  last_updated timestamp with time zone DEFAULT now(),
  latitude numeric,
  longitude numeric,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.medicine_inventory ENABLE ROW LEVEL SECURITY;

-- Policies for medicine inventory
CREATE POLICY "Medicine inventory viewable by everyone"
ON public.medicine_inventory FOR SELECT
USING (true);

CREATE POLICY "Admins can manage medicine inventory"
ON public.medicine_inventory FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert sample emergency contacts
INSERT INTO public.emergency_contacts (name, type, phone_number, description) VALUES
('Police', 'Emergency', '100', 'City Police Helpline'),
('Ambulance', 'Emergency', '108', '24x7 Medical Assistance'),
('Fire Department', 'Emergency', '101', 'Fire & Rescue Operations'),
('Women Helpline', 'Emergency', '181', 'Women in Distress'),
('Child Helpline', 'Emergency', '1098', 'Child Abuse & Missing Children');

-- Insert sample medical centers
INSERT INTO public.medical_centers (name, address, type, latitude, longitude, contact, timings, specialization) VALUES
('City General Hospital', '123 Main Street, Downtown', 'hospital', 12.9716, 77.5946, '+91-80-12345678', '24x7', 'General, Emergency, Surgery'),
('Green Park Clinic', '456 Park Road, Green Park', 'clinic', 12.9750, 77.6000, '+91-80-23456789', '9 AM - 9 PM', 'General, Pediatrics'),
('Dr. Smith Dental Care', '789 Health Avenue', 'doctor', 12.9800, 77.6100, '+91-80-34567890', '10 AM - 6 PM', 'Dentistry'),
('Medicare Polyclinic', '321 Care Street', 'clinic', 12.9650, 77.5900, '+91-80-45678901', '8 AM - 10 PM', 'General, Dermatology, Orthopedics');

-- Insert sample medicine inventory
INSERT INTO public.medicine_inventory (pharmacy_name, address, contact, medicine_name, stock_status, latitude, longitude) VALUES
('Apollo Pharmacy', '100 MG Road, Central', '+91-80-56789012', 'Paracetamol', 'in_stock', 12.9716, 77.5946),
('Apollo Pharmacy', '100 MG Road, Central', '+91-80-56789012', 'Amoxicillin', 'in_stock', 12.9716, 77.5946),
('MedPlus', '200 Brigade Road', '+91-80-67890123', 'Paracetamol', 'in_stock', 12.9750, 77.6000),
('MedPlus', '200 Brigade Road', '+91-80-67890123', 'Cetirizine', 'out_of_stock', 12.9750, 77.6000),
('HealthCare Pharmacy', '300 Residency Road', '+91-80-78901234', 'Ibuprofen', 'in_stock', 12.9800, 77.6100),
('Wellness Pharmacy', '400 Church Street', '+91-80-89012345', 'Paracetamol', 'in_stock', 12.9650, 77.5900);