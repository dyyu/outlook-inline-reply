// Interface for user preferences
export interface Preferences {
  polishPlainText: boolean;
  replaceHeader: boolean;
  removeExternalWarning: boolean;
  externalWarningHtml: string;
}

// Default user preferences
export const defaultPreferences: Preferences = {
  polishPlainText: false,
  replaceHeader: true,
  removeExternalWarning: true,
  externalWarningHtml: ""
};
