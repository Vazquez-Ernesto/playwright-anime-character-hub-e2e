package com.animehub.steps;

import com.animehub.context.PlaywrightContext;
import com.animehub.pages.CharacterDetailPage;
import com.animehub.pages.HomePage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.junit.jupiter.api.Assertions.*;

public class NavigationSteps {

    private final HomePage homePage = new HomePage(
        PlaywrightContext.getPage(), PlaywrightContext.getBaseUrl()
    );
    private final CharacterDetailPage detailPage = new CharacterDetailPage(
        PlaywrightContext.getPage(), PlaywrightContext.getBaseUrl()
    );

    @And("abro el detalle del primer resultado")
    public void abroElDetallePrimerResultado() {
        homePage.openFirstResult();
        PlaywrightContext.getPage().waitForSelector("[data-testid='character-detail']");
    }

    @And("vuelvo al buscador")
    public void vuelvoAlBuscador() {
        detailPage.goBack();
    }

    @Then("veo el panel de detalle del personaje")
    public void veoElPanelDeDetalleDelPersonaje() {
        assertTrue(detailPage.isDetailVisible());
    }

    @Then("el nombre del personaje es visible")
    public void elNombreDelPersonajeEsVisible() {
        assertTrue(detailPage.isCharacterNameVisible());
    }

    @When("hago clic en el botón de personaje aleatorio")
    public void hagoClicEnElBotonDePersonajeAleatorio() {
        homePage.clickRandom();
    }

    @Then("soy redirigido a una página de detalle")
    public void soyRedirigidoAUnaPaginaDeDetalle() {
        PlaywrightContext.getPage().waitForURL("**/characters/**");
        assertTrue(PlaywrightContext.getPage().url().contains("/characters/"));
    }

    @Given("que estoy en el detalle del personaje {int}")
    public void queEstoyEnElDetalleDelPersonaje(int id) {
        detailPage.navigate(id);
    }

    @When("hago clic en buscar más de esa raza")
    public void hagoClicEnBuscarMasDeEsaRaza() {
        detailPage.searchByRace();
        PlaywrightContext.getPage().waitForURL("**/?race=**");
    }

    @Then("soy redirigido al inicio con resultados")
    public void soyRedirigidoAlInicioConResultados() {
        assertTrue(PlaywrightContext.getPage().url().contains("race="));
        assertTrue(homePage.getResultCount() >= 1);
    }
}
