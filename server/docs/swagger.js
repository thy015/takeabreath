const swaggerJsdoc = require('swagger-jsdoc')

    const swaggerDefinition={
        openapi:'3.0.0',
        info:{
            title:'TAB hotel booking API',
            version:'1.0',
            description:'API docs for TAB'
        },
        servers:[
            {
                url:'http://localhost:4000',
                description:'Test on local server'
            }
        ],
    }
    const options={
        swaggerDefinition,
        apis: ["./src/routes/**/*.js"],
    }
    const swaggerSpec=swaggerJsdoc(options)
    
module.exports=swaggerSpec

