
-- Update phone numbers for the specific medical centers
UPDATE medical_centers 
SET contact = '9063982693'
WHERE id = 'b2456fb2-b8b0-444c-86fd-6374e9695249' AND name = 'City General Hospital';

UPDATE medical_centers 
SET contact = '9647836575'
WHERE id = '9fcba6f7-e7d2-4a44-9fcb-b5730c2a6fdb' AND name = 'Green Park Clinic';

UPDATE medical_centers 
SET contact = '5746385769'
WHERE id = '5e383235-de30-4e36-9af9-8292b191b05b' AND name = 'Dr. Smith Dental Care';

UPDATE medical_centers 
SET contact = '9670899617'
WHERE id = '8b3c536c-68bd-4d98-b5c4-063f0a505fe0' AND name = 'Medicare Polyclinic';
