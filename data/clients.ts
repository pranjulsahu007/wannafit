import { Client } from '../types';

export const MOCK_CLIENTS: Client[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    initials: 'JD', 
    goal: 'Fat Loss', 
    targetCalories: 2200, 
    lastCheckIn: '2 days ago',
    status: 'Active'
  },
  { 
    id: '2', 
    name: 'Sarah Smith', 
    initials: 'SS', 
    goal: 'Muscle Gain', 
    targetCalories: 2600, 
    lastCheckIn: 'Today',
    status: 'Active'
  },
  { 
    id: '3', 
    name: 'Mike Johnson', 
    initials: 'MJ', 
    goal: 'Maintenance', 
    targetCalories: 2400, 
    lastCheckIn: '1 week ago',
    status: 'Paused'
  },
  { 
    id: '4', 
    name: 'Emily Davis', 
    initials: 'ED', 
    goal: 'Contest Prep', 
    targetCalories: 1800, 
    lastCheckIn: 'Yesterday',
    status: 'Active'
  },
  { 
    id: '5', 
    name: 'Alex Chen', 
    initials: 'AC', 
    goal: 'General Health', 
    targetCalories: 2000, 
    lastCheckIn: '3 days ago',
    status: 'Pending'
  },
];