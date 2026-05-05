-- ========================================
-- COMPREHENSIVE TEXT-BASED CMS STRUCTURE
-- ========================================
-- Complete key-value structure for all site content

-- Clear existing content
DELETE FROM site_content;

-- Insert comprehensive key-value pairs
INSERT INTO site_content (key, value) VALUES

-- 🔝 HEADER / NAVIGATION
('site_title', 'JADTRA Consulting'),
('nav_home', 'Home'),
('nav_about', 'About'),
('nav_services', 'Services'),
('nav_blog', 'Blog'),
('nav_tax', 'Tax Calculator'),
('nav_contact', 'Contact'),

-- 🏠 HERO SECTION
('hero_badge', 'Trusted by 500+ Companies'),
('hero_title', 'Trusted Consulting Partner for Business Growth'),
('hero_subtitle', 'Professional consulting services in business, taxation, and digital systems delivering certainty, growth, and sustainability.'),
('cta_primary', 'Consult Now'),
('cta_secondary', 'Tax Calculator'),

-- 📊 STATISTICS
('stat_exp', '15+ Years Experience'),
('stat_clients', '500+ Clients Served'),
('stat_satisfaction', '98% Client Satisfaction'),
('stat_support', '24/7 Support Available'),

-- 🏢 ABOUT SECTION
('about_text', 'JADTRA Consulting is a professional consulting firm under KKP Hakim Muhamad dan Rekan, providing strategic and reliable business solutions since 2010. We combine deep expertise with a commitment to educate and empower our clients.'),

-- 🧩 SERVICES SECTION
('services_title', 'Our Services'),
('service_1_title', 'Business Consulting'),
('service_1_desc', 'Strategic guidance for sustainable business growth and operational excellence.'),
('service_2_title', 'Tax & Accounting Advisory'),
('service_2_desc', 'Expert tax planning, compliance, and financial advisory services.'),
('service_3_title', 'Digital Transformation'),
('service_3_desc', 'Modernize your business with cutting-edge digital solutions and processes.'),
('service_4_title', 'System Development Planning'),
('service_4_desc', 'Comprehensive planning for scalable and efficient system architectures.'),

-- 🦶 FOOTER SECTION
('footer_company', 'KKP Hakim Muhamad dan Rekan'),
('footer_email', 'info@jadtraconsulting.com'),
('footer_phone', '+62 21 0000 0000'),
('footer_location', 'Jakarta, Indonesia'),
('footer_copyright', '© 2026 JADTRA Consulting. All rights reserved.');

-- Verify insertion
SELECT * FROM site_content ORDER BY key;
