import { test, expect } from '@playwright/test';

test.describe('Тестирование формы регистрации', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/steps');
  });

  test('Проверка полного цикла регистрации', async ({ page }) => {
    // Тест проверяет полный цикл работы с формой:
    await test.step('ПРЕДУСЛОВИЯ: Проверить начальное состояние формы', async () => { // 1. Начальное состояние
    await expect(page.locator('#username')).toBeEmpty(); // - Все поля формы пустые
    await expect(page.locator('#email')).toBeEmpty();
    await expect(page.locator('#password')).toBeEmpty();
    await expect(page.locator('#error-message')).toBeHidden(); // - Сообщения об ошибке и успехе скрыты
    await expect(page.locator('#success-message')).toBeHidden();
    await expect(page.locator('#profile-section')).toBeHidden(); // - Секция профиля не отображается

    });

    await test.step('ШАГ 1: Попытка регистрации с пустыми полями', async() => {  // 2. Негативные сценарии
    await page.locator('#register-btn').click(); // - Нажимаем кнопку без заполнения полей
    await expect(page.locator('#error-message')).toBeVisible; // - Появилось сообщение о необходимости заполнить все поля
    await expect(page.locator('#error-message')).toHaveText('Все поля обязательны для заполнения');
    await expect(page.locator('#success-message')).toBeHidden; // - Сообщение об успехе осталось скрытым

    });

    await test.step('ШАГ 2: Попытка регистрации с некорректными данными', async() => {  // 2. Негативные сценарии
    await page.locator('#username').fill('Ivan'); // - Заполняем имя пользователя
    await page.locator('#email').fill('Ivan_ivanov.ru'); // - Вводим email без @
    await page.locator('#password').fill('1'); // - Вводим слишком короткий пароль
    await page.locator('#register-btn').click();
    await expect(page.locator('#error-message')).toBeVisible(); // - Соответствующие сообщения об ошибках
    await expect(page.locator('#error-message')).toContainText('Пароль должен быть не менее 6 символов');

    });

    await test.step('ШАГ 3: Успешная регистрация', async () =>{ // 3. Успешную регистрацию
    await page.locator('#email').fill('Ivan_ivanov@mail.ru'); // - Заполняем все поля корректными данными
    await page.locator('#password').fill('123456'); 
    await page.locator('#register-btn').click();
    await expect(page.locator('error-message')).toBeHidden(); // - Исчезло сообщение об ошибке
    await expect(page.locator('#success-message')).toBeVisible(); // - Появилось сообщение об успехе
    await expect(page.locator('#success-message')).toContainText('Регистрация завершена!');
    await expect(page.locator('#profile-section')).toBeVisible();


    });

    await test.step('ШАГ 4: Проверка данных профиля', async() => { // 4. Проверку профиля
    await expect(page.locator('#profile-username')).toHaveText('Ivan'); // - Данные в профиле соответствуют введенным при регистрации
    await expect(page.locator('#profile-email')).toHaveText('Ivan_ivanov@mail.ru');
    }); 

    await test.step('ШАГ 5: Выход из системы', async() => {  // 5. Выход из системы
    await page.locator('#logout-btn').click();  // - Нажимаем кнопку выхода
    await expect(page.locator('#profile-section')).toBeHidden(); // - Секция профиля скрыта
    await expect(page.locator('#username')).toBeEmpty(); // - Форма регистрации сброшена
    await expect(page.locator('#email')).toBeEmpty();
    await expect(page.locator('#password')).toBeEmpty();
    
  });
})

  // Демонстрационный тест
  test.describe('Параметризованные тесты регистрации', () => {
    const testCases = [
      {
        title: 'Короткий пароль (5 символов)',
        data: { username: 'user1', email: 'user1@test.com', password: '12345' },
        expectedError: 'Пароль должен быть не менее 6 символов',
      },
    ];

    for (const testCase of testCases) {
      test(testCase.title, async ({ page }) => {
        await test.step('ЗАПОЛНЕНИЕ: Ввести тестовые данные', async () => {
          await page.locator('#username').fill(testCase.data.username);
          await page.locator('#email').fill(testCase.data.email);
          await page.locator('#password').fill(testCase.data.password);
        });

        await test.step('ДЕЙСТВИЕ: Отправить форму', async () => {
          await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        });

        await test.step('ПРОВЕРКА: Сообщение об ошибке', async () => {
          await expect(page.locator('#error-message')).toBeVisible();
          await expect(page.locator('#error-message')).toContainText(testCase.expectedError);
        });
      });
    }
  });

  // Демонстрационный тест
  test('Вложенные шаги с группами проверок', async ({ page }) => {
    await test.step('ГРУППА: Проверки валидации формы', async () => {
      await test.step('ПУСТЫЕ ПОЛЯ: Отправка пустой формы', async () => {
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        await expect(page.locator('#error-message')).toHaveText(/Все поля обязательны/);
      });

      await test.step('ЧАСТИЧНО ЗАПОЛНЕННАЯ: Только имя пользователя', async () => {
        await page.locator('#username').fill('partialuser');
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        await expect(page.locator('#error-message')).toHaveText(/Все поля обязательны/);
      });
    });

    await test.step('ГРУППА: Проверки успешных сценариев', async () => {
      await test.step('КОРРЕКТНЫЕ ДАННЫЕ: Полное заполнение формы', async () => {
        await page.locator('#username').fill('validuser');
        await page.locator('#email').fill('valid@example.com');
        await page.locator('#password').fill('validpassword123');
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        await expect(page.locator('#success-message')).toBeVisible();
      });
    });
  });
});
