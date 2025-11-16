-- Fix rate_rules table schema inconsistencies
-- Add missing columns and migrate data from differently named columns

DO $$ 
BEGIN
    -- Check if rate_rules table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rate_rules') THEN
        
        -- Fix is_active column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'is_active') THEN
            
            -- Check if active column exists
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'active') THEN
                -- Rename active to is_active
                ALTER TABLE rate_rules RENAME COLUMN active TO is_active;
                RAISE NOTICE 'Renamed active column to is_active in rate_rules table';
            ELSE
                -- Add is_active column if neither exists
                ALTER TABLE rate_rules ADD COLUMN is_active BOOLEAN DEFAULT true NOT NULL;
                RAISE NOTICE 'Added is_active column to rate_rules table';
            END IF;
            
        END IF;
        
        -- Fix modifier_type column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'modifier_type') THEN
            
            -- Check if price_modifier_type column exists
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'price_modifier_type') THEN
                -- Rename price_modifier_type to modifier_type
                ALTER TABLE rate_rules RENAME COLUMN price_modifier_type TO modifier_type;
                RAISE NOTICE 'Renamed price_modifier_type column to modifier_type in rate_rules table';
            ELSE
                -- Add modifier_type column if neither exists
                ALTER TABLE rate_rules ADD COLUMN modifier_type VARCHAR(20) DEFAULT 'percentage' NOT NULL 
                CHECK (modifier_type IN ('percentage', 'fixed_amount', 'absolute_price'));
                RAISE NOTICE 'Added modifier_type column to rate_rules table';
            END IF;
            
        END IF;

        -- Fix rule_type column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'rule_type') THEN
            -- Add rule_type column
            ALTER TABLE rate_rules ADD COLUMN rule_type VARCHAR(20) DEFAULT 'seasonal' NOT NULL 
            CHECK (rule_type IN ('seasonal', 'weekend', 'holiday', 'minimum_stay', 'advance_booking', 'last_minute', 'custom'));
            RAISE NOTICE 'Added rule_type column to rate_rules table';
        END IF;

        -- Fix price_modifier column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'price_modifier') THEN
            
            -- Check if modifier_amount column exists
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'modifier_amount') THEN
                -- Rename modifier_amount to price_modifier
                ALTER TABLE rate_rules RENAME COLUMN modifier_amount TO price_modifier;
                RAISE NOTICE 'Renamed modifier_amount column to price_modifier in rate_rules table';
            ELSE
                -- Add price_modifier column if neither exists
                ALTER TABLE rate_rules ADD COLUMN price_modifier DECIMAL(10,2) DEFAULT 0.00 NOT NULL;
                RAISE NOTICE 'Added price_modifier column to rate_rules table';
            END IF;
            
        END IF;

        -- Fix priority column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'priority') THEN
            ALTER TABLE rate_rules ADD COLUMN priority INTEGER DEFAULT 0 NOT NULL;
            RAISE NOTICE 'Added priority column to rate_rules table';
        END IF;

        -- Fix conditions column
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'conditions') THEN
            ALTER TABLE rate_rules ADD COLUMN conditions JSONB DEFAULT '{}' NOT NULL;
            RAISE NOTICE 'Added conditions column to rate_rules table';
        END IF;

        -- Ensure essential columns exist with proper defaults
        -- Fix name column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'name') THEN
            ALTER TABLE rate_rules ADD COLUMN name VARCHAR(255) DEFAULT 'Unnamed Rule' NOT NULL;
            RAISE NOTICE 'Added name column to rate_rules table';
        END IF;

        -- Fix property_id column if missing
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'rate_rules' AND column_name = 'property_id') THEN
            ALTER TABLE rate_rules ADD COLUMN property_id UUID;
            RAISE NOTICE 'Added property_id column to rate_rules table';
        END IF;

        -- Ensure the columns have the right defaults and constraints
        ALTER TABLE rate_rules ALTER COLUMN is_active SET DEFAULT true;
        ALTER TABLE rate_rules ALTER COLUMN is_active SET NOT NULL;
        ALTER TABLE rate_rules ALTER COLUMN modifier_type SET DEFAULT 'percentage';
        ALTER TABLE rate_rules ALTER COLUMN modifier_type SET NOT NULL;
        ALTER TABLE rate_rules ALTER COLUMN rule_type SET DEFAULT 'seasonal';
        ALTER TABLE rate_rules ALTER COLUMN rule_type SET NOT NULL;
        ALTER TABLE rate_rules ALTER COLUMN price_modifier SET DEFAULT 0.00;
        ALTER TABLE rate_rules ALTER COLUMN price_modifier SET NOT NULL;
        ALTER TABLE rate_rules ALTER COLUMN priority SET DEFAULT 0;
        ALTER TABLE rate_rules ALTER COLUMN priority SET NOT NULL;
        ALTER TABLE rate_rules ALTER COLUMN conditions SET DEFAULT '{}';
        ALTER TABLE rate_rules ALTER COLUMN conditions SET NOT NULL;
        
        -- Create indexes if they don't exist
        CREATE INDEX IF NOT EXISTS idx_rate_rules_active ON rate_rules(is_active);
        CREATE INDEX IF NOT EXISTS idx_rate_rules_property_dates ON rate_rules(property_id, start_date, end_date) WHERE is_active = true;
        CREATE INDEX IF NOT EXISTS idx_rate_rules_priority ON rate_rules(priority DESC) WHERE is_active = true;
        
        RAISE NOTICE 'Rate rules schema fixed successfully';
    ELSE
        RAISE NOTICE 'Rate rules table does not exist - no action needed';
    END IF;
    
    -- Fix blackout_dates table as well
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blackout_dates') THEN
        
        -- Check if is_active column exists
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blackout_dates' AND column_name = 'is_active') THEN
            
            -- Check if active column exists
            IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blackout_dates' AND column_name = 'active') THEN
                -- Rename active to is_active
                ALTER TABLE blackout_dates RENAME COLUMN active TO is_active;
                RAISE NOTICE 'Renamed active column to is_active in blackout_dates table';
            ELSE
                -- Add is_active column if neither exists
                ALTER TABLE blackout_dates ADD COLUMN is_active BOOLEAN DEFAULT true NOT NULL;
                RAISE NOTICE 'Added is_active column to blackout_dates table';
            END IF;
            
        END IF;
        
        -- Ensure the column has the right default and not null constraint
        ALTER TABLE blackout_dates ALTER COLUMN is_active SET DEFAULT true;
        ALTER TABLE blackout_dates ALTER COLUMN is_active SET NOT NULL;
        
        -- Create index if it doesn't exist
        CREATE INDEX IF NOT EXISTS idx_blackout_dates_active ON blackout_dates(is_active);
        
        RAISE NOTICE 'Blackout dates schema fixed successfully';
    ELSE
        RAISE NOTICE 'Blackout dates table does not exist - no action needed';
    END IF;
    
END $$;

-- Force refresh Supabase schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the schema is correct
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('rate_rules', 'blackout_dates') 
  AND column_name IN ('is_active', 'modifier_type', 'rule_type', 'price_modifier', 'priority', 'conditions', 'name', 'property_id')
ORDER BY table_name, column_name;