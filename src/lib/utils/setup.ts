import { themeManager } from "@settings/theme.svelte";
import { userManager } from "@user/user.svelte";

export abstract class Setup {
  static init() {
    themeManager.init();
    userManager.init();
  }
}
