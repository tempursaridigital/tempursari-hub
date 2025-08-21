-- Create service types enum
CREATE TYPE public.service_type AS ENUM (
  'surat_pengantar_ktp',
  'surat_keterangan_domisili',
  'surat_keterangan_usaha',
  'surat_keterangan_tidak_mampu',
  'surat_keterangan_belum_menikah',
  'surat_pengantar_nikah',
  'surat_keterangan_kematian',
  'surat_keterangan_kelahiran'
);

-- Create request status enum
CREATE TYPE public.request_status AS ENUM (
  'pending',
  'on_process',
  'completed',
  'cancelled'
);

-- Create user roles enum
CREATE TYPE public.user_role AS ENUM (
  'user',
  'operator',
  'admin'
);

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create service requests table
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type service_type NOT NULL,
  full_name TEXT NOT NULL,
  nik TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  status request_status DEFAULT 'pending',
  operator_notes TEXT,
  operator_id UUID REFERENCES auth.users(id),
  documents JSONB, -- Store file URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create operator notes table for tracking status changes
CREATE TABLE public.operator_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.service_requests(id) ON DELETE CASCADE NOT NULL,
  operator_id UUID REFERENCES auth.users(id) NOT NULL,
  note TEXT NOT NULL,
  old_status request_status,
  new_status request_status,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('service-documents', 'service-documents', false);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_notes ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Operators can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_user_role(auth.uid()) IN ('operator', 'admin'));

-- RLS Policies for service_requests
CREATE POLICY "Users can view own requests" ON public.service_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow anonymous and authenticated requests" ON public.service_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view requests by NIK for status check" ON public.service_requests
  FOR SELECT USING (true);

CREATE POLICY "Operators can view all requests" ON public.service_requests
  FOR SELECT USING (public.get_user_role(auth.uid()) IN ('operator', 'admin'));

CREATE POLICY "Operators can update requests" ON public.service_requests
  FOR UPDATE USING (public.get_user_role(auth.uid()) IN ('operator', 'admin'));

-- RLS Policies for operator_notes
CREATE POLICY "Operators can view all notes" ON public.operator_notes
  FOR SELECT USING (public.get_user_role(auth.uid()) IN ('operator', 'admin'));

CREATE POLICY "Operators can insert notes" ON public.operator_notes
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) IN ('operator', 'admin') AND auth.uid() = operator_id);

-- Storage policies for service documents
CREATE POLICY "Allow anonymous document uploads" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'service-documents'
  );

CREATE POLICY "Allow viewing all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'service-documents'
  );

CREATE POLICY "Operators can view all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'service-documents' AND
    public.get_user_role(auth.uid()) IN ('operator', 'admin')
  );

-- Create function to generate request number
CREATE OR REPLACE FUNCTION public.generate_request_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  today_str TEXT;
  counter INTEGER;
  request_number TEXT;
BEGIN
  today_str := to_char(now(), 'YYYYMMDD');
  
  -- Get the next counter for today
  SELECT COALESCE(MAX(CAST(SUBSTRING(request_number FROM 13) AS INTEGER)), 0) + 1
  INTO counter
  FROM public.service_requests
  WHERE request_number LIKE 'REQ-' || today_str || '-%';
  
  request_number := 'REQ-' || today_str || '-' || LPAD(counter::TEXT, 4, '0');
  
  RETURN request_number;
END;
$$;

-- Create trigger to auto-generate request number
CREATE OR REPLACE FUNCTION public.set_request_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.request_number IS NULL THEN
    NEW.request_number := public.generate_request_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_request_number_trigger
  BEFORE INSERT ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.set_request_number();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();