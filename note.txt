npm run build
npx ncc build dist/main.js -o dist-bundle
xcopy dist\views dist-bundle\views /E /I
xcopy dist\public dist-bundle\public /E /I
node dist-bundle/index.js
