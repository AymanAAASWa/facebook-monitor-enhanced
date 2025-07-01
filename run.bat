@echo off

:: تثبيت الحزم
npm install

:: تعيين البيئة (اختياري)
set NODE_ENV=development

:: فتح الموقع في Google Chrome
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" http://192.168.31.54:5173/

:: تشغيل وضع التطوير
npm run dev

pause
