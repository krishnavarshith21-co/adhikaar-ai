CREATE TABLE citizen_workspaces (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    content TEXT,
    revision BIGINT NOT NULL DEFAULT 0
);
