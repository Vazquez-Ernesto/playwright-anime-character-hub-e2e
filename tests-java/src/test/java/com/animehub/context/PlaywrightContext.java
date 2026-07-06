package com.animehub.context;

import com.microsoft.playwright.*;

public class PlaywrightContext {

    private static final Playwright playwright;
    private static final Browser browser;
    private static Page page;

    private static final String BASE_URL =
        System.getProperty("base.url", "https://playwright-anime-character-hub-e2e.vercel.app");

    static {
        playwright = Playwright.create();
        browser = playwright.chromium().launch(
            new BrowserType.LaunchOptions().setHeadless(true)
        );
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            browser.close();
            playwright.close();
        }));
    }

    public static Page getPage() {
        return page;
    }

    public static String getBaseUrl() {
        return BASE_URL;
    }

    public static void newPage() {
        page = browser.newPage();
        page.setDefaultTimeout(20_000);
    }

    public static void closePage() {
        if (page != null) {
            page.close();
            page = null;
        }
    }
}
