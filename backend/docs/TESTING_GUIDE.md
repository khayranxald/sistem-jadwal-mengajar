# 🧪 Complete Testing Guide

## Daftar Isi
1. [Setup Testing Environment](#setup)
2. [Backend Testing](#backend)
3. [Frontend Testing](#frontend)
4. [E2E Testing](#e2e)
5. [Performance Testing](#performance)
6. [Security Testing](#security)
7. [CI/CD Integration](#cicd)

---

## 🛠️ Setup Testing Environment {#setup}

### Backend Setup (Laravel)

```bash
# Install dependencies
composer install

# Copy environment file
cp .env.example .env.testing

# Configure testing database
# Edit .env.testing
DB_CONNECTION=sqlite
DB_DATABASE=:memory:

# Run migrations
php artisan migrate --env=testing

# Run tests
php artisan test
```

### Frontend Setup (React + Vitest)

```bash
# Install dependencies
npm install

# Install testing libraries
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui

# Run tests
npm test

# Run with UI
npm run test:ui

# Generate coverage
npm run test:coverage
```

---

## 🔧 Backend Testing {#backend}

### Structure
```
tests/
├── Unit/           # Unit tests for models, services
├── Feature/        # API endpoint tests
└── TestCase.php    # Base test class
```

### Running Tests

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/Auth/LoginTest.php

# Run specific test method
php artisan test --filter test_user_can_login

# Run with coverage
php artisan test --coverage

# Parallel execution
php artisan test --parallel
```

### Writing Backend Tests

#### Example: Feature Test
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    public function test_example()
    {
        // Arrange
        $user = User::factory()->create();

        // Act
        $response = $this->actingAs($user)
                         ->getJson('/api/profile');

        // Assert
        $response->assertStatus(200)
                 ->assertJson(['success' => true]);
    }
}
```

### Testing Checklist

#### ✅ Authentication Tests
- [x] Login with valid credentials
- [x] Login with invalid credentials
- [x] Logout
- [x] Token validation
- [x] Password reset

#### ✅ Authorization Tests
- [x] Admin can access admin routes
- [x] Guru cannot access admin routes
- [x] Kepsek can view reports
- [x] Role-based restrictions

#### ✅ CRUD Tests (for each resource)
- [x] Create with valid data
- [x] Create with invalid data
- [x] Read single resource
- [x] Read all resources
- [x] Update resource
- [x] Delete resource
- [x] Soft delete (if applicable)

#### ✅ Business Logic Tests
- [x] Generate jadwal algorithm
- [x] Ketersediaan guru validation
- [x] Conflict detection
- [x] Statistics calculation

---

## ⚛️ Frontend Testing {#frontend}

### Structure
```
src/tests/
├── components/     # Component tests
├── hooks/          # Hook tests
├── integration/    # Integration tests
├── utils/          # Utility function tests
└── setup.js        # Test setup
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Run specific file
npm test Button.test.jsx

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

### Writing Frontend Tests

#### Example: Component Test
```jsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Testing Checklist

#### ✅ Component Tests
- [x] Renders correctly
- [x] Handles user interactions
- [x] Updates on prop changes
- [x] Shows loading states
- [x] Handles errors
- [x] Accessibility

#### ✅ Hook Tests
- [x] useState behavior
- [x] useEffect dependencies
- [x] Custom hook logic
- [x] Cleanup functions

#### ✅ Integration Tests
- [x] API calls
- [x] State management
- [x] Navigation
- [x] Form submissions

---

## 🎭 E2E Testing {#e2e}

### Setup Playwright

```bash
# Install Playwright
npm init playwright@latest

# Run tests
npx playwright test

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug

# Show report
npx playwright show-report
```

### Writing E2E Tests

```javascript
import { test, expect } from '@playwright/test';

test('complete login flow', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[type="email"]', 'admin@test.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/admin/dashboard');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

### E2E Testing Checklist

#### ✅ User Flows
- [x] Complete login flow
- [x] Navigation between pages
- [x] CRUD operations
- [x] Form submissions
- [x] File uploads
- [x] Export/download files

#### ✅ Cross-browser
- [x] Chrome
- [x] Firefox
- [x] Safari
- [x] Mobile browsers

---

## ⚡ Performance Testing {#performance}

### Lighthouse CI

```bash
# Install
npm install -g @lhci/cli

# Run audit
lhci autorun

# Generate report
lhci collect --url=http://localhost:5173
```

### Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 2s | - |
| Largest Contentful Paint | < 2.5s | - |
| Time to Interactive | < 3.5s | - |
| Cumulative Layout Shift | < 0.1 | - |
| Total Blocking Time | < 300ms | - |

### Performance Checklist

#### ✅ Frontend
- [x] Code splitting
- [x] Lazy loading
- [x] Image optimization
- [x] Bundle size < 500KB
- [x] No unnecessary re-renders

#### ✅ Backend
- [x] Database query optimization
- [x] Eager loading relationships
- [x] Caching strategy
- [x] API response time < 200ms

---

## 🔒 Security Testing {#security}

See [SECURITY_TESTING.md](./SECURITY_TESTING.md) for detailed security testing guide.

### Quick Security Checks

```bash
# Backend
composer audit
php artisan test --filter Security

# Frontend
npm audit
npm audit fix
```

---

## 🚀 CI/CD Integration {#cicd}

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      - name: Install Dependencies
        run: composer install
      - name: Run Tests
        run: php artisan test --coverage

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test -- --coverage
      - name: E2E Tests
        run: npx playwright test
```

---

## 📊 Test Coverage Goals

| Layer | Target Coverage |
|-------|----------------|
| Backend Unit Tests | > 80% |
| Backend Feature Tests | > 90% |
| Frontend Components | > 80% |
| Frontend Hooks | > 90% |
| E2E Critical Paths | 100% |

---

## 🐛 Debugging Tests

### Backend Debugging

```php
// Add dd() for debugging
public function test_example()
{
    $user = User::factory()->create();
    dd($user); // Stop and dump
    
    $response = $this->actingAs($user)->getJson('/api/profile');
}
```

### Frontend Debugging

```javascript
// Add screen.debug() for debugging
it('renders correctly', () => {
  render(<Component />);
  screen.debug(); // Print DOM
  expect(screen.getByText('Text')).toBeInTheDocument();
});
```

---

## 📝 Test Reports

### Generate Reports

```bash
# Backend
php artisan test --coverage-html reports/backend

# Frontend
npm run test:coverage -- --reporter=html

# E2E
npx playwright test --reporter=html
```

### View Reports

```bash
# Backend
open reports/backend/index.html

# Frontend
open coverage/index.html

# E2E
npx playwright show-report
```

---

## ✅ Pre-deployment Checklist

- [ ] All tests passing
- [ ] Coverage meets targets
- [ ] Security audit passed
- [ ] Performance metrics acceptable
- [ ] E2E tests for critical paths
- [ ] Documentation updated
- [ ] Changelog updated

---

## 🎯 Best Practices

1. **Write tests first** (TDD approach when possible)
2. **Test behavior, not implementation**
3. **Keep tests isolated and independent**
4. **Use descriptive test names**
5. **Mock external dependencies**
6. **Test edge cases and error states**
7. **Maintain high coverage (>80%)**
8. **Run tests before committing**
9. **Review test failures immediately**
10. **Update tests when features change**