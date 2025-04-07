
-- Função para criar um perfil sem um usuário de autenticação associado
-- Útil para sincronização de usuários de sistemas externos como o LearnWorlds
CREATE OR REPLACE FUNCTION public.create_profile_without_auth(
  user_email TEXT,
  user_first_name TEXT DEFAULT NULL,
  user_last_name TEXT DEFAULT NULL,
  user_phone TEXT DEFAULT NULL,
  user_learnworlds_id TEXT DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id uuid;
  existing_id uuid;
BEGIN
  -- Verificar se já existe um perfil com este email
  SELECT id INTO existing_id FROM public.profiles WHERE email = user_email LIMIT 1;
  
  IF existing_id IS NOT NULL THEN
    -- Se já existe, atualizar e retornar o ID existente
    UPDATE public.profiles 
    SET 
      first_name = COALESCE(user_first_name, first_name),
      last_name = COALESCE(user_last_name, last_name),
      phone = COALESCE(user_phone, phone),
      learnworlds_id = COALESCE(user_learnworlds_id, learnworlds_id),
      updated_at = now()
    WHERE id = existing_id;
    
    RETURN existing_id;
  END IF;
  
  -- Criar um novo UUID para o perfil
  new_id := gen_random_uuid();
  
  -- Inserir o novo perfil
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name, 
    phone,
    learnworlds_id,
    created_at,
    updated_at,
    role
  ) VALUES (
    new_id, 
    user_email, 
    user_first_name, 
    user_last_name, 
    user_phone,
    user_learnworlds_id,
    now(),
    now(),
    'student'
  );
  
  RETURN new_id;
END;
$$;

COMMENT ON FUNCTION public.create_profile_without_auth IS 'Função para criar um perfil de usuário sem um registro de autenticação associado. Útil para importar usuários de sistemas externos.';
