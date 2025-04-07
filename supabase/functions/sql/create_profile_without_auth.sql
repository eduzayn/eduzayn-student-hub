
CREATE OR REPLACE FUNCTION public.create_profile_without_auth(
  user_email TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  user_phone TEXT,
  user_learnworlds_id TEXT
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id UUID;
  existing_profile_id UUID;
BEGIN
  -- Verificar se já existe um perfil com este email
  SELECT id INTO existing_profile_id FROM profiles WHERE email = user_email LIMIT 1;
  
  -- Se já existe um perfil, apenas atualizar os dados
  IF existing_profile_id IS NOT NULL THEN
    UPDATE profiles
    SET 
      first_name = COALESCE(NULLIF(user_first_name, ''), first_name),
      last_name = COALESCE(NULLIF(user_last_name, ''), last_name),
      phone = COALESCE(NULLIF(user_phone, ''), phone),
      learnworlds_id = COALESCE(NULLIF(user_learnworlds_id, ''), learnworlds_id),
      updated_at = now()
    WHERE id = existing_profile_id;
    
    RETURN existing_profile_id;
  END IF;
  
  -- Se não existe perfil, criar um novo
  new_user_id := gen_random_uuid();
  
  INSERT INTO profiles (
    id,
    first_name,
    last_name,
    email,
    phone,
    learnworlds_id,
    role,
    created_at,
    updated_at
  )
  VALUES (
    new_user_id,
    user_first_name,
    user_last_name,
    user_email,
    user_phone,
    user_learnworlds_id,
    'student',
    now(),
    now()
  );
  
  RETURN new_user_id;
END;
$$;
