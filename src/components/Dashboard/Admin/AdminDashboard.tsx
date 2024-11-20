import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Users, Settings, FileText, DollarSign } from 'lucide-react';
import { useAdmin } from '../../../contexts/AdminContext';
import { AdminStats } from './AdminStats';
import { UserManagement } from './UserManagement';
import { AuditLogs } from './AuditLogs';
import { AdminSettings } from './AdminSettings';
import { AnimatedCard } from '../../AnimatedCard';

export const AdminDashboard = () => {
  const { loading, error } = useAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - CareerMentor</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <AdminStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UserManagement />
          </div>
          <div className="space-y-6">
            <AdminSettings />
            <AuditLogs />
          </div>
        </div>
      </div>
    </>
  );
};