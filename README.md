# Releases

The following sections describe release requirements.

## How to Build
Get the latest from the repo. and execute the following command in order.

First thing is to change the version number in package.json and config.xml.	

1) npm install
2) ionic cordova platform add android
3) ionic cordova build android --release --production 

Once the build is successful, navigate to the folder Platforms\android  and then execute the following commands.

4) gradlew bundle  
5) jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore C:\Hasan\hasan.keystore C:\Hasan\ionic5\tamil-dua\platforms\android\app\build\outputs\bundle\release\app.aab hasankeystore
	When prompted, enter the old gmail password.

Jarsigner should be available in bin folder of your java JDK install (Java SE).

Additionally you might face error for python installation. There is windows installer available for that.. 



