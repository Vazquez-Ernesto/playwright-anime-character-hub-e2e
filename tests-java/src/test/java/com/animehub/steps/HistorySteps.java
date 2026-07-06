package com.animehub.steps;

import com.animehub.context.PlaywrightContext;
import com.animehub.pages.HomePage;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.junit.jupiter.api.Assertions.*;

public class HistorySteps {

    private final HomePage homePage = new HomePage(
        PlaywrightContext.getPage(), PlaywrightContext.getBaseUrl()
    );

    @Then("el historial de búsquedas contiene {string}")
    public void elHistorialContiene(String text) {
        assertTrue(homePage.getHistoryText().toLowerCase().contains(text.toLowerCase()));
    }

    @Then("el historial muestra la fuente {string}")
    public void elHistorialMuestraLaFuente(String source) {
        assertTrue(homePage.getHistoryText().contains(source));
    }

    @When("limpio el historial de búsquedas")
    public void limpioElHistorialDeBusquedas() {
        homePage.clearHistory();
    }

    @Then("el historial está vacío")
    public void elHistorialEstaVacio() {
        assertTrue(homePage.isHistoryEmpty());
    }
}
