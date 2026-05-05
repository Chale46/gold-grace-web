-- ========================================
-- TEXT-BASED CMS STRUCTURE UPDATE
-- ========================================
-- Change from HTML-based to text-based key-value storage

-- Clear existing HTML-based content
DELETE FROM site_content WHERE key IN ('header_html', 'homepage_content', 'footer_html');

-- Insert text-based key-value pairs
INSERT INTO site_content (key, value) VALUES
-- Hero Section
('hero_title', 'Trusted Consulting Partner for Business Growth'),
('hero_subtitle', 'Professional consulting services in business, taxation, and digital systems delivering certainty, growth, and sustainability.'),

-- Footer Section  
('footer_company', 'KKP Hakim Muhamad dan Rekan'),
('footer_email', 'info@jadtraconsulting.com'),
('footer_phone', '+62 21 0000 0000'),
('footer_address', 'Jakarta, Indonesia'),

-- Navigation and Links
('nav_home', 'Home'),
('nav_about', 'About'),
('nav_services', 'Services'),
('nav_contact', 'Contact'),

-- Contact Information
('contact_email', 'info@jadtraconsulting.com'),
('contact_phone', '+62 21 0000 0000'),
('contact_address', 'Jakarta, Indonesia'),

-- Social Media
('social_linkedin', 'https://linkedin.com/company/jadtra-consulting'),
('social_facebook', 'https://facebook.com/jadtraconsulting'),
('social_instagram', 'https://instagram.com/jadtraconsulting'),

-- Company Info
('company_name', 'JADTRA Consulting'),
('company_tagline', 'Your Trusted Business Partner'),
('company_description', 'Professional consulting firm specializing in business advisory, tax services, and digital transformation solutions.');

-- Verify insertion
SELECT * FROM site_content ORDER BY key;
