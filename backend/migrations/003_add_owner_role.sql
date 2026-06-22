-- Add owner role to user_role enum
\c kose;
ALTER TYPE user_role ADD VALUE 'owner';
