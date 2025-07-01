## Для потомков:

### Чтобы работал компонент Icon из uikit:
1. Выгружаем фуру svg файлов в packages/ui/resources/icons
2. Запускаем как угодно сборочку ui (dev/build)
3. Он генерирует спрайты и типы. Один будет рядом с компонентом Icon, остальные должны быть в public папках, пример настройки есть в vite-config-е packages/ui.
4. Получается при добавлении нового app, который использует uikit надо добавлять его в конфиг спрайт генератора...

## apps/main
1. Telegram launch params доступны в Route.useRouteContext(), лучше использовать его для их получения в коде компонента


## Для удобства нативной разработки TMA в Cursor используем DevTunnels (не обязательно)
- По умолчанию в курсоре их нет, их надо подрезать у VSCode:
`cp /Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code-tunnel /Applications/Cursor.app/Contents/Resources/app/bin/`
- Далее классический флоу DevTunnels (port 1111, public)
- Создаем через BotFather мини-аппку с полученым в DevTunnels адреом