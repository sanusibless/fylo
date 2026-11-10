<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <meta name="color-scheme" content="dark light">

        {{-- Inline script to ensure dark theme is applied by default for Fylo SaaS experience --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "dark" }}';

                if (appearance === 'light') {
                    document.documentElement.classList.remove('dark');
                } else {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>

        {{-- Inline style to prevent FOUC with Fylo brand dark canvas --}}
        <style>
            html {
                background-color: #0b1523;
                color: #ffffff;
                color-scheme: dark;
            }

            html.dark {
                background-color: #0b1523;
                color: #ffffff;
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/images/logo.svg" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-yH4VJ1J/ABkP+iD1EZU5t3hM7cYfJwJZn8H2Xo1+zqz2N6j5o6zC5WGBVf0TnVngb+zvC32B8/J9Hd0UL6FzHQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
        @routes
        @inertia
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>

    <!--Start of Tawk.to Script-->
    <script type="text/javascript">
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/69caf92f8ea3191c37389dfd/1jl0dqoph';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
    })();
    </script>
<!--End of Tawk.to Script-->
</html>
