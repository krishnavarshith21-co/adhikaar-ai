ALTER TABLE scheme_providers ALTER COLUMN is_verified SET DEFAULT FALSE;
ALTER TABLE schemes ALTER COLUMN verification_status SET DEFAULT 'PENDING_REVIEW';
UPDATE rule_versions SET published_by = 'ADHIKAAR preliminary rules', notes = 'Historical local rule set; not an official government verification' WHERE published_by = 'Telangana Civic Verification Board';
