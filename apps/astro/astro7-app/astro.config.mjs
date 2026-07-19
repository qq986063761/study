// @ts-check
import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
	output: 'static',
	integrations: [
		vue({
			appEntrypoint: '/src/vue-app.ts',
		}),
	],
	adapter: node({ mode: 'standalone' }),
});
