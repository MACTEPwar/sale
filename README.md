# запуск на эмуляторе + билд apk

npm version patch
ng build --aot
npx cap run android

# запуск для дебага на эмуляторе

ng serve --host 0.0.0.0
npx cap run android --external --source-map -l

# билд apk

ng build --aot
npx cap sync
npx cap copy android
npx cap open android
build in android studio

# Дебаг версия - sale\android\app\build\outputs\apk\debug


ng build --aot
npx cap sync


npx cap rm android
npx cap add android
npx cap sync