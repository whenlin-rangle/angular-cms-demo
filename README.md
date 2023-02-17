# How to get started

- Clone the repo
- Enter the root directory
- Enter `npm install` to install project dependencies
- Enter `ng build my-lib` to build the angular package
- Enter `cd projects/my-lib; npm run build` to build the schematics 
- Enter `cd dist/my-lib; npm link`. Head back to the root directory of the project, enter `npm link my-lib` in order to link the schematics to the node_modules folder

# How to create a new CMS service
- Run a ng generate command with the name flag (similar to the example below) to generate a new Contentful service
The name parameter here specifies the name of the file to create (e.g. `cars.service.ts`). 
  
	Example: `ng g my-lib:new-cms-service --name cars`

# How to update an existing CMS service
- Run a ng generate command with the required flags (similar to the example below) to update an existing Contentful service with a new method.
The name parameter here specifies the name of the file to update (e.g. `cars.service.ts`). 
The functionName parameter specifies the name of the function to be inserted into the service file.
The contentType parameter specifies the ID associated with the content type that is trying to be retrieved.

	Example: `ng g my-lib:add-cms-method --name cars --function-name drivers --content-type driver`