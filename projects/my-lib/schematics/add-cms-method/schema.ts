export interface Schema {
    // The name of the service.
    name: string;

    // The name of the function to be added.
    functionName: string;

    // The type of content to fetch.
    contentType: string;
  
    // The path to create the service.
    path?: string;
  
    // The name of the project.
    project?: string;
  }