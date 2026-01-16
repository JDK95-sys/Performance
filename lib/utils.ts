import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { GoalStatus, ReviewStatus, Priority, ImpactLevel } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// DATE & TIME FORMATTING
// ============================================

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ============================================
// STATUS & COLOR UTILITIES
// ============================================

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Application statuses
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    interviewing: 'bg-purple-100 text-purple-800',
    manager_review: 'bg-indigo-100 text-indigo-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-800',
    open: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
    filled: 'bg-blue-100 text-blue-800',

    // Goal/Review statuses
    on_track: 'bg-green-100 text-green-800',
    at_risk: 'bg-yellow-100 text-yellow-800',
    off_track: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    not_started: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-600',
    acknowledged: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-700',
    calibrated: 'bg-purple-100 text-purple-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get priority badge colors
 */
export function getPriorityColor(priority: Priority | string): string {
  const colors: Record<string, string> = {
    critical: 'bg-red-100 text-red-800',
    high: 'bg-orange-100 text-orange-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-gray-100 text-gray-700',
  };
  return colors[priority] || 'bg-gray-100 text-gray-700';
}

/**
 * Get impact level colors
 */
export function getImpactColor(impact: ImpactLevel | string): string {
  const colors: Record<string, string> = {
    high: 'bg-red-50 border-red-200 text-red-900',
    medium: 'bg-amber-50 border-amber-200 text-amber-900',
    low: 'bg-blue-50 border-blue-200 text-blue-900',
  };
  return colors[impact] || 'bg-gray-50 border-gray-200 text-gray-900';
}

export function getMatchScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function getFlightRiskColor(level: string): string {
  const colors: Record<string, string> = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };
  return colors[level] || 'text-gray-600';
}

/**
 * Format performance rating with color
 */
export function formatRating(rating: number | undefined): { value: string; color: string } {
  if (rating === undefined) return { value: 'N/A', color: 'text-gray-500' };

  const rounded = rating.toFixed(1);
  let color = 'text-gray-700';

  if (rating >= 4.5) color = 'text-green-600';
  else if (rating >= 4.0) color = 'text-blue-600';
  else if (rating >= 3.5) color = 'text-yellow-600';
  else if (rating >= 3.0) color = 'text-orange-600';
  else color = 'text-red-600';

  return { value: rounded, color };
}

// ============================================
// TEXT FORMATTING
// ============================================

/**
 * Convert snake_case to Title Case
 */
export function toTitleCase(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format percentage
 */
export function formatPercentage(value: number | undefined, decimals: number = 0): string {
  if (value === undefined || isNaN(value)) return '0%';
  return `${value.toFixed(decimals)}%`;
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate and parse integer ID
 */
export function parseId(id: string | number | undefined): number | null {
  if (id === undefined || id === null) return null;
  const parsed = typeof id === 'string' ? parseInt(id, 10) : id;
  return isNaN(parsed) ? null : parsed;
}

// ============================================
// TAB NAVIGATION UTILITY
// ============================================

/**
 * Handle keyboard navigation for tabs
 * Eliminates duplicated tab navigation logic across pages
 */
export function handleTabKeyNavigation(
  event: React.KeyboardEvent,
  currentTab: string,
  tabs: string[],
  setActiveTab: (tab: string) => void
): void {
  const currentIndex = tabs.indexOf(currentTab);
  let newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowRight':
      event.preventDefault();
      newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
      break;
    case 'ArrowLeft':
      event.preventDefault();
      newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = tabs.length - 1;
      break;
    default:
      return;
  }

  if (newIndex !== currentIndex) {
    setActiveTab(tabs[newIndex]);
    setTimeout(() => {
      const tabButton = document.querySelector(`[data-tab="${tabs[newIndex]}"]`) as HTMLElement;
      tabButton?.focus();
    }, 0);
  }
}

// ============================================
// ERROR UTILITIES
// ============================================

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
}

// ============================================
// ARRAY & DATA UTILITIES
// ============================================

/**
 * Calculate average from array of numbers
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) result[groupKey] = [];
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Paginate array (client-side)
 */
export function paginate<T>(array: T[], page: number, pageSize: number) {
  const total = array.length;
  const totalPages = Math.ceil(total / pageSize);
  const offset = (page - 1) * pageSize;
  const data = array.slice(offset, offset + pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
