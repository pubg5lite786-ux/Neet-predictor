'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import api from '@/src/utils/api';
import { API_ENDPOINTS } from '@/src/config';

interface Alert {
  _id: string;
  title: string;
  message: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
}

export default function AlertBar() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.ALERTS.LIST);
        setAlerts(response.data.slice(0, 3)); // Show top 3 alerts
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
    const interval = setInterval(() => {
      setVisibleIndex(prev => (prev + 1) % Math.max(alerts.length, 1));
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [alerts.length]);

  if (closed || alerts.length === 0) return null;

  const currentAlert = alerts[visibleIndex];
  const priorityColors = {
    Critical: 'bg-red-500',
    High: 'bg-orange-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-blue-500',
  };

  return (
    <div className={`${priorityColors[currentAlert.priority]} text-white p-3 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <AlertCircle size={20} />
        <div>
          <h4 className="font-bold">{currentAlert.title}</h4>
          <p className="text-sm">{currentAlert.message}</p>
        </div>
      </div>
      <button onClick={() => setClosed(true)} className="hover:opacity-70">
        <X size={20} />
      </button>
    </div>
  );
}
