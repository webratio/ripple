@echo off
echo * Building ripple...
echo.


if not exist "bin/ripple" (
   echo * ERROR: ripple not found. Check your current dir.
   goto:EOF
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
call npm install -g jake jshint csslint uglify-js
call npm install

echo.
echo * bower installing
echo.
call node_modules\.bin\bower install

echo.
if "%1"=="release" (
    echo * packing for release
    echo.
    call jake pack[no-test]
    echo.
    echo * WARNING the repository is no longer on branch master, switch it back before commiting again
    echo.
) else (
    echo * packing for debug
    echo.
    call jake pack[allow-pending,no-test,current]
)

echo * done
echo.

pause


