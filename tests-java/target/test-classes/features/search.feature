# language: es
Feature: Búsqueda de personajes Dragon Ball
  Como usuario de la app
  Quiero poder buscar personajes por nombre
  Para encontrar información sobre ellos

  Background:
    Given que estoy en la página principal

  Scenario: Buscar personaje existente devuelve resultados
    When busco el personaje "Goku"
    Then veo al menos 1 resultado
    And los resultados contienen "Goku"

  Scenario: Buscar personaje inexistente muestra estado vacío
    When busco el personaje "zzznohay"
    Then veo el mensaje de resultados vacíos

  Scenario: Enviar búsqueda vacía muestra validación
    When busco el personaje ""
    Then el estado de búsqueda muestra "Ingresá un nombre para buscar."

  Scenario: Ordenar resultados por nombre muestra lista alfabética
    When busco el personaje "Goku"
    And selecciono ordenar por "Nombre A-Z"
    Then los resultados están ordenados alfabéticamente
