import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: false,
    retries: 0,
    workers: process.env.WORKERS ? parseInt(process.env.WORKERS, 10) : 1,
    reporter: 'html',
    use: {
        baseURL: 'https://ab-chess.com',
        trace: 'on',
        video: 'on',
        screenshot: 'on',
    },
});
