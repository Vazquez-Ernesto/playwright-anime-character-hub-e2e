# language: es
Feature: Historial de búsquedas
  Como usuario
  Quiero ver el registro de mis búsquedas anteriores
  Para saber qué consulté y desde qué fuente

  Background:
    Given que estoy en la página principal

  Scenario: Una búsqueda queda registrada en el historial
    When busco el personaje "Frieza"
    Then el historial de búsquedas contiene "Frieza"

  Scenario: La segunda búsqueda del mismo término usa caché
    When busco el personaje "Frieza"
    And busco el personaje "Frieza"
    Then el historial muestra la fuente "cache"

  Scenario: Limpiar historial elimina todas las entradas
    When busco el personaje "Piccolo"
    And limpio el historial de búsquedas
    Then el historial está vacío
