
-- Função para criar perfis sem autenticação direta (para importação em lote)
CREATE OR REPLACE FUNCTION public.create_profile_without_auth(
  user_email TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  user_phone TEXT,
  user_learnworlds_id TEXT
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id uuid;
BEGIN
  -- Gerar novo UUID para o usuário importado
  new_id := gen_random_uuid();
  
  -- Inserir no profiles
  INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    role,
    status,
    learnworlds_id,
    created_at,
    updated_at
  ) VALUES (
    new_id,
    user_email,
    user_first_name,
    user_last_name,
    user_phone,
    'student',
    'ativo',
    user_learnworlds_id,
    now(),
    now()
  );
  
  RETURN new_id;
END;
$$;
