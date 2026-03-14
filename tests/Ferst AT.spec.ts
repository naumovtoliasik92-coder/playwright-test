import { test, expect, Page } from '@playwright/test';
import { text } from 'stream/consumers';

interface Elements {
  locator: (page: Page) => Locator;
  name: string;
  text?: string;
  attribute?: {
    type: string
    value: string
  };
}

const elements: Elements [] = [
  {
    locator: (page: Page): Locator  => 
      page.getByRole('link', { name: 'Playwright logo Playwright' }),
    name: 'Playwright logo link',
    text: 'Playwright',
    attribute: {
      type: 'href',
      value: '/' ,
    },
  },
  {
    locator: (page: Page): Locator  => 
      page.getByRole('link', { name: 'Docs' }),
    name: 'Docs link',
    text: 'Docs',
    attribute: {
      type: 'href',
      value: '/docs/intro' ,
    },
  },
  {
    locator: (page: Page): Locator  => 
      page.getByRole('link', { name: 'API' }),
    name: 'API link',
    text: 'API',
    attribute: {
      type: 'href',
      value: '/docs/api/class-playwright' ,
    },
  },
  {
    locator: (page: Page): Locator  =>  
      page.getByRole('button', { name: 'Node.js' }),
    name: 'Node.js link',
    text: 'Node.js',
  },
  {
    locator: (page: Page): Locator  =>  
      page.getByRole('link', { name: 'Community' }),
    name: 'Community link',
    text: 'Community',
    attribute: {
      type: 'href',
      value: '/community/welcome' ,
    },
  },
  {
    locator: (page: Page): Locator  =>  
      page.getByRole('link', { name: 'GitHub repository' }),
    name: 'GitHub icon',
    attribute: {
      type: 'href',
      value: 'https://github.com/microsoft/playwright',
    },
  },
  {
    locator: (page: Page): Locator  =>  
      page.getByRole('link', { name: 'Discord server' }),
    name: 'Discord icon',
    attribute: {
      type: 'href',
      value: 'https://aka.ms/playwright/discord',
    },
  },
  {
    locator: (page: Page): Locator  =>  
      page.getByRole('button', { name: 'Switch between dark and light' }),
    name: 'Switch lightmode',
  },
  {
    locator: (page: Page): Locator  =>  
      page.getByRole('button', { name: 'Search (Ctrl+K)' }),
    name: 'Search link',
  },
  {
    locator: (page: Page): Locator  =>  
      page.getByRole('heading', { name: 'Playwright enables reliable' }),
    name: 'Title',
    text: 'Playwright enables reliable end-to-end testing for modern web apps'
  },
  {
    locator: (page: Page): Locator  =>  
      page.getByRole('link', { name: 'Get started' }),
    name: 'Get started',
    text: 'Get started',
    attribute: {
      type: 'href',
      value: '/docs/intro',
    },
  },
]

test.describe('тесты главной страницы', () =>{
  test.beforeEach(async ({page}) => {
    await page.goto('https://playwright.dev/');
  });

  test('Проверка отображения элементов навигации хедера', async ({ page }) => {  
    elements.forEach(({locator, name}) => {
      test.step(`Проверка отображаения ${name}`, async() => {
        await expect.soft(locator(page)).toBeVisible();
      });
    });
  });

test('Проверка названия элементов навигации хедера', async ({ page }) => {
  elements.forEach(({locator, name, text}) => {
    if (text) {
      test.step(`Проверка названия элемента ${name}`, async() => {
        await expect(locator(page)).toContainText(text);
      });
    }
  });
  });


test('Проверка атрибуда href, элементов навигации хедера', async ({ page }) => {
  elements.forEach(({locator, name, attribute}) => {
    if (attribute) {
      test.step(`Проверка атрибутов href у элемента ${name}`, async () => {
        await expect.soft(locator(page)).toHaveAttribute(attribute?.type, attribute?.value);
      });
    }
  });
});


test('Проверка переключения лайт мода', async ({ page }) => {
  await page.getByRole('button', { name: 'Switch between dark and light' }).click();
  await page.getByRole('button', { name: 'Switch between dark and light' }).click();
  await expect.soft(page.locator('html')).toHaveAttribute('data-theme','dark');
});

})

