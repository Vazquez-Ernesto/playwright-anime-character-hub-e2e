package com.animehub.hooks;

import com.animehub.context.PlaywrightContext;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;

public class Hooks {

    @Before
    public void beforeScenario() {
        PlaywrightContext.newPage();
    }

    @After
    public void afterScenario(Scenario scenario) {
        if (scenario.isFailed() && PlaywrightContext.getPage() != null) {
            byte[] screenshot = PlaywrightContext.getPage().screenshot();
            scenario.attach(screenshot, "image/png", "screenshot-fallo");
        }
        PlaywrightContext.closePage();
    }
}
