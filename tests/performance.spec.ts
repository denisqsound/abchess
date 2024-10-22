import {test, expect, chromium, firefox, webkit} from '@playwright/test';
import * as fs from 'fs';

const credentials = JSON.parse(fs.readFileSync('account_abchess.json', 'utf-8'));

const maxTests = 60;
const testsToRun = credentials.slice(0, maxTests);

const browsers = [chromium, firefox, webkit];

function getRandomBrowser() {
    return browsers[Math.floor(Math.random() * browsers.length)];
}

test.describe.parallel('Login Tests for ab-chess.com', () => {
    testsToRun.forEach((credential: { email: string; password: string; }, index: number) => {
        test(`Login Test #${index + 1} - ${credential.email}`, async () => {
            const browser = await getRandomBrowser().launch();
            const context = await browser.newContext();
            const page = await context.newPage();

            await page.goto('/webinar/6302');
            await page.getByRole('button', {name: 'Sign Up'}).click();
            await page.getByRole('button', {name: 'Log in'}).click();
            await page.getByPlaceholder('Email').fill(credential.email);
            await page.locator('input[name="password"]').fill(credential.password);
            await page.getByRole('button', {name: 'Log in'}).click();

            // Пароль от соревнования
            await page.waitForSelector('div:has-text("AB-Class")');
            const joinButton = await page.getByRole('button', { name: 'Join' });
            await expect(joinButton).toBeVisible();
            const isDisabled = await joinButton.isDisabled(); // Проверка по атрибуту disabled
            expect(isDisabled).toBeTruthy(); // Убедимся, что кнопка неактивна

            await page.getByPlaceholder('Password').click();
            await page.getByPlaceholder('Password').fill('qwerty');
            await expect(page.getByRole('button', {name: 'Join'})).toBeVisible();
            await page.getByRole('button', {name: 'Join'}).click();
            await browser.close();
        });
    });
});


