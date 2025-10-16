-- Add volunteer_spots and impact_data to events table
ALTER TABLE events 
ADD COLUMN volunteer_spots INTEGER,
ADD COLUMN volunteers_joined INTEGER DEFAULT 0,
ADD COLUMN impact_data JSONB;

-- Create event_volunteers table for volunteer sign-ups
CREATE TABLE event_volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  volunteer_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_volunteers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can volunteer for events"
ON event_volunteers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view event volunteers"
ON event_volunteers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can remove their volunteer status"
ON event_volunteers FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Update event_rsvps to track RSVP type (going vs interested)
ALTER TABLE event_rsvps
ADD COLUMN rsvp_type TEXT DEFAULT 'going' CHECK (rsvp_type IN ('going', 'interested'));

-- Add unique constraint for user per event (they can only have one RSVP type)
ALTER TABLE event_rsvps DROP CONSTRAINT IF EXISTS event_rsvps_event_id_user_id_key;
ALTER TABLE event_rsvps ADD CONSTRAINT event_rsvps_event_id_user_id_key UNIQUE(event_id, user_id);

-- Create function to update volunteer count
CREATE OR REPLACE FUNCTION update_event_volunteer_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events 
    SET volunteers_joined = volunteers_joined + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events 
    SET volunteers_joined = GREATEST(volunteers_joined - 1, 0)
    WHERE id = OLD.event_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_volunteer_count_trigger
AFTER INSERT OR DELETE ON event_volunteers
FOR EACH ROW EXECUTE FUNCTION update_event_volunteer_count();

-- Create function to update RSVP count by type
CREATE OR REPLACE FUNCTION update_event_rsvp_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events 
    SET rsvp_count = rsvp_count + 1
    WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events 
    SET rsvp_count = GREATEST(rsvp_count - 1, 0)
    WHERE id = OLD.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- No change to count if just updating type
    RETURN NEW;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS update_rsvp_count_trigger ON event_rsvps;
CREATE TRIGGER update_rsvp_count_trigger
AFTER INSERT OR DELETE ON event_rsvps
FOR EACH ROW EXECUTE FUNCTION update_event_rsvp_count();