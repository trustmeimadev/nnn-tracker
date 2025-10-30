export interface CheckIn {
  id: string;
  user_id?: string;
  date: string;
  morning: boolean | null; // true = safe, false = failed, null = not checked
  afternoon: boolean | null;
  evening: boolean | null;
}

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
  failedAt: string | null; // null if still in, date string if failed
}

export function getCheckIns(userId: string): CheckIn[] {
  const stored = localStorage.getItem(`nnn_checkins_${userId}`);
  return stored ? JSON.parse(stored) : [];
}

export function getUser(userId: string): User | null {
  const users = JSON.parse(localStorage.getItem('nnn_users') || '[]');
  return users.find((u: User) => u.id === userId) || null;
}

export function updateUserFailedAt(userId: string, failedAt: string | null) {
  const users = JSON.parse(localStorage.getItem('nnn_users') || '[]');
  const userIndex = users.findIndex((u: User) => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].failedAt = failedAt;
    localStorage.setItem('nnn_users', JSON.stringify(users));
  }
}

export function calculateDaysSurvived(user: User): number {
  if (!user.failedAt) {
    // Still in - calculate days from Nov 1 to today
    const novemberFirst = new Date(new Date().getFullYear(), 10, 1);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - novemberFirst.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  } else {
    // Failed - calculate days from Nov 1 to failed date
    const novemberFirst = new Date(new Date().getFullYear(), 10, 1);
    const failedDate = new Date(user.failedAt);
    failedDate.setHours(0, 0, 0, 0);
    const diffTime = failedDate.getTime() - novemberFirst.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }
}

export function getSafePeriodsForDay(checkIn: CheckIn | undefined): number {
  if (!checkIn) return 0;
  let count = 0;
  if (checkIn.morning === true) count++;
  if (checkIn.afternoon === true) count++;
  if (checkIn.evening === true) count++;
  return count;
}

export function getFailedPeriodForDay(
  checkIn: CheckIn | undefined
): string | null {
  if (!checkIn) return null;
  if (checkIn.morning === false) return 'morning';
  if (checkIn.afternoon === false) return 'afternoon';
  if (checkIn.evening === false) return 'evening';
  return null;
}

export function countFailuresForUser(checkIns: CheckIn[]): number {
  let failureCount = 0;
  for (const checkIn of checkIns) {
    if (checkIn.morning === false) failureCount++;
    if (checkIn.afternoon === false) failureCount++;
    if (checkIn.evening === false) failureCount++;
  }
  return failureCount;
}
