<script lang="ts">
  import { Constants } from '../utils/constants';
</script>

<div class="border-base-300 bg-base-100 space-y-4 rounded-2xl border p-6">
  <div class="flex items-center gap-3">
    <div
      class="bg-primary text-primary-content flex size-12 items-center justify-center rounded-2xl text-xl font-bold"
    >
      K
    </div>
    <div>
      <h2 class="font-segoe-script text-base-content text-xl font-bold">
        {Constants.APP_NAME}
      </h2>
      <p class="text-base-content/70 text-xs">Client Version 0.0.1</p>
    </div>
  </div>
  <div class="divider my-2"></div>
  <p class="text-base-content/80 text-sm leading-relaxed">
    Komorebi is a modern web crawler, selector sandbox, parser, and smart matcher suite built with
    Svelte 5 and Tailwind CSS.
  </p>
</div>
