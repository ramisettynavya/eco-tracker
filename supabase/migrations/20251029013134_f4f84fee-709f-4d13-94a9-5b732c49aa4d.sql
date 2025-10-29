-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meter_readings table
CREATE TABLE public.meter_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  reading_date DATE NOT NULL,
  meter_type TEXT NOT NULL,
  reading DECIMAL NOT NULL,
  cost DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appliance_usage table
CREATE TABLE public.appliance_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reading_id UUID NOT NULL REFERENCES public.meter_readings(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  unit TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appliance_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for meter_readings
CREATE POLICY "Users can view their own readings" 
ON public.meter_readings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own readings" 
ON public.meter_readings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own readings" 
ON public.meter_readings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own readings" 
ON public.meter_readings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for appliance_usage
CREATE POLICY "Users can view their own appliance usage" 
ON public.appliance_usage 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.meter_readings 
  WHERE id = appliance_usage.reading_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create their own appliance usage" 
ON public.appliance_usage 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.meter_readings 
  WHERE id = appliance_usage.reading_id 
  AND user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meter_readings_updated_at
BEFORE UPDATE ON public.meter_readings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();