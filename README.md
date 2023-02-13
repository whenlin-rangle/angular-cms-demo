# How to get started

- Clone the repo
- Enter the root directory
- Enter `npm install` to install project dependencies
- Enter `ng build my-lib` to build the angular package
- Enter `cd projects/my-lib; npm run build` to build the schematics 
- Enter `cd dist/my-lib; npm link`. Head back to the root directory of the project, enter `npm link my-lib` in order to link the schematics to the node_modules folder
- Run ng generate command with the required flags
	Example: `ng generate my-lib:my-service --name my-new-service`