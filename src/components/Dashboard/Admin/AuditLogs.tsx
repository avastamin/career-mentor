import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Settings, FileText } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { getAdminAuditLogs } from '../../../lib/admin';
import type { AdminAuditLog } from '../../../lib/types';

export const AuditLogs = () => {
  const [logs, setLogs] = React.useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await getAdminAuditLogs(10);
        setLogs(data);
      } catch (error) {
        console.error('Error loading audit logs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'user_update':
        return User;
      case 'settings_update':
        return Settings;
      default:
        return FileText;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AnimatedCard>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        
        <div className="space-y-4">
          {logs.map((log, index) => {
            const ActionIcon = getActionIcon(log.action_type);
            
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-indigo-100">
                  <ActionIcon className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">
                    {log.action_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {log.resource_type}: {log.resource_id}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(log.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedCard>
  );
};