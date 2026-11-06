-- ==============================================================================
-- MIGRATION: Update inquiry status values to include project lifecycle tracking
-- ==============================================================================

-- Drop the old check constraint
ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_status_check;

-- Add the new check constraint with extended status values
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_status_check 
CHECK (status IN ('new', 'reviewed', 'accepted', 'contacted', 'ongoing', 'finished', 'advance_payment_completed', 'payment_completed', 'archived'));

-- Update any existing 'reviewing' status to 'reviewed'
UPDATE public.inquiries SET status = 'reviewed' WHERE status = 'reviewing';

-- Update any existing 'converted' status to 'payment_completed'
UPDATE public.inquiries SET status = 'payment_completed' WHERE status = 'converted';

-- ==============================================================================
-- VERIFICATION QUERY (Optional)
-- ==============================================================================
-- Run this to verify the constraint was updated:
-- SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'public.inquiries'::regclass AND contype = 'c';
