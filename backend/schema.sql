-- 1. Enable the Vector extension (Crucial for RAG)
create extension if not exists vector;

-- 2. Users Table (Core Entity)
-- Designed to be populated manually for the current "no auth" MVP iteration.
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  -- We'll allow null email for demo users without real sign-up
  email text,
  full_name text,
  xp int default 0,
  current_mode text default 'execution', -- 'execution', 'curiosity', 'learning'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Files Table (Metadata for uploaded notes and source files)
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  file_name text not null,
  file_path text not null, -- Path in Supabase Storage Bucket
  file_type text not null, -- 'md', 'pdf', 'txt'
  file_size int,
  status text default 'pending', -- 'pending', 'processing', 'indexed', 'failed'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Document Chunks (The Vector Store for RAG Queries)
-- Note: using 384 dimensions for local sentence-transformers (HuggingFace)
create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  file_id uuid references public.files(id) on delete cascade,
  chunk_index int not null,
  content text not null,
  metadata jsonb default '{}'::jsonb,
  embedding vector(384), 
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Index for Fast Retrieval
create index on public.document_chunks using hnsw (embedding vector_cosine_ops);


-- 6. Chat History (For Conversational Memory)
create table if not exists public.chat_history (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id),
    thread_id uuid not null, -- Groups messages into a single conversation thread
    role text not null, -- 'user' or 'assistant'
    content text not null,
    model_name text, -- e.g., 'gpt-4', 'gemini-2.5-flash'
    timestamp timestamp with time zone default timezone('utc'::text, now())
);

-- 7. User Progress Tracking (How much a user has learned on topics)
create table if not exists public.user_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.users(id),
    topic_name text not null, -- e.g., "Docker Networking", "Cypher Syntax"
    knowledge_score int default 0 check (knowledge_score >= 0 and knowledge_score <= 100),
    last_updated timestamp with time zone default timezone('utc'::text, now()),
    unique (user_id, topic_name) -- A user only needs one entry per topic
);