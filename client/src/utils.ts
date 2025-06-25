export function formatRelativeDate(input: Date | string): string {
    const now = new Date();
    const date = new Date(input);
    const diffMs = now.getTime() - date.getTime();
  
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
    if (diffHours < 1) {
      const minutes = Math.floor(diffMs / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
  
    if (diffHours < 24) {
      const hours = Math.floor(diffHours);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
  
    if (diffDays < 3) {
      const days = Math.floor(diffDays);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  
    // Format as "HH:MM DD/MM/YY"
    const pad = (n: number) => n.toString().padStart(2, "0");
  
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear().toString().slice(-2);
  
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }
  