
-- Verifica se a coluna learnworlds_id já existe na tabela profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'learnworlds_id'
  ) THEN
    -- Adiciona a coluna learnworlds_id
    ALTER TABLE public.profiles ADD COLUMN learnworlds_id text;
    
    -- Adiciona um comentário à coluna
    COMMENT ON COLUMN public.profiles.learnworlds_id IS 'ID do usuário na plataforma LearnWorlds';
  END IF;
END $$;
