package com.animehub.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

import java.util.List;

public class HomePage {

    private final Page page;
    private final String baseUrl;

    public HomePage(Page page, String baseUrl) {
        this.page = page;
        this.baseUrl = baseUrl;
    }

    public void navigate() {
        page.navigate(baseUrl);
        page.waitForSelector("[data-testid='character-search-input']");
    }

    public void search(String query) {
        Locator input = page.locator("[data-testid='character-search-input']");
        input.fill(query);
        page.locator("[data-testid='character-search-button']").click();
        page.waitForSelector("[data-testid='search-status']");
    }

    public void clickRandom() {
        page.locator("[data-testid='random-character-button']").click();
    }

    public int getResultCount() {
        List<Locator> cards = page.locator("[data-testid='character-results'] article").all();
        return cards.size();
    }

    public String getSearchStatus() {
        return page.locator("[data-testid='search-status']").textContent().trim();
    }

    public boolean resultsContain(String text) {
        return page.locator("[data-testid='character-results']").textContent().contains(text);
    }

    public boolean isEmptyMessageVisible() {
        return page.locator("text=No hay resultados para la búsqueda actual.").isVisible();
    }

    public void openFirstResult() {
        page.locator("[data-testid='character-results'] article a").first().click();
    }

    public void selectSort(String optionLabel) {
        page.locator("[data-testid='sort-select']").selectOption(
            new com.microsoft.playwright.options.SelectOption().setLabel(optionLabel)
        );
    }

    public List<String> getResultNames() {
        return page.locator("[data-testid='character-results'] article h3").allTextContents();
    }

    public boolean isFavoritePanelContains(String name) {
        return page.locator("[data-testid='favorites-list']").textContent().contains(name);
    }

    public void removeFirstFavorite() {
        page.locator("[data-testid^='remove-favorite-']").first().click();
    }

    public int getFavoritesCount() {
        return Integer.parseInt(
            page.locator("[data-testid='favorites-count']").textContent().trim()
        );
    }

    public String getHistoryText() {
        return page.locator("[data-testid='search-history-list']").textContent();
    }

    public boolean isHistoryEmpty() {
        return page.locator("[data-testid='search-history-list'] li").count() == 0;
    }

    public void clearHistory() {
        page.locator("[data-testid='clear-history-button']").click();
    }
}
