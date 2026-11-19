<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta name="color-scheme" content="dark light">

        {{-- Inline script to ensure saved theme is applied before first paint --}}
        <script>
            (function() {
                const saved = localStorage.getItem('appearance');
                const appearance = saved || '{{ $appearance ?? "dark" }}';
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark);

                if (!isDark) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.colorScheme = 'light';
                } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.colorScheme = 'dark';
                }
            })();
        </script>

        {{-- Inline style to prevent FOUC --}}
        <style>
            html {
                background-color: #f8fafc;
                color: #0f172a;
                color-scheme: light;
            }

            html.dark {
                background-color: #0b1523;
                color: #ffffff;
                color-scheme: dark;
            }
        </style>

        <title inertia>{{ config('fylo.name', config('app.name', 'Fylo')) }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-yH4VJ1J/ABkP+iD1EZU5t3hM7cYfJwJZn8H2Xo1+zqz2N6j5o6zC5WGBVf0TnVngb+zvC32B8/J9Hd0UL6FzHQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
        @routes
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
