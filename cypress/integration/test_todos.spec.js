describe("TODO List", () => {

    beforeEach("Borrar datos", () => {
        // Antes de cada test remueve todos los datos
        cy.request("DELETE", "http://localhost:3000/todos") 
    })
    
    describe("Una vez cargada la pagina", () => {
        beforeEach("Cargar la pagina", () => {
            cy.visit("http://localhost:3000")
            cy.crearTodo("Preparar cypress")
        });
        
        it("debe mostrar los elementos de la pagina", () => {
            cy.get("header.App-header")
            
            // se fija que exista el item (usando el comando getTodo)
            cy.getTodo("Preparar cypress").as("item")
            
            // se fija que el item tenga un checkbox
            cy.get("@item").get('input[type="checkbox"]').should("not.be.checked")
            // se fija que el item tenga un boton delete
            cy.get("@item").get('button[aria-label="Delete"]')
        })
        
        it("puede crear un nuevo item", () => {
            const newTODO = Math.random() + " el todo";
            cy.get(".todoList").contains(newTODO).should("not.exist")
    
            cy.crearTodo(newTODO)
            cy.getTodo(newTODO)
            
            //el nuevo item sigue existiendo despues de refrescar
            cy.visit("http://localhost:3000")
            cy.getTodo(newTODO)
        })
        
        it("puede marcar un item como completado", () => {
            cy.getTodo("Preparar cypress").as("item")
            cy.get("@item").get('input[type="checkbox"]').check()
            cy.get("@item").get('input[type="checkbox"]').should("be.checked")
        })
        
        it("puede eliminar un item", () => {
            cy.getTodo("Preparar cypress").as("item")
            cy.get("@item").get('button[aria-label="Delete"]').click();
            
            cy.get(".todoList").contains("Preparar cypress").should("not.exist")
        })
    })
    
    describe("Edge cases", () => {
        it("se muestra el 'Loading' mientras carga la pagina", () => {
            cy.server()
            
            // intercepto la request a GET /todos, la demoro 2 segundos y luego la dejo
            // seguir su curso (no proveo una respuesta mock)
            cy.route({ url: "/todos", delay: 2000 }).as("getTodos")
            
            cy.visit("http://localhost:3000")
            
            // displays the loading 
            cy.contains("Loading")
            
            // espero que termine la request
            cy.wait("@getTodos")
            
            // ahora el loading no está mas! =)
            cy.contains("Loading").should("not.exist")
        });
        
        it("Si falla el fetch de TODOs muestro un error", () => {
            cy.server()
            cy.route({ url: "/todos", status: 500, response: "" })
            
            cy.visit("http://localhost:3000")
            
            // muestra el mensaje de error
            cy.get(".errors").contains("Server error 500")
        })
    })
   
    describe("Cosas un poquito mas hackerosas", () => {
        
        it("Puedo acceder al store de redux!", () => {
            cy.visit("http://localhost:3000")
            
            // espero a que se vaya el Loading
            cy.contains("Loading").should("not.exist")
            
            // dispatcheo una accion de redux... WAT?!
            cy.window().its("cypressStore").then(store => {
                store.dispatch({ type: "LOADING_ITEMS" })
            })
            
            // displays the loading, again! :D
            cy.contains("Loading")
            
        })
        
    })
    
})