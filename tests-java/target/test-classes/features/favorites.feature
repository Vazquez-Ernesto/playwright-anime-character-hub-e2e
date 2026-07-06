# language: es
Feature: Gestión de favoritos
  Como usuario
  Quiero guardar y eliminar personajes favoritos
  Para acceder a ellos fácilmente

  Background:
    Given que estoy en la página principal

  Scenario: Guardar un personaje como favorito
    When busco el personaje "Vegeta"
    And abro el detalle del primer resultado
    And guardo el personaje como favorito
    Then el botón muestra "Ya está en favoritos"
    And al volver al inicio el personaje aparece en el panel de favoritos

  Scenario: Eliminar un favorito del panel
    When busco el personaje "Vegeta"
    And abro el detalle del primer resultado
    And guardo el personaje como favorito
    And vuelvo al buscador
    When elimino el primer favorito del panel
    Then el contador de favoritos es 0
