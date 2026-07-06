package com.animehub.steps;

import com.animehub.context.PlaywrightContext;
import com.animehub.pages.HomePage;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class SearchSteps {

    private final HomePage homePage = new HomePage(
        PlaywrightContext.getPage(), PlaywrightContext.getBaseUrl()
    );

    @Given("que estoy en la página principal")
    public void queEstoyEnLaPaginaPrincipal() {
        homePage.navigate();
    }

    @When("busco el personaje {string}")
    public void buscoElPersonaje(String query) {
        homePage.search(query);
    }

    @Then("veo al menos 1 resultado")
    public void veoAlMenos1Resultado() {
        assertTrue(homePage.getResultCount() >= 1);
    }

    @Then("los resultados contienen {string}")
    public void losResultadosContienen(String text) {
        assertTrue(homePage.resultsContain(text));
    }

    @Then("veo el mensaje de resultados vacíos")
    public void veoElMensajeDeResultadosVacios() {
        assertTrue(homePage.isEmptyMessageVisible());
    }

    @Then("el estado de búsqueda muestra {string}")
    public void elEstadoDeBusquedaMuestra(String expectedStatus) {
        assertEquals(expectedStatus, homePage.getSearchStatus());
    }

    @When("selecciono ordenar por {string}")
    public void seleccionoOrdenarPor(String option) {
        homePage.selectSort(option);
    }

    @Then("los resultados están ordenados alfabéticamente")
    public void losResultadosEstanOrdenadosAlfabeticamente() {
        List<String> names = homePage.getResultNames();
        List<String> sorted = names.stream().sorted().toList();
        assertEquals(sorted, names);
    }
}
