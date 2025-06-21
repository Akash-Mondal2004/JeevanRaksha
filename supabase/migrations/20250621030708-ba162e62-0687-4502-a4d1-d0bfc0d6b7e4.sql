
-- Create emergency alerts table
CREATE TABLE public.emergency_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  emergency_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location JSONB,
  status TEXT NOT NULL DEFAULT 'active',
  volunteer_id UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  user_type TEXT NOT NULL DEFAULT 'user' CHECK (user_type IN ('user', 'volunteer')),
  phone TEXT,
  location JSONB,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_id UUID REFERENCES public.emergency_alerts NOT NULL,
  sender_id UUID REFERENCES auth.users NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'location', 'image')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for emergency_alerts
CREATE POLICY "Users can view their own alerts and volunteers can view all" 
  ON public.emergency_alerts FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    auth.uid() = volunteer_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'volunteer')
  );

CREATE POLICY "Users can create their own alerts" 
  ON public.emergency_alerts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and assigned volunteers can update alerts" 
  ON public.emergency_alerts FOR UPDATE 
  USING (auth.uid() = user_id OR auth.uid() = volunteer_id);

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages from their alerts" 
  ON public.chat_messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.emergency_alerts 
      WHERE id = alert_id AND (user_id = auth.uid() OR volunteer_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages to their alerts" 
  ON public.chat_messages FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.emergency_alerts 
      WHERE id = alert_id AND (user_id = auth.uid() OR volunteer_id = auth.uid())
    )
  );

-- Enable realtime for chat messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Enable realtime for emergency alerts
ALTER TABLE public.emergency_alerts REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.emergency_alerts;

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'user_type', 'user')
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to assign volunteers to emergency alerts
CREATE OR REPLACE FUNCTION public.assign_volunteer_to_alert(alert_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  volunteer_id UUID;
BEGIN
  -- Find an available volunteer
  SELECT id INTO volunteer_id
  FROM public.profiles
  WHERE user_type = 'volunteer' AND is_available = true
  ORDER BY RANDOM()
  LIMIT 1;
  
  -- Update the alert with the volunteer
  IF volunteer_id IS NOT NULL THEN
    UPDATE public.emergency_alerts
    SET volunteer_id = volunteer_id, updated_at = now()
    WHERE id = alert_id;
    
    -- Mark volunteer as busy
    UPDATE public.profiles
    SET is_available = false
    WHERE id = volunteer_id;
  END IF;
  
  RETURN volunteer_id;
END;
$$;
