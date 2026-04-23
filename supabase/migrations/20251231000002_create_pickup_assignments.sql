-- Create pickup_assignments table for tracking agent assignments
CREATE TABLE IF NOT EXISTS public.pickup_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  pickup_request_id uuid NOT NULL,
  pickup_agent_id uuid NOT NULL,
  assigned_amount numeric(10, 2) NOT NULL,
  collected_amount numeric(10, 2) NULL DEFAULT 0,
  notes text NULL,
  status text NULL DEFAULT 'assigned'::text,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT pickup_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT fk_pickup_agent FOREIGN KEY (pickup_agent_id) REFERENCES pickup_agents (id) ON DELETE CASCADE,
  CONSTRAINT fk_pickup_request FOREIGN KEY (pickup_request_id) REFERENCES pickup_requests (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_pickup_assignments_agent ON public.pickup_assignments(pickup_agent_id);
CREATE INDEX IF NOT EXISTS idx_pickup_assignments_request ON public.pickup_assignments(pickup_request_id);
CREATE INDEX IF NOT EXISTS idx_pickup_assignments_status ON public.pickup_assignments(status);

-- Disable RLS for now since admins manage this table via service role
-- and pickup partners use custom auth (not Supabase auth)
ALTER TABLE public.pickup_assignments DISABLE ROW LEVEL SECURITY;

-- Add comment
COMMENT ON TABLE public.pickup_assignments IS 'Tracks assignment of pickup requests to agents with amounts and status';
