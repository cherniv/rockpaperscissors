package com.bioludus.rockpaperscissors;

import com.facebook.react.ReactActivity;
import com.imagepicker.ImagePickerPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.sbugert.rnadmob.RNAdMobPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import android.content.Intent;
import android.os.Bundle; // here
import org.devio.rn.splashscreen.SplashScreen; // here
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
     @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }
    @Override
    protected String getMainComponentName() {
        return "rps";
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
}
