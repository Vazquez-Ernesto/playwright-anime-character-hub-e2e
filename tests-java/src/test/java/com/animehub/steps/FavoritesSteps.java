package com.animehub.steps;

import com.animehub.context.PlaywrightContext;
import com.animehub.pages.CharacterDetailPage;
import com.animehub.pages.HomePage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.junit.jupiter.api.Assertions.*;

public class FavoritesSteps {

    private final HomePage homePage = new HomePage(
        PlaywrightContext.getPage(), PlaywrightContext.getBaseUrl()
    );
    private final CharacterDetailPage detailPage = new CharacterDetailPage(
        PlaywrightContext.getPage(), PlaywrightContext.getBaseUrl()
    );

    @And("guardo el personaje como favorito")
    public void guardoElPersonajeComoFavorito() {
        detailPage.addToFavorites();
    }

    @Then("el botón muestra {string}")
    public void elBotonMuestra(String expected) {
        assertEquals(expected, detailPage.getFavoriteButtonText());
    }

    @Then("al volver al inicio el personaje aparece en el panel de favoritos")
    public void alVolverAlInicioElPersonajeApareceEnElPanelDeFavoritos() {
        detailPage.goBack();
        assertTrue(homePage.getFavoritesCount() >= 1);
    }

    @When("elimino el primer favorito del panel")
    public void eliminoElPrimerFavoritoDelPanel() {
        homePage.removeFirstFavorite();
    }

    @Then("el contador de favoritos es 0")
    public void elContadorDeFavoritosEs0() {
        assertEquals(0, homePage.getFavoritesCount());
    }
}
