@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js and try again.
  pause
  exit /b 1
)
node tools\build-content.cjs
if errorlevel 1 (
  echo BUILD FAILED. Correct the reported file and try again.
  pause
  exit /b 1
)
echo Upload all CONTENTS of Publish into your GitHub Pages PWA folder.
pause
