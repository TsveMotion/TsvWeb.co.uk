/**
 * Urgency Detection for Inquiries
 * Analyzes inquiry content to determine urgency level
 */

export type UrgencyLevel = 'critical' | 'high' | 'normal';

// Critical keywords that indicate urgent problems
const CRITICAL_KEYWORDS = [
  'urgent', 'emergency', 'critical', 'asap', 'immediately', 'down', 'broken', 
  'not working', 'crashed', 'error', 'help', 'problem', 'issue', 'bug',
  'hack', 'hacked', 'security', 'breach', 'virus', 'malware',
  'offline', 'can\'t access', 'cannot access', 'lost', 'deleted'
];

// High priority keywords
const HIGH_PRIORITY_KEYWORDS = [
  'soon', 'quickly', 'fast', 'important', 'need', 'required',
  'deadline', 'time-sensitive', 'priority', 'concern', 'worried'
];

/**
 * Detect urgency level from inquiry content
 */
export function detectUrgency(subject: string, message: string): UrgencyLevel {
  const combinedText = `${subject} ${message}`.toLowerCase();
  
  // Check for critical keywords
  const hasCritical = CRITICAL_KEYWORDS.some(keyword => 
    combinedText.includes(keyword.toLowerCase())
  );
  
  if (hasCritical) {
    return 'critical';
  }
  
  // Check for high priority keywords
  const hasHighPriority = HIGH_PRIORITY_KEYWORDS.some(keyword =>
    combinedText.includes(keyword.toLowerCase())
  );
  
  if (hasHighPriority) {
    return 'high';
  }
  
  return 'normal';
}

/**
 * Get urgency color for UI
 */
export function getUrgencyColor(urgency: UrgencyLevel): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (urgency) {
    case 'critical':
      return {
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-900 dark:text-red-200',
        border: 'border-red-300 dark:border-red-800',
        badge: 'bg-red-600 text-white'
      };
    case 'high':
      return {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        text: 'text-orange-900 dark:text-orange-200',
        border: 'border-orange-300 dark:border-orange-800',
        badge: 'bg-orange-500 text-white'
      };
    default:
      return {
        bg: 'bg-white dark:bg-gray-800',
        text: 'text-gray-900 dark:text-white',
        border: 'border-gray-200 dark:border-gray-700',
        badge: 'bg-gray-500 text-white'
      };
  }
}
