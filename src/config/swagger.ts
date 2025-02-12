import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {

    definition: {
        openapi: '3.0.0', // Version de l'OpenAPI Specification
        
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation de l’API Express.js avec Swagger',
        },

        servers: [
            {
                url: process.env.API_URL, // URL de votre API
            },
        ],
    },

    apis: ['./dist/routes/*.{js,ts}', './src/routes/*.{ts,js}']
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;