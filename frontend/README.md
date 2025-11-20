# Frontend Structure

Проект использует модульную архитектуру с разделением по фичам (Feature-Sliced Design).

## Структура папок
src/ ├── app/ # Точка входа приложения │ └── main.tsx # Конфигурация роутинга │ ├── features/ # Фичи приложения (модули по доменам) │ ├── auth/ # Аутентификация │ │ ├── components/ # Компоненты фичи (AuthModal) │ │ ├── context/ # Контекст и логика (AuthContext, AuthGate) │ │ └── styles/ # Стили фичи │ │ │ ├── tasks/ # Задачи/таски │ │ ├── hooks/ # Хуки (useTask, useCategoriesTasks) │ │ ├── pages/ # Страницы (Tasks, TaskDetailsPage, CategoryTaskPage) │ │ ├── styles/ # Стили страниц tasks │ │ └── types/ # Типы (Task) │ │ │ ├── categories/ # Категории │ │ └── hooks/ # Хуки (useCategories) │ │ │ └── profile/ # Профиль пользователя │ ├── pages/ # Страницы (Profile) │ └── styles/ # Стили профиля │ ├── shared/ # Общий переиспользуемый код │ ├── ui/ # UI компоненты (Modal) │ ├── api/ # API клиент (axios) │ ├── lib/ # Утилиты и хелперы │ └── types/ # Общие типы │ ├── layouts/ # Layout компоненты │ ├── MainLayout.tsx │ ├── Navbar.tsx │ └── Navbar.module.css │ ├── pages/ # Общие страницы │ ├── Home.tsx │ ├── Learn.tsx │ ├── NotFound.tsx │ └── *.module.css │ ├── content/ # Статический контент (MDX файлы) │ └── stegano/ │ └── globals.css # Глобальные стили


## Принципы организации

### Features (Фичи)
Каждая фича - это самостоятельный модуль со своей логикой:
- **auth** - авторизация и аутентификация
- **tasks** - работа с задачами
- **categories** - работа с категориями
- **profile** - профиль пользователя

### Shared (Общий код)
Переиспользуемые компоненты и утилиты:
- **ui/** - универсальные UI компоненты (Modal, Button и т.д.)
- **api/** - API клиент и конфигурация
- **lib/** - утилиты и хелперы
- **types/** - общие TypeScript типы

### Layouts
Компоненты разметки страниц (MainLayout, Navbar)

### Pages
Общие страницы, не привязанные к конкретной фиче (Home, Learn, NotFound)

## Импорты

Все импорты используют path aliases через `@/`:

```typescript
// Фичи
import { useAuth } from '@/features/auth/context/AuthContext'
import { useTask } from '@/features/tasks/hooks/useTask'

// Shared
import { Modal } from '@/shared/ui/Modal'
import { api } from '@/shared/api/axios'

// Layouts
import { MainLayout } from '@/layouts/MainLayout'

// Pages
import { Home } from '@/pages/Home'
Преимущества такой структуры
Модульность - каждая фича независима
Масштабируемость - легко добавлять новые фичи
Переиспользование - shared код доступен везде
Читаемость - понятная структура проекта
Изоляция - стили и логика рядом с компонентами
