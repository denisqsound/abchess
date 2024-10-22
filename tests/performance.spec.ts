import {test, expect} from '@playwright/test';
import * as fs from 'fs';

const credentials = JSON.parse(fs.readFileSync('account_abchess.json', 'utf-8'));

// https://ab-chess.com/webinar/6302

const maxTests = process.env.WORKERS
const testsToRun = credentials.slice(0, maxTests);

test.describe.parallel('Login Tests for ab-chess.com', () => {
    testsToRun.forEach((credential: { email: string; password: string; }, index: number) => {
        test(`Login Test #${index + 1} - ${credential.email}`, async ({page}) => {

            await page.goto('/webinar/6302');
            await page.getByRole('button', {name: 'Sign Up'}).click();
            await page.getByRole('button', {name: 'Log in'}).click();
            await page.getByPlaceholder('Email').fill(credential.email);
            await page.locator('input[name="password"]').fill(credential.password);
            await page.getByRole('button', {name: 'Log in'}).click();

            await page.waitForSelector('div:has-text("AB-Class")');
            const joinButton = page.getByRole('button', {name: 'Join'});
            await expect(joinButton).toBeVisible();
            const isDisabled = await joinButton.isDisabled();
            expect(isDisabled).toBeTruthy();

            await page.getByPlaceholder('Password').click();
            await page.getByPlaceholder('Password').fill('qwerty');
            await expect(page.getByRole('button', {name: 'Join'})).toBeVisible();
            await page.getByRole('button', {name: 'Join'}).click();

            await page.waitForLoadState('networkidle');

            const ratingText = page.locator('xpath=//*[@id="root"]/div/main/div[2]/div/div[2]/div/div/p');

            // Ура! Мы на первом задании.
            await expect(ratingText).toBeVisible();
        });
    });
});


