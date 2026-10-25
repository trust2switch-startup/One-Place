CREATE TABLE IF NOT EXISTS signups (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('channel_partner', 'college', 'worker', 'business', 'customer')),
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(254),
    city VARCHAR(100) NOT NULL,
    details TEXT CHECK (char_length(details) <= 2000),
    consent_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS signups_created_at_idx ON signups (created_at DESC);
CREATE INDEX IF NOT EXISTS signups_role_idx ON signups (role);
