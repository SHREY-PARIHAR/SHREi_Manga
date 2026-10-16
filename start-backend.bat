@echo off
title SHREI Manga API
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install Node.js 22 or newer, then run this file again.
  pause
  exit /b 1
)
if not exist "node_modules\express" (
  echo Installing the website dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)
echo Starting the SHREI API. Keep this window open while using the website.
echo Close this window to stop the API.
call npm.cmd run start:backend
if errorlevel 1 pause
