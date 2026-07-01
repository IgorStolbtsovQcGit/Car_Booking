import { test, expect, Page } from '@playwright/test';

const today = new Date();

const pickup = new Date(today);
pickup.setDate(today.getDate() + 30);

const dropoff = new Date(today);
dropoff.setDate(today.getDate() + 33);

const formatLabel = (date: Date): string => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekday = weekdays[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${weekday} ${day} ${month} ${year}`;
};

const selectDate = async (page: Page, label: string) => {
  for (let i = 0; i < 12; i++) {
    const checkbox = page.getByRole('checkbox', { name: label });

    const isVisible = await checkbox
      .waitFor({ state: 'visible', timeout: 2000 })
      .then(() => true)
      .catch(() => false);

    if (isVisible) {
      await checkbox.click();
      return;
    }

    await page.getByRole('button', { name: 'Following months' }).click();
    await page.waitForTimeout(300);
  }

  throw new Error(`Failed to find the date ${label}`);
};


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

    await page.waitForLoadState();

    const pickupLabel = formatLabel(pickup);
    const dropoffLabel = formatLabel(dropoff);

    await page.getByRole('button', { name: 'Choose Pick-up Date' }).click();


    await selectDate(page, pickupLabel);
    await page.waitForLoadState();
    await selectDate(page, dropoffLabel);
    await page.waitForLoadState();
   

    await page.getByLabel('Pick up time').getByLabel('Time10:00 AM12:00 AM12:30').selectOption('12:00');
    await page.waitForLoadState();
    await page.getByLabel('Time10:00 AM12:00 AM12:30').selectOption('09:00');
    await page.waitForLoadState();
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

    
    await newPage.waitForLoadState('domcontentloaded');
    await newPage.waitForLoadState('networkidle');

    await newPage.getByTestId('email-field').fill('igor@example.com');
    await newPage.getByTestId('firstName-field').fill('Igor');
    await newPage.getByTestId('lastName-field').fill('Stolbtsov');
    await newPage.getByTestId('telephoneNumber-countryCode-field').click();
    await newPage.getByTestId('telephoneNumber-countryCode-field').waitFor({ state: 'visible' });
    await newPage.getByTestId('telephoneNumber-countryCode-field').selectOption('bg');
    await newPage.getByTestId('telephoneNumber-number-field').fill('44556677');
  
    const countrySelect = newPage.getByTestId('countryOfResidence');
    await countrySelect.waitFor({ state: 'visible' });
    await countrySelect.waitFor({ state: 'attached' });
    await expect(countrySelect).toBeEnabled();
    await countrySelect.selectOption('BG');
    const confirmButton = newPage.getByRole('dialog').getByRole('button', { name: 'Yes', exact: true });
    await confirmButton.waitFor({ state: 'visible' });
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    await newPage.getByTestId('billingAddressAddress-field').fill('blvd Vladislav');
    await newPage.getByTestId('billingAddressCity-field').fill('Varna');
    await newPage.getByTestId('billingAddressPostcode-field').fill('9000');

    const iframeElement = newPage.locator('iframe[title="Payment"]');
    await iframeElement.scrollIntoViewIfNeeded();

    await newPage.waitForTimeout(5000);
    const paymentFrame = newPage.frameLocator('iframe[title="Payment"]');

    const cardNameInput = paymentFrame.locator('input[autocomplete="cc-name"]').first();
    await cardNameInput.waitFor({ state: 'visible' });
    await cardNameInput.scrollIntoViewIfNeeded();
    await cardNameInput.click();
    await cardNameInput.focus();
    await cardNameInput.pressSequentially('IGOR STOLBTSOV', { delay: 100 });
    await expect(cardNameInput).toHaveValue('IGOR STOLBTSOV');
    await cardNameInput.press('Tab');


    const cardNumberInput = paymentFrame.locator('input[autocomplete="cc-number"]').first();
    await cardNumberInput.waitFor({ state: 'visible' });
    await cardNumberInput.click();
    await cardNumberInput.focus();
    await cardNumberInput.pressSequentially('4111222233334444', { delay: 100 });
    await expect(cardNumberInput).toHaveValue('4111 2222 3333 4444');
    await cardNumberInput.press('Tab');


    const cardExpInput = paymentFrame.locator('input[autocomplete="cc-exp"]').first();
    await cardExpInput.pressSequentially('1229', { delay: 100 });
    await expect(cardExpInput).toHaveValue('12/29')
    await cardExpInput.press('Tab');


    const cardCvcInput = paymentFrame.locator('input[autocomplete="cc-csc"]').first();
    await cardCvcInput.pressSequentially('123', { delay: 100 });
    await expect(cardCvcInput).toHaveValue('123');


    await newPage.getByTestId('checkout-form-submit-button').waitFor({ state: 'visible', timeout: 15000 });
    await newPage.getByTestId('checkout-form-submit-button').click();

});