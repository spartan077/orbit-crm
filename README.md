# Orbit - Modern CRM Application

A modern, responsive Customer Relationship Management (CRM) application built with React 18 and Supabase.

## Features

- User Authentication
- Customer Management
- Dark/Light Theme
- Responsive Design
- Real-time Updates
- Secure Data Handling

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, Headless UI
- **Backend**: Supabase
- **State Management**: React Context
- **Routing**: React Router v7
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

## Project Structure

```
orbit/
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   │   ├── LoginPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── customers/       # Customer management
│   │   │   ├── AddCustomerModal.jsx
│   │   │   ├── CustomerDetailsModal.jsx
│   │   │   ├── CustomerFilters.jsx
│   │   │   ├── CustomerTable.jsx
│   │   │   ├── CustomersPage.jsx
│   │   │   └── EditCustomerModal.jsx
│   │   └── ui/             # Reusable UI components
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Header.jsx
│   │       ├── MobileMenu.jsx
│   │       └── Sidebar.jsx
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── ThemeContext.jsx # Theme management
│   ├── hooks/             # Custom React hooks
│   ├── lib/              # Library configurations
│   │   └── supabase.js   # Supabase client setup
│   ├── services/         # API services
│   │   └── customers.js  # Customer CRUD operations
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables
├── index.html          # HTML entry point
├── package.json        # Project dependencies
├── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```

## Component Relationships

### Authentication Flow
- `AuthContext` provides authentication state throughout the app
- `LoginPage` and `SignupPage` handle user authentication
- `PrivateRoute` in `App.jsx` protects authenticated routes

### Navigation
- `App.jsx` sets up routing with React Router
- `Header` shows main navigation and theme toggle
- `Sidebar` provides desktop navigation
- `MobileMenu` handles mobile navigation

### Customer Management
- `CustomersPage` is the main customer management view
- `CustomerTable` displays the customer list
- `AddCustomerModal` handles new customer creation
- `EditCustomerModal` manages customer updates
- `CustomerDetailsModal` shows detailed customer information
- `CustomerFilters` provides filtering and sorting options

### Data Flow
1. User actions trigger service functions in `services/customers.js`
2. Services interact with Supabase using the client in `lib/supabase.js`
3. Components receive updates and re-render with new data
4. Toast notifications inform users of operation status

## Security

- Authentication handled by Supabase
- Protected routes using `PrivateRoute` component
- Environment variables for sensitive data
- Row Level Security (RLS) in Supabase

## Styling

- Tailwind CSS for utility-first styling
- Dark/Light theme support via `ThemeContext`
- Responsive design with mobile-first approach
- Headless UI for accessible components

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Schema

### Customers Table
```sql
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);
```

## State Management

- Authentication state managed by `AuthContext`
- Theme preferences managed by `ThemeContext`
- Component-level state using React hooks
- Real-time updates through Supabase subscriptions

## Future Development

1. Advanced customer insights
2. Enhanced reporting features
3. Real-time collaboration tools
4. Comprehensive test coverage
5. Additional customer data fields

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or commercial purposes.

#supabase.sql1
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create customers table
CREATE TABLE public.customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    company TEXT,
    status TEXT DEFAULT 'active',
    notes TEXT,
    assigned_to UUID REFERENCES public.profiles(id)
);

-- Create campaigns table
CREATE TABLE public.campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id),
    budget DECIMAL(10,2),
    metrics JSONB
);

-- Create customer_campaigns junction table
CREATE TABLE public.customer_campaigns (
    customer_id UUID REFERENCES public.customers(id),
    campaign_id UUID REFERENCES public.campaigns(id),
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (customer_id, campaign_id)
);

-- Create conversations table
CREATE TABLE public.conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    customer_id UUID REFERENCES public.customers(id),
    status TEXT DEFAULT 'open',
    subject TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table for conversations
CREATE TABLE public.conversation_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id),
    sender_id UUID REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    read_at TIMESTAMPTZ
);

-- Create reports table
CREATE TABLE public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    parameters JSONB,
    created_by UUID REFERENCES public.profiles(id),
    results JSONB
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view customers" ON public.customers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert customers" ON public.customers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update customers" ON public.customers
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_customers_company ON public.customers(company);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_conversations_customer ON public.conversations(customer_id);
CREATE INDEX idx_conversation_messages_conversation ON public.conversation_messages(conversation_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();



#supabase.sql2
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own customers" ON customers;
DROP POLICY IF EXISTS "Users can insert their own customers" ON customers;
DROP POLICY IF EXISTS "Users can update their own customers" ON customers;
DROP POLICY IF EXISTS "Users can delete their own customers" ON customers;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;

-- Drop existing indexes
DROP INDEX IF EXISTS customers_user_id_idx;
DROP INDEX IF EXISTS customers_status_idx;
DROP INDEX IF EXISTS customers_name_idx;
DROP INDEX IF EXISTS customers_email_idx;
DROP INDEX IF EXISTS customers_company_idx;
DROP INDEX IF EXISTS customers_name_trgm_idx;
DROP INDEX IF EXISTS customers_email_trgm_idx;
DROP INDEX IF EXISTS customers_company_trgm_idx;

-- Alter table to add/modify columns if needed
ALTER TABLE customers 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS last_contact TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS total_spent DECIMAL(10,2) DEFAULT 0;

-- Add status check constraint
ALTER TABLE customers DROP CONSTRAINT IF EXISTS customers_status_check;
ALTER TABLE customers ADD CONSTRAINT customers_status_check 
  CHECK (status IN ('active', 'inactive'));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Users can view their own customers"
    ON customers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customers"
    ON customers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers"
    ON customers FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers"
    ON customers FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS customers_user_id_idx ON customers(user_id);
CREATE INDEX IF NOT EXISTS customers_status_idx ON customers(status);
CREATE INDEX IF NOT EXISTS customers_name_idx ON customers(name);
CREATE INDEX IF NOT EXISTS customers_email_idx ON customers(email);
CREATE INDEX IF NOT EXISTS customers_company_idx ON customers(company);

-- Create extension for full text search if not exists
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create trigram indexes
CREATE INDEX IF NOT EXISTS customers_name_trgm_idx ON customers USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS customers_email_trgm_idx ON customers USING gin (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS customers_company_trgm_idx ON customers USING gin (company gin_trgm_ops);

-- Update existing rows to set user_id if null
UPDATE customers SET user_id = auth.uid() WHERE user_id IS NULL;