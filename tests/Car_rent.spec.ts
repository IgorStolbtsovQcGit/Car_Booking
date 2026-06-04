import { test, expect } from '@playwright/test';

test('cars pickup', async ({ page }) => {
    test.setTimeout(90000);
  
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    });
  });

    await page.goto('https://www.booking.com/cars/index.html');


    const cookieBtn = page.getByRole('button', { name: 'Accept' });
    await cookieBtn.click();
    

    const input = page.locator('input[name="pickup-location"]');
    await input.waitFor({ state: 'visible' });
    await input.click();

    await input.fill('');
    await input.pressSequentially('New York', { delay: 150 });

    const firstOption = page.locator('[role="option"]').first();
    await firstOption.waitFor({ timeout: 15000 });

    await firstOption.click();

    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Choose Pick-up Date' }).click();
    await page.getByRole('checkbox', { name: 'Sat 20 June' }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('checkbox', { name: 'Tue 23 June' }).click();
    await page.waitForTimeout(2000);
    await page.getByLabel('Pick up time').getByLabel('Time10:00 AM12:00 AM12:30').selectOption('12:00');
    await page.waitForTimeout(2000);
    await page.getByLabel('Time10:00 AM12:00 AM12:30').selectOption('09:00');
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByTestId('signin-modal-close').click();
    await page.locator('[data-testid="filter-supplier"]').getByText('Budget', { exact: false }).click({ force: true });

    const pagePromise = page.context().waitForEvent('page');
    await page.getByRole('link', { name: 'View deal', exact: false }).first().click();

    const newPage = await pagePromise;
    await newPage.getByTestId('go-to-extras-button').waitFor({ state: 'visible' });
    await newPage.getByTestId('go-to-extras-button').click();
    await newPage.getByTestId('package-product-details-cta').waitFor({ state: 'visible' });
    await newPage.getByTestId('package-product-details-cta').click();
    await newPage.getByTestId('checkout-cta-without-insurance').waitFor({ state: 'visible' });
    await newPage.getByTestId('checkout-cta-without-insurance').click();

    await newPage.waitForTimeout(3000);

    await newPage.getByTestId('email-field').fill('igor@example.com');
    await newPage.getByTestId('firstName-field').fill('Igor');
    await newPage.getByTestId('lastName-field').fill('Stolbtsov');
    await newPage.getByTestId('telephoneNumber-countryCode-field').click();
    await newPage.getByTestId('telephoneNumber-countryCode-field').waitFor({ state: 'visible' });
    await newPage.getByTestId('telephoneNumber-countryCode-field').selectOption('bg');
    await newPage.getByTestId('telephoneNumber-number-field').fill('44556677');
    await newPage.getByTestId('countryOfResidence').click();
    await newPage.getByTestId('countryOfResidence').waitFor({ state: 'visible' });
    await newPage.getByTestId('countryOfResidence').selectOption('BG');
    await newPage.getByRole('dialog').getByRole('button', { name: 'Yes', exact: true }).click();
    await newPage.getByTestId('billingAddressAddress-field').fill('blvd Vladislav');
    await newPage.getByTestId('billingAddressCity-field').fill('Varna');
    await newPage.getByTestId('billingAddressPostcode-field').fill('9000');
    const paymentFrame = newPage.frameLocator('iframe[title="Payment"]');

    const cardNameInput = paymentFrame.locator('input[autocomplete="cc-name"]').first();
    await cardNameInput.waitFor({ state: 'visible', timeout: 20000 });
    await cardNameInput.click();

    await newPage.waitForTimeout(3000);

    await cardNameInput.pressSequentially('IGOR STOLBTSOV', { delay: 60 });
    await cardNameInput.press('Tab');


    const cardNumberInput = paymentFrame.locator('input[autocomplete="cc-number"]').first();
    await cardNumberInput.pressSequentially('4111222233334444', { delay: 60 });
    await cardNumberInput.press('Tab');


    const cardExpInput = paymentFrame.locator('input[autocomplete="cc-exp"]').first();
    await cardExpInput.pressSequentially('1229', { delay: 60 });
    await cardExpInput.press('Tab');


    const cardCvcInput = paymentFrame.locator('input[autocomplete="cc-csc"]').first();
    await cardCvcInput.pressSequentially('123', { delay: 60 });


    await newPage.getByTestId('checkout-form-submit-button').waitFor({ state: 'visible', timeout: 15000 });
    await newPage.getByTestId('checkout-form-submit-button').click();

});