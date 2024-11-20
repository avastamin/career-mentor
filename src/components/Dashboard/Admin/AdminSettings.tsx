import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Save } from 'lucide-react';
import { AnimatedCard } from '../../AnimatedCard';
import { AnimatedButton } from '../../AnimatedButton';
import { getAdminSettings, updateAdminSetting } from '../../../lib/admin';
import type { AdminSettings as AdminSettingsType } from '../../../lib/types';

export const AdminSettings = () => {
  const [settings, setSettings] = React.useState<AdminSettingsType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getAdminSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingUpdate = async (key: string, value: Record<string, any>) => {
    try {
      setSaving(true);
      await updateAdminSetting(key, value);
      
      // Update local state
      setSettings(settings.map(setting => 
        setting.setting_key === key 
          ? { ...setting, setting_value: value }
          : setting
      ));
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setSaving(false);
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <AnimatedButton
            variant="primary"
            className="text-sm flex items-center gap-2"
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </AnimatedButton>
        </div>

        <div className="space-y-4">
          {settings.map((setting, index) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <Settings className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium text-gray-900">
                  {setting.setting_key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
              </div>
              <pre className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 overflow-x-auto">
                {JSON.stringify(setting.setting_value, null, 2)}
              </pre>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedCard>
  );
};