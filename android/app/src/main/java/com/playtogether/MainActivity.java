package com.playtogether;

import android.content.Intent;
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactInstanceManager;
import com.oblador.vectoricons.VectorIconsPackage;
import cn.jpush.android.api.JPushInterface;
import android.os.Bundle;

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PlayTogether";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        JPushInterface.init(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }

}
