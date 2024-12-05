import { supabase } from '../lib/supabase';

export const CustomersService = {
  async getCustomers({ search, status, sortBy, sortOrder }) {
    let query = supabase
      .from('customers')
      .select('*');

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
    }

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (sortBy) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  async createCustomer(customerData) {
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        name: customerData.name,
        email: customerData.email,
        status: customerData.status
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCustomer(id, customerData) {
    const { data, error } = await supabase
      .from('customers')
      .update(customerData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCustomer(id) {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getCustomerById(id) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }
};
