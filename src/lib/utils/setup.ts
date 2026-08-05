import { themeManager } from "@settings/theme.svelte";
import { userManager } from "@user/user.svelte";

/**
 * Centralized application setup and initialization entrypoint.
 * Responsible for bootstramming core services, state managers, and global listeners.
 */
export abstract class Setup {
  static init() {
    themeManager.init();
    userManager.init();
  }
}
