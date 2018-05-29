describe("TODO List", () => {
    
    it("debe mostrar los elementos de la pagina", () => {
        const texto = Math.random() + " el todo";
        
        cy.visit("http://localhost:3000")
        
        cy.get("header.App-header")
        cy.get("ul li").contains("Preparar cypress")
        
        cy.contains(texto).should("not.exist")

        cy.crearTodo(texto)
        
        cy.get("ul li").contains(texto)
        
        cy.window().its('cypressStore').then(store => {
            return store.dispatch({ type: "LOADING_ITEMS"})
        })   
    })
    
    beforeEach(() => {
       cy.request("DELETE", "http://localhost:3000/todos") 
       
       cy.visit("http://localhost:3000")
       
       cy.crearTodo("Preparar cypress")
    });
    
    
    
})