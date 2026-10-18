-- ========================================================
-- SCHEMA SQL PARA O PROJETO COAUTORIA (MÉTODO VOAR)
-- Execute este script no SQL Editor do seu painel Supabase
-- ========================================================

-- 1. Tabela: commitments (Passo 1 - Termo de Compromisso)
CREATE TABLE IF NOT EXISTS public.commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    signature_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabela: step1_reflections (Passo 1 - Reflexões e Valores)
CREATE TABLE IF NOT EXISTS public.step1_reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    selected_values JSONB DEFAULT '[]'::jsonb,
    q1 TEXT DEFAULT '',
    q2 TEXT DEFAULT '',
    q3 TEXT DEFAULT '',
    q4 TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Tabela: notes (Passo 2 - Bloco Mágico)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL DEFAULT 'Memória',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tabela: timeline_events (Passo 3 - Linha do Tempo)
CREATE TABLE IF NOT EXISTS public.timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    emotion TEXT NOT NULL,
    age INTEGER NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Tabela: life_chapters (Passo 4 - Mapa de Vida)
CREATE TABLE IF NOT EXISTS public.life_chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    chapter_id TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_user_chapter UNIQUE (user_id, chapter_id)
);

-- 6. Tabela: past_letters (Passo 5 - Carta ao Passado)
CREATE TABLE IF NOT EXISTS public.past_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Tabela: mirror_reflections (Passo 6 - O Espelho)
CREATE TABLE IF NOT EXISTS public.mirror_reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    answers JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Tabela: purpose_statement (Passo 7 - Declaração de Propósito)
CREATE TABLE IF NOT EXISTS public.purpose_statement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    theme TEXT DEFAULT '',
    who_i_was TEXT DEFAULT '',
    who_i_became TEXT DEFAULT '',
    message_audience TEXT DEFAULT '',
    message_transformation TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Tabela: raw_stories (Passo 8 - Banco de Histórias Brutas)
CREATE TABLE IF NOT EXISTS public.raw_stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    lessons TEXT DEFAULT '',
    emotion TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Tabela: future_letters (Passo 9 - Carta ao Futuro)
CREATE TABLE IF NOT EXISTS public.future_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    image_url TEXT DEFAULT '',
    checklist JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. Tabela: user_stories (Acervo Geral, Minhas Histórias e Roda de Histórias)
CREATE TABLE IF NOT EXISTS public.user_stories (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    author_name TEXT DEFAULT 'Autor Coautoria',
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    theme TEXT DEFAULT 'Superação',
    format TEXT DEFAULT 'digitado',
    audio_url TEXT,
    image_url TEXT,
    visibility TEXT DEFAULT 'privado',
    status TEXT DEFAULT 'aprovado',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================================
-- HABILITAÇÃO DO ROW LEVEL SECURITY (RLS)
-- Garante que cada usuário acesse apenas seus próprios dados
-- ========================================================

ALTER TABLE public.commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.step1_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.past_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mirror_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purpose_statement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.future_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stories ENABLE ROW LEVEL SECURITY;

-- Políticas para tabelas individuais (CRUD do próprio usuário)
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT unnest(ARRAY[
            'commitments',
            'step1_reflections',
            'notes',
            'timeline_events',
            'life_chapters',
            'past_letters',
            'mirror_reflections',
            'purpose_statement',
            'raw_stories',
            'future_letters'
        ])
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Usuário gerencia seus dados em %I" ON public.%I;', tbl, tbl);
        EXECUTE format('
            CREATE POLICY "Usuário gerencia seus dados em %I"
            ON public.%I
            FOR ALL
            TO authenticated
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
        ', tbl, tbl);
    END LOOP;
END $$;

-- Políticas especiais para user_stories (Permite visualização pública daquelas aprovadas e não privadas)
DROP POLICY IF EXISTS "Usuários podem ver histórias públicas ou as suas próprias" ON public.user_stories;
CREATE POLICY "Usuários podem ver histórias públicas ou as suas próprias"
ON public.user_stories
FOR SELECT
USING (
    auth.uid() = user_id 
    OR (status = 'aprovado' AND visibility != 'privado')
);

DROP POLICY IF EXISTS "Usuários podem criar suas próprias histórias" ON public.user_stories;
CREATE POLICY "Usuários podem criar suas próprias histórias"
ON public.user_stories
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias histórias" ON public.user_stories;
CREATE POLICY "Usuários podem atualizar suas próprias histórias"
ON public.user_stories
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem excluir suas próprias histórias" ON public.user_stories;
CREATE POLICY "Usuários podem excluir suas próprias histórias"
ON public.user_stories
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ========================================================
-- BUCKETS DE STORAGE (letters e audio_stories)
-- ========================================================

-- Criar buckets se não existirem
INSERT INTO storage.buckets (id, name, public)
VALUES ('letters', 'letters', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('audio_stories', 'audio_stories', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de Storage para letters
DROP POLICY IF EXISTS "Acesso público de leitura para letters" ON storage.objects;
CREATE POLICY "Acesso público de leitura para letters"
ON storage.objects FOR SELECT
USING (bucket_id = 'letters');

DROP POLICY IF EXISTS "Usuários autenticados podem enviar cartas" ON storage.objects;
CREATE POLICY "Usuários autenticados podem enviar cartas"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'letters');

-- Políticas de Storage para audio_stories
DROP POLICY IF EXISTS "Acesso público de leitura para audio_stories" ON storage.objects;
CREATE POLICY "Acesso público de leitura para audio_stories"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio_stories');

DROP POLICY IF EXISTS "Usuários autenticados podem enviar áudios" ON storage.objects;
CREATE POLICY "Usuários autenticados podem enviar áudios"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio_stories');
