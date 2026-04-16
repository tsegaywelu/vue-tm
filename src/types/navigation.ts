export interface Navs {
  name: string;
  labelKey?: string; // For i18n later if needed
  path?: string;
  icon?: string;
  show?: boolean;
  group?: string;
  groupKey?: string;
  onClick?: (...args: any[]) => void;
  children?: Navs[];
  role?: string | string[];
  privileges?: string[];
  requiresAuth?: boolean;
  titleKey?: string;
  subtitleKey?: string;
}
