# language: es
Feature: Navegación entre páginas
  Como usuario
  Quiero navegar fluidamente entre el buscador y el detalle de personajes

  Scenario: Abrir detalle de un personaje desde los resultados
    Given que estoy en la página principal
    When busco el personaje "Goku"
    And abro el detalle del primer resultado
    Then veo el panel de detalle del personaje
    And el nombre del personaje es visible

  Scenario: El botón aleatorio navega a un detalle
    Given que estoy en la página principal
    When hago clic en el botón de personaje aleatorio
    Then soy redirigido a una página de detalle

  Scenario: Buscar más personajes de la misma raza
    Given que estoy en el detalle del personaje 1
    When hago clic en buscar más de esa raza
    Then soy redirigido al inicio con resultados
