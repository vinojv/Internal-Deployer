# Routes

## Authentication

1.  **POST  /api/v1/auth/login**  
    REQ:  
    ```js
    {
        username: String,
        password: String
    }
    ```
    RES:
    ```js
    {
        username: String
    }
    ```
    
2.  **GET   /api/v1/auth/login**  
    RES:  
    `200 OK`
    
3.  **POST  /api/v1/signup**  
    REQ:  
    ```js
    {
        username: String,
        password: String
    }
    ```
    RES:  
    ```js
    {
        username: String,
        password: String
    }
    ```
