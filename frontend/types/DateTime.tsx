export class DateTime {
  private date: Date;

  constructor(date?: Date | string | number) {
    this.date = date ? new Date(date) : new Date();
  }

  // Day methods
  getDayNumber(): number {
    return this.date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  }

  getDayName(format: 'long' | 'short' = 'long'): string {
    return this.date.toLocaleDateString('en-US', { weekday: format });
  }

  // Month methods
  getMonthNumber(): number {
    return this.date.getMonth(); // 0 = January, 1 = February, etc.
  }

  getMonthName(format: 'long' | 'short' | 'numeric' = 'long'): string {
    return this.date.toLocaleDateString('en-US', { month: format });
  }

  // Year methods
  getYear(): number {
    return this.date.getFullYear();
  }

  getFormattedDate(format?: Intl.DateTimeFormatOptions): string {
    const defaultFormat: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    };
    return this.date.toLocaleDateString('en-US', format || defaultFormat);
  }
  
}