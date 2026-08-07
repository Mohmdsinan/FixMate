-- Insert initial categories
INSERT INTO categories (name, icon) VALUES
  ('Plumbing', 'Wrench'),
  ('Electrical', 'Zap'),
  ('Carpentry', 'Hammer'),
  ('Painting', 'Paintbrush'),
  ('Cleaning', 'Sparkles'),
  ('Appliance Repair', 'Tv'),
  ('Gardening', 'Flower2'),
  ('Pest Control', 'Bug'),
  ('CCTV Installation', 'Camera'),
  ('Interior Works', 'Home')
ON CONFLICT (name) DO NOTHING;

-- Seed single admin account (username: admin, password: admin123)
-- bcrypt hash for 'admin123'
INSERT INTO admins (username, password_hash) VALUES
  ('admin', '$2a$10$iK0SvdqJ.O5T9mGzT/eKxuPZf.eQjS07sC8r/P2D.JqBqT/aH1N4i')
ON CONFLICT (username) DO NOTHING;
