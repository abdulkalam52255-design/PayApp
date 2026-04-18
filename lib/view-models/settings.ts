export interface SettingsViewModel {
  user: {
    name: string;
    email: string;
    company: string;
    role: string;
  };
  preferences: {
    emailNotifications: boolean;
    marketingEmails: boolean;
    autoUnlockReports: boolean;
  };
}

export async function getSettingsViewModel(): Promise<SettingsViewModel> {
  return {
    user: {
      name: 'Sarah Chen',
      email: 'sarah.chen@riversidehealth.com',
      company: 'Riverside Health Systems LLC',
      role: 'Owner Rep',
    },
    preferences: {
      emailNotifications: true,
      marketingEmails: false,
      autoUnlockReports: true,
    },
  };
}
