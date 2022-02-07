# запуск на эмуляторе + билд apk

npm version patch
ng build --aot
npx cap run android

# запуск для дебага на эмуляторе

ng serve --host 0.0.0.0
npx cap run android --external --source-map -l

# билд apk

npx cap copy android
npx cap open android
