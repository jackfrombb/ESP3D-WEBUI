cd %~dp0
cmd.exe /c npm install
rmdir /Q /S languages
mkdir languages\ru
cmd.exe /c gulp package --lang ru
copy index.html.gz languages\ru
pause
