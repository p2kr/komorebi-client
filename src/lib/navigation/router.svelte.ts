import type { Component } from 'svelte';
import {
  LayoutDashboard,
  WandSparkles,
  FileCode,
  Box,
  Library,
  Globe,
  Settings as SettingsIcon,
} from '@lucide/svelte';
import Dashboard from '@dashboard/Dashboard.svelte';
import SmartMatcher from '@crawler/SmartMatcher.svelte';
import ParserSources from '@crawler/ParserSources.svelte';
import SelectorSandbox from '@crawler/SelectorSandbox.svelte';
import Vault from '@vault/Vault.svelte';
import Browser from '@browser/Browser.svelte';
import Settings from '@settings/Settings.svelte';

export type RouteId =
  | 'dashboard'
  | 'smartMatcher'
  | 'parserSources'
  | 'sandbox'
  | 'vault'
  | 'browser'
  | 'settings';

export interface NavItem {
  id: RouteId;
  label: string;
  icon: Component;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'smartMatcher', label: 'Smart Matcher', icon: WandSparkles },
  { id: 'parserSources', label: 'Parser Sources', icon: FileCode },
  { id: 'sandbox', label: 'Selector Sandbox', icon: Box },
  { id: 'vault', label: 'Vault', icon: Library },
  { id: 'browser', label: 'Browser', icon: Globe },
];

export const SETTINGS_NAV_ITEM: NavItem = {
  id: 'settings',
  label: 'Settings',
  icon: SettingsIcon,
};

const routeComponentMap: Record<RouteId, Component> = {
  dashboard: Dashboard,
  smartMatcher: SmartMatcher,
  parserSources: ParserSources,
  sandbox: SelectorSandbox,
  vault: Vault,
  browser: Browser,
  settings: Settings,
};

class Router {
  activeRoute = $state<RouteId>('dashboard');

  navigate(route: RouteId) {
    if (routeComponentMap[route]) {
      this.activeRoute = route;
    }
  }

  get activeComponent(): Component {
    return routeComponentMap[this.activeRoute] || Dashboard;
  }
}

export const router = new Router();
