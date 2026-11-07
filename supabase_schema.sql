-- ==========================================
-- COAUTORIA - MÓDULO VOZ: SUPABASE SCHEMA
-- Blindado com RLS, Storage Seguro, Moderação UGC e Exclusão Completa (LGPD / App Store / Play Store)
-- Execute este script no "SQL Editor" do seu painel Supabase
-- ==========================================

-- 0. TABELA DE ADMINISTRADORES & FUNÇÃO DE VERIFICAÇÃO
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem verificar se são admin" ON public.admin_users;
CREATE POLICY "Usuários podem verificar se são admin" ON public.admin_users
    FOR SELECT USING (auth.uid() = user_id);

-- Função auxiliar segura para verificar se o usuário logado é administrador
-- Checa tanto a tabela protegida admin_users quanto o custom claim em app_metadata (injetado apenas pelo servidor)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT (
        EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
        OR coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
    );
$$;


-- 1. PASSO 1: O Convite (Compromisso e Reflexões de Valores)
CREATE TABLE IF NOT EXISTS public.commitments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT,
    signature_name TEXT,
    accepted BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.commitments ADD COLUMN IF NOT EXISTS id UUID DEFAULT gen_random_uuid();
ALTER TABLE public.commitments ADD COLUMN IF NOT EXISTS signature_name TEXT;
ALTER TABLE public.commitments ALTER COLUMN full_name DROP NOT NULL;

ALTER TABLE public.commitments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprio compromisso" ON public.commitments;
CREATE POLICY "Usuários gerenciam próprio compromisso" ON public.commitments
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.step1_reflections (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    selected_values JSONB DEFAULT '[]'::jsonb,
    q1 TEXT,
    q2 TEXT,
    q3 TEXT,
    q4 TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.step1_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprias reflexões do passo 1" ON public.step1_reflections;
CREATE POLICY "Usuários gerenciam próprias reflexões do passo 1" ON public.step1_reflections
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 2. PASSO 2: Bloco Mágico (Notas categorizadas)
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- 'alegria', 'vergonha', 'mudanca', 'segredo', 'gratidao'
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprias notas" ON public.notes;
CREATE POLICY "Usuários gerenciam próprias notas" ON public.notes
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 3. PASSO 3: Linha do Tempo Emocional (Eventos e Reflexão)
CREATE TABLE IF NOT EXISTS public.timeline_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    age INTEGER NOT NULL,
    emotion TEXT,
    score INTEGER DEFAULT 0,
    type TEXT DEFAULT 'alta',
    learning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.timeline_events ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0;
ALTER TABLE public.timeline_events ALTER COLUMN type DROP NOT NULL;
ALTER TABLE public.timeline_events ALTER COLUMN emotion DROP NOT NULL;

ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprios eventos" ON public.timeline_events;
CREATE POLICY "Usuários gerenciam próprios eventos" ON public.timeline_events
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.timeline_reflections (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    q1 TEXT,
    q2 TEXT,
    q3 TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.timeline_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprias reflexões da linha do tempo" ON public.timeline_reflections;
CREATE POLICY "Usuários gerenciam próprias reflexões da linha do tempo" ON public.timeline_reflections
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 4. PASSO 4: Mapa de Vida (Capítulos da Vida)
CREATE TABLE IF NOT EXISTS public.life_chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    chapter_id TEXT NOT NULL, -- 'raizes', 'descobertas', 'transicoes', 'presente'
    content JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, chapter_id)
);

ALTER TABLE public.life_chapters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprios capítulos de vida" ON public.life_chapters;
CREATE POLICY "Usuários gerenciam próprios capítulos de vida" ON public.life_chapters
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.life_map (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    roots JSONB DEFAULT '{}'::jsonb,
    trunk JSONB DEFAULT '{}'::jsonb,
    branches JSONB DEFAULT '{}'::jsonb,
    flowers JSONB DEFAULT '{}'::jsonb,
    fruits JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.life_map ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprio mapa de vida" ON public.life_map;
CREATE POLICY "Usuários gerenciam próprio mapa de vida" ON public.life_map
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 5. PASSO 5: Carta ao Meu Eu do Passado (Upload de Imagem)
CREATE TABLE IF NOT EXISTS public.past_letters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.past_letters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprias cartas passadas" ON public.past_letters;
CREATE POLICY "Usuários gerenciam próprias cartas passadas" ON public.past_letters
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 6. PASSO 6: O Espelho (Padrões e Crenças)
CREATE TABLE IF NOT EXISTS public.mirror_reflections (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    answers JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mirror_reflections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprias reflexões do espelho" ON public.mirror_reflections;
CREATE POLICY "Usuários gerenciam próprias reflexões do espelho" ON public.mirror_reflections
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.mirror_patterns (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    patterns JSONB DEFAULT '{}'::jsonb,
    beliefs JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mirror_patterns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprio espelho" ON public.mirror_patterns;
CREATE POLICY "Usuários gerenciam próprio espelho" ON public.mirror_patterns
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 7. PASSO 7: A Descoberta do Propósito (Declaração de Propósito)
CREATE TABLE IF NOT EXISTS public.purpose_statement (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT,
    who_i_was TEXT,
    who_i_became TEXT,
    message_audience TEXT,
    message_transformation TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.purpose_statement ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam própria declaração de propósito" ON public.purpose_statement;
CREATE POLICY "Usuários gerenciam própria declaração de propósito" ON public.purpose_statement
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.purpose_discovery (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    questions JSONB DEFAULT '{}'::jsonb,
    central_theme TEXT,
    purpose_statement JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.purpose_discovery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprio propósito" ON public.purpose_discovery;
CREATE POLICY "Usuários gerenciam próprio propósito" ON public.purpose_discovery
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 8. PASSO 8: Banco de Histórias Brutas
CREATE TABLE IF NOT EXISTS public.raw_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    age TEXT,
    emotion TEXT NOT NULL,
    people TEXT,
    lessons TEXT,
    content TEXT,
    has_potential BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.raw_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprias histórias" ON public.raw_stories;
CREATE POLICY "Usuários gerenciam próprias histórias" ON public.raw_stories
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 9. PASSO 9: Carta ao Futuro Contador de Histórias
CREATE TABLE IF NOT EXISTS public.future_letters (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT,
    checklist JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.future_letters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam própria carta futura" ON public.future_letters;
CREATE POLICY "Usuários gerenciam própria carta futura" ON public.future_letters
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 10. ACERVO DE HISTÓRIAS & RODA DE HISTÓRIAS (COMUNIDADE)
CREATE TABLE IF NOT EXISTS public.user_stories (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    author_name TEXT,
    title TEXT NOT NULL,
    content TEXT,
    theme TEXT DEFAULT 'Superação',
    format TEXT DEFAULT 'digitado', -- 'digitado', 'audio', 'escrito'
    audio_url TEXT,
    image_url TEXT,
    visibility TEXT DEFAULT 'privado', -- 'privado', 'publico', 'anonimo'
    status TEXT DEFAULT 'pendente_aprovacao', -- 'pendente_aprovacao', 'aprovado', 'rejeitado'
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    comments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_stories ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.user_stories ENABLE ROW LEVEL SECURITY;

-- Leitura: dono vê suas próprias, comunidade vê apenas aprovadas e públicas/anônimas, admin vê todas para moderar
DROP POLICY IF EXISTS "Leitura de histórias próprias ou públicas aprovadas" ON public.user_stories;
CREATE POLICY "Leitura de histórias próprias ou públicas aprovadas" ON public.user_stories
    FOR SELECT USING (
        auth.uid() = user_id
        OR (visibility != 'privado' AND status = 'aprovado')
        OR public.is_admin()
    );

-- Inserção: apenas o próprio usuário autenticado
DROP POLICY IF EXISTS "Usuários inserem próprias histórias" ON public.user_stories;
CREATE POLICY "Usuários inserem próprias histórias" ON public.user_stories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Atualização: próprio autor, administrador (moderação) ou membros autenticados interagindo (curtidas/comentários) em histórias públicas aprovadas
DROP POLICY IF EXISTS "Usuários atualizam próprias histórias" ON public.user_stories;
CREATE POLICY "Usuários atualizam próprias histórias" ON public.user_stories
    FOR UPDATE TO authenticated
    USING (
        auth.uid() = user_id
        OR public.is_admin()
        OR (visibility != 'privado' AND status = 'aprovado')
    )
    WITH CHECK (
        auth.uid() = user_id
        OR public.is_admin()
        OR (visibility != 'privado' AND status = 'aprovado')
    );

-- Exclusão: próprio autor ou administrador
DROP POLICY IF EXISTS "Usuários excluem próprias histórias" ON public.user_stories;
CREATE POLICY "Usuários excluem próprias histórias" ON public.user_stories
    FOR DELETE USING (auth.uid() = user_id OR public.is_admin());

-- TRIGGER DE SEGURANÇA (F-01 / F-03): Impede que usuários comuns auto-aprovem histórias públicas
-- ou alterem histórias de terceiros (permitindo apenas curtir/comentar em histórias aprovadas).
CREATE OR REPLACE FUNCTION public.enforce_user_story_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        IF TG_OP = 'INSERT' THEN
            NEW.likes_count := 0;
            NEW.comments_count := 0;
            IF NEW.visibility = 'privado' THEN
                NEW.status := 'aprovado';
            ELSE
                NEW.status := 'pendente_aprovacao';
            END IF;
        ELSIF TG_OP = 'UPDATE' THEN
            -- Se não for o próprio autor, só pode atualizar curtidas e comentários de uma história pública aprovada
            IF auth.uid() IS DISTINCT FROM OLD.user_id THEN
                NEW.id := OLD.id;
                NEW.user_id := OLD.user_id;
                NEW.author_name := OLD.author_name;
                NEW.title := OLD.title;
                NEW.content := OLD.content;
                NEW.theme := OLD.theme;
                NEW.format := OLD.format;
                NEW.audio_url := OLD.audio_url;
                NEW.image_url := OLD.image_url;
                NEW.visibility := OLD.visibility;
                NEW.status := OLD.status;
                NEW.created_at := OLD.created_at;
                RETURN NEW;
            END IF;

            -- Próprio autor atualizando sua história: não pode alterar user_id nem auto-aprovar
            NEW.user_id := OLD.user_id;

            IF NEW.visibility = 'privado' THEN
                NEW.status := 'aprovado';
            ELSIF OLD.visibility = 'privado' AND NEW.visibility != 'privado' THEN
                -- Mudou de privado para público/anônimo: exige moderação
                NEW.status := 'pendente_aprovacao';
            ELSIF NEW.title IS DISTINCT FROM OLD.title
               OR NEW.content IS DISTINCT FROM OLD.content
               OR NEW.audio_url IS DISTINCT FROM OLD.audio_url
               OR NEW.image_url IS DISTINCT FROM OLD.image_url THEN
                -- Editou o conteúdo de uma história pública: volta para moderação
                NEW.status := 'pendente_aprovacao';
            ELSE
                -- Mantém o status anterior (usuário comum não pode forçar status = 'aprovado')
                NEW.status := OLD.status;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_user_story_security ON public.user_stories;
CREATE TRIGGER trg_enforce_user_story_security
    BEFORE INSERT OR UPDATE ON public.user_stories
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_user_story_security();


-- ==========================================
-- 11. MODERAÇÃO UGC (EXIGÊNCIA APPLE APP STORE GUIDELINE 1.2 & GOOGLE PLAY)
-- Denúncias de conteúdo (story_reports) e Bloqueio de usuários (blocked_users)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.story_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    story_id TEXT NOT NULL,
    comment_id TEXT,
    reason TEXT NOT NULL CHECK (char_length(reason) <= 200),
    details TEXT CHECK (details IS NULL OR char_length(details) <= 2000),
    status TEXT DEFAULT 'pendente', -- 'pendente', 'analisado', 'removido'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índice único anti-spam (F-07): impede que o mesmo usuário envie múltiplas denúncias idênticas para o mesmo item
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_story_report
    ON public.story_reports (reporter_id, story_id, coalesce(comment_id, ''));

ALTER TABLE public.story_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários autenticados podem enviar denúncias" ON public.story_reports;
CREATE POLICY "Usuários autenticados podem enviar denúncias" ON public.story_reports
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Usuários veem próprias denúncias e admins veem todas" ON public.story_reports;
CREATE POLICY "Usuários veem próprias denúncias e admins veem todas" ON public.story_reports
    FOR SELECT TO authenticated
    USING (auth.uid() = reporter_id OR public.is_admin());

DROP POLICY IF EXISTS "Apenas admins atualizam status de denúncias" ON public.story_reports;
CREATE POLICY "Apenas admins atualizam status de denúncias" ON public.story_reports
    FOR UPDATE TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.blocked_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blocker_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    blocked_user_id TEXT NOT NULL,
    blocked_author_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(blocker_id, blocked_user_id)
);

ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam próprios bloqueios" ON public.blocked_users;
CREATE POLICY "Usuários gerenciam próprios bloqueios" ON public.blocked_users
    FOR ALL TO authenticated
    USING (auth.uid() = blocker_id)
    WITH CHECK (auth.uid() = blocker_id);


-- ==========================================
-- 11B. NOVIDADES DA PLATAFORMA (PUBLICAÇÕES DO ADMIN COM IMAGEM, CURTIDAS E COMENTÁRIOS)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.app_news (
    id TEXT PRIMARY KEY,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author TEXT NOT NULL DEFAULT 'Equipe Coautoria',
    badge TEXT NOT NULL DEFAULT 'Destaque',
    title TEXT NOT NULL CHECK (char_length(title) <= 300),
    content TEXT NOT NULL CHECK (char_length(content) <= 25000),
    date_label TEXT NOT NULL,
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    comments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.app_news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura pública de novidades" ON public.app_news;
CREATE POLICY "Leitura pública de novidades" ON public.app_news
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Apenas admins criam novidades" ON public.app_news;
CREATE POLICY "Apenas admins criam novidades" ON public.app_news
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Usuários interagem e admins editam novidades" ON public.app_news;
CREATE POLICY "Usuários interagem e admins editam novidades" ON public.app_news
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Apenas admins excluem novidades" ON public.app_news;
CREATE POLICY "Apenas admins excluem novidades" ON public.app_news
    FOR DELETE TO authenticated
    USING (public.is_admin());


-- ==========================================
-- 12. CONFIGURAÇÃO DE STORAGE (BUCKETS SEGUROS COM LIMITE DE TAMANHO E PASTA POR USUÁRIO)
-- ==========================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'letters',
    'letters',
    true,
    5242880, -- 5 MB máximo por imagem
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'audio_stories',
    'audio_stories',
    true,
    15728640, -- 15 MB máximo por áudio
    ARRAY['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/aac']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Políticas de Segurança para o Bucket 'letters'
DROP POLICY IF EXISTS "Acesso Público para Leitura de Cartas" ON storage.objects;
CREATE POLICY "Acesso Público para Leitura de Cartas" ON storage.objects
    FOR SELECT USING (bucket_id = 'letters');

DROP POLICY IF EXISTS "Usuários Autenticados podem fazer Upload de Cartas" ON storage.objects;
CREATE POLICY "Usuários Autenticados podem fazer Upload de Cartas" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'letters'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR name LIKE '%' || auth.uid()::text || '%'
        )
    );

DROP POLICY IF EXISTS "Usuários Autenticados podem excluir próprias Cartas" ON storage.objects;
CREATE POLICY "Usuários Autenticados podem excluir próprias Cartas" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'letters'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR name LIKE '%' || auth.uid()::text || '%'
        )
    );

-- Políticas de Segurança para o Bucket 'audio_stories'
DROP POLICY IF EXISTS "Acesso Público para Leitura de Áudios" ON storage.objects;
CREATE POLICY "Acesso Público para Leitura de Áudios" ON storage.objects
    FOR SELECT USING (bucket_id = 'audio_stories');

DROP POLICY IF EXISTS "Usuários Autenticados podem fazer Upload de Áudios" ON storage.objects;
CREATE POLICY "Usuários Autenticados podem fazer Upload de Áudios" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'audio_stories'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR name LIKE '%' || auth.uid()::text || '%'
        )
    );

DROP POLICY IF EXISTS "Usuários Autenticados podem excluir próprios Áudios" ON storage.objects;
CREATE POLICY "Usuários Autenticados podem excluir próprios Áudios" ON storage.objects
    FOR DELETE TO authenticated
    USING (
        bucket_id = 'audio_stories'
        AND (
            (storage.foldername(name))[1] = auth.uid()::text
            OR name LIKE '%' || auth.uid()::text || '%'
        )
    );


-- ==========================================
-- 13. FUNÇÃO RPC PARA EXCLUSÃO COMPLETA E IRREVERSÍVEL DA CONTA
-- Exigência Obrigatória: Apple App Store (Guideline 5.1.1(v)) & Google Play Data Deletion
-- ==========================================

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage, auth
AS $$
DECLARE
    current_uid UUID;
BEGIN
    current_uid := auth.uid();
    IF current_uid IS NULL THEN
        RAISE EXCEPTION 'Usuário não autenticado.';
    END IF;

    -- 1. Remove arquivos do usuário no Storage (letters e audio_stories)
    DELETE FROM storage.objects
    WHERE bucket_id IN ('letters', 'audio_stories')
      AND (
          owner = current_uid
          OR (storage.foldername(name))[1] = current_uid::text
          OR name LIKE '%' || current_uid::text || '%'
      );

    -- 2. Remove dados das tabelas públicas (ON DELETE CASCADE já cobre, mas garantimos explicitamente)
    DELETE FROM public.commitments WHERE user_id = current_uid;
    DELETE FROM public.notes WHERE user_id = current_uid;
    DELETE FROM public.timeline_events WHERE user_id = current_uid;
    DELETE FROM public.timeline_reflections WHERE user_id = current_uid;
    DELETE FROM public.life_map WHERE user_id = current_uid;
    DELETE FROM public.past_letters WHERE user_id = current_uid;
    DELETE FROM public.mirror_patterns WHERE user_id = current_uid;
    DELETE FROM public.purpose_discovery WHERE user_id = current_uid;
    DELETE FROM public.raw_stories WHERE user_id = current_uid;
    DELETE FROM public.future_letters WHERE user_id = current_uid;
    DELETE FROM public.user_stories WHERE user_id = current_uid;
    DELETE FROM public.blocked_users WHERE blocker_id = current_uid;

    -- 3. Remove definitivamente o registro de autenticação em auth.users
    DELETE FROM auth.users WHERE id = current_uid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated;
