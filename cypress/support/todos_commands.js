
Cypress.Commands.add("getTodo", (texto) => {
    return cy.get(".todoList").contains(texto).parents(".todoItem")
})

Cypress.Commands.add("crearTodo", (texto) => {
    cy.get("#text").type(texto)
    cy.contains("Agregar").click()
})