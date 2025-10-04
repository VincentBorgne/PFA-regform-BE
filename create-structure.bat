@echo off
echo Creating NestJS project structure and config files...

REM Create main directories
mkdir src\config
mkdir src\database
mkdir src\registration\dto
mkdir src\email
mkdir drizzle

REM Create all TypeScript files
echo. > src\config\database.config.ts
echo. > src\database\schema.ts
echo. > src\database\drizzle.module.ts
echo. > src\registration\registration.controller.ts
echo. > src\registration\registration.service.ts
echo. > src\registration\registration.module.ts
echo. > src\registration\dto\create-registration.dto.ts
echo. > src\email\email.service.ts
echo. > src\email\email.module.ts

REM Create config files in root
echo. > .env
echo. > drizzle.config.ts

echo.
echo ========================================
echo Structure created successfully!
echo ========================================
echo.
echo Files to fill with provided code:
echo - src/database/schema.ts
echo - src/database/drizzle.module.ts
echo - src/registration/registration.controller.ts
echo - src/registration/registration.service.ts
echo - src/registration/registration.module.ts
echo - src/registration/dto/create-registration.dto.ts
echo - src/email/email.service.ts
echo - src/email/email.module.ts
echo - src/app.module.ts (REPLACE existing)
echo - src/main.ts (REPLACE existing)
echo - .env
echo - drizzle.config.ts
echo.
echo Next: Update package.json scripts section with db commands
echo.
pause