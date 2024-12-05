import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { CustomerFilters } from './CustomerFilters';
import { CustomerTable } from './CustomerTable';
import { AddCustomerModal } from './AddCustomerModal';
import { CustomersService } from '../../services/customers';
import toast from 'react-hot-toast';

export function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await CustomersService.getCustomers(filters);
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
      console.error('Error loading customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [filters]);

  const handleAddCustomer = async (customerData) => {
    try {
      const newCustomer = await CustomersService.createCustomer(customerData);
      setCustomers(prev => [...prev, newCustomer]);
      setIsAddModalOpen(false);
      toast.success('Customer added successfully');
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
    }
  };

  const handleUpdateCustomer = async (id, data) => {
    try {
      await CustomersService.updateCustomer(id, data);
      toast.success('Customer updated successfully');
      loadCustomers();
    } catch (error) {
      toast.error('Failed to update customer');
      console.error('Error updating customer:', error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    
    try {
      await CustomersService.deleteCustomer(id);
      toast.success('Customer deleted successfully');
      loadCustomers();
    } catch (error) {
      toast.error('Failed to delete customer');
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <main className="flex-1 min-w-0 overflow-auto">
      <div className="max-w-[1440px] mx-auto animate-fade-in">
        <div className="flex flex-wrap items-center justify-between gap-4 p-4">
          <h1 className="text-gray-900 dark:text-white text-2xl md:text-3xl font-bold">Customers</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>Add Customer</Button>
        </div>

        <div className="p-4">
          <Card>
            <CardHeader>
              <CustomerFilters 
                filters={filters} 
                onChange={setFilters}
              />
            </CardHeader>
            <CardContent>
              <CustomerTable 
                customers={customers}
                isLoading={isLoading}
                onUpdate={handleUpdateCustomer}
                onDelete={handleDeleteCustomer}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCustomer}
      />
    </main>
  );
}