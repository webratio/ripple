@echo off
setlocal
echo * Building ripple...
echo.


if not exist "bin/ripple" (
    echo * ERROR: ripple not found. Check your current dir.
    goto :EOF
)

for /f "tokens=* usebackq" %%f in (`node -v`) do (
    set node_version=%%f
)
node -e "process.exit(/^v6\..*/.test('%node_version%') ? 0 : 1)"
if errorlevel 1 (
	echo * ERROR: invalid Node version. Please use Node 6
	goto :EOF
)

for /f "tokens=* usebackq" %%f in (`npm -v`) do (
    set npm_version=%%f
)
node -e "process.exit(/^5\..*/.test('%npm_version%') ? 0 : 1)"
if errorlevel 1 (
	echo * ERROR: invalid npm version. Please use npm 5
	goto :EOF
)

if exist "pkg\hosted" (
    echo * removing target folder pkg/hosted
    echo.
    rd pkg\hosted /s /q
)

if exist "ripple-emulator-*.tgz" (
    echo * removing target tgz files
    echo.
    del ripple-emulator-*.tgz /q
)

echo * npm installing
echo.
set Path=%Path%;.\node_modules\.bin
call npm install

echo.
echo * bower installing
echo.
call node_modules\.bin\bower install

echo.
if "%1"=="release" (
    echo * packing for release
    echo.
    if "%2"=="allow-pending" (
        call jake pack[allow-pending,no-test] --trace
    ) else (
        call jake pack[no-test] --trace
    )
    echo.
    echo * WARNING the repository is no longer on branch master, switch it back before commiting again
    echo.
) else (
    echo * packing for debug
    echo.
    call jake pack[allow-pending,no-test,current,no-compress] --trace
)

echo * done
echo.

pause


