import { themeManager } from './theme.svelte';
import { userManager } from './user.svelte';

export abstract class Setup {
  static init() {
    themeManager.init();
    userManager.init();
  }
}

