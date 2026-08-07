import React from 'react';
import { Clock, CheckCircle2, XCircle, PlayCircle, CheckCheck, Ban } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock
  },
  accepted: {
    label: 'Accepted',
    bg: 'bg-[#39A8C7]/10 text-[#39A8C7] border-[#39A8C7]/20',
    icon: CheckCircle2
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-[#39A8C7]/15 text-[#39A8C7] border-[#39A8C7]/30 animate-pulse',
    icon: PlayCircle
  },
  completed: {
    label: 'Completed',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCheck
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircle
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-red-50 text-red-700 border-red-200',
    icon: Ban
  }
};

const BookingStatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold border ${config.bg}`}
    >
      <Icon size={14} />
      <span>{config.label}</span>
    </span>
  );
};

export default BookingStatusBadge;
