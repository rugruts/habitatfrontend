-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view all admin users" ON admin_users
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert admin users" ON admin_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update admin users" ON admin_users
  FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Insert default admin user
INSERT INTO admin_users (email, name, role) 
VALUES 
  ('admin@habitat.com', 'Admin User', 'admin'),
  ('info@habitatlobby.com', 'Info User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON admin_users TO authenticated;
GRANT ALL ON admin_users TO service_role;
