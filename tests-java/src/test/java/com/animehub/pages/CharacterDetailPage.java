package com.animehub.pages;

import com.microsoft.playwright.Page;

public class CharacterDetailPage {

    private final Page page;
    private final String baseUrl;

    public CharacterDetailPage(Page page, String baseUrl) {
        this.page = page;
        this.baseUrl = baseUrl;
    }

    public void navigate(int id) {
        page.navigate(baseUrl + "/characters/" + id);
        page.waitForSelector("[data-testid='character-detail']");
    }

    public boolean isDetailVisible() {
        return page.locator("[data-testid='character-detail']").isVisible();
    }

    public boolean isCharacterNameVisible() {
        return page.locator("[data-testid='character-detail-name']").isVisible();
    }

    public void addToFavorites() {
        page.locator("[data-testid='add-favorite-button']").click();
    }

    public String getFavoriteButtonText() {
        return page.locator("[data-testid='add-favorite-button']").textContent().trim();
    }

    public void goBack() {
        page.locator("text=Volver al buscador").click();
        page.waitForSelector("[data-testid='character-search-input']");
    }

    public void searchByRace() {
        page.locator("[data-testid='search-by-race-button']").click();
    }
}
