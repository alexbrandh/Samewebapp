'use client';

import { useState, useEffect } from 'react';
import { useCustomer } from '@/contexts/customer-context';
import { updateCustomer, createAddress, updateAddress, deleteAddress } from '@/lib/shopify-customer';
import { User, Envelope, Phone, MapPin, Pencil, Trash, Plus } from 'phosphor-react';
import { Button } from '@/components/ui/button';
import type { CustomerAddress } from '@/lib/types/customer';

export default function ProfilePage() {
  const { customer, accessToken, refreshCustomer } = useCustomer();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (customer) {
      setProfileData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phone: customer.phone || '',
      });
    }
  }, [customer]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    try {
      setIsLoading(true);
      await updateCustomer(accessToken, profileData);
      await refreshCustomer();
      setMessage('Profile updated successfully!');
      setIsEditingProfile(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!accessToken) return;
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await deleteAddress(accessToken, addressId);
      await refreshCustomer();
      setMessage('Address deleted successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success/Error Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.startsWith('Error')
            ? 'bg-destructive/10 border border-destructive text-destructive'
            : 'bg-green-100 border border-green-200 text-green-800'
        }`}>
          {message}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              <User size={24} className="text-primary" weight="fill" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
          </div>
          {!isEditingProfile && (
            <Button
              onClick={() => setIsEditingProfile(true)}
              variant="outline"
              className="gap-2"
            >
              <Pencil size={16} />
              Edit
            </Button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditingProfile(false);
                  if (customer) {
                    setProfileData({
                      firstName: customer.firstName || '',
                      lastName: customer.lastName || '',
                      email: customer.email || '',
                      phone: customer.phone || '',
                    });
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <User size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">
                  {customer?.firstName} {customer?.lastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Envelope size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{customer?.email}</p>
              </div>
            </div>

            {customer?.phone && (
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Phone size={20} className="text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{customer.phone}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Addresses */}
      <div className="bg-card border border-border rounded-lg p-6" id="addresses">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-lg">
              <MapPin size={24} className="text-primary" weight="fill" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Saved Addresses</h2>
          </div>
          <Button
            onClick={() => alert('Add address form - To be implemented')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          >
            <Plus size={16} />
            Add Address
          </Button>
        </div>

        {customer?.addresses && customer.addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.addresses.map((address) => (
              <div
                key={address.id}
                className="p-4 border border-border rounded-lg relative"
              >
                {customer.defaultAddress?.id === address.id && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                    Default
                  </span>
                )}
                
                <div className="space-y-1 text-sm text-foreground mb-3">
                  {address.firstName && (
                    <p className="font-medium">
                      {address.firstName} {address.lastName}
                    </p>
                  )}
                  <p>{address.address1}</p>
                  {address.address2 && <p>{address.address2}</p>}
                  <p>
                    {address.city}, {address.province} {address.zip}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && <p className="mt-2">{address.phone}</p>}
                </div>

                <div className="flex gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => alert('Edit address form - To be implemented')}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors"
                  >
                    <Trash size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No saved addresses yet</p>
          </div>
        )}
      </div>

      {/* Account Info */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Customer ID</span>
            <span className="text-foreground font-mono">{customer?.id.split('/').pop()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since</span>
            <span className="text-foreground">
              {customer?.createdAt && new Date(customer.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Orders</span>
            <span className="text-foreground font-semibold">{customer?.ordersCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
