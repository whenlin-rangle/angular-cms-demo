import {
    Rule,
    SchematicContext, SchematicsException,
    Tree,
} from '@angular-devkit/schematics';
 import { parseName } from '@schematics/angular/utility/parse-name';
import * as ts from 'typescript';
import { getSourceNodes } from '@schematics/angular/utility/ast-utils';
import { findMethodNodes, findServiceClassNode, getLastPosition } from './utils/utils';
import { InsertChange } from '@schematics/angular/utility/change';
import { Schema as OptionsSchema} from './schema'

export function addCmsMethod(_options: OptionsSchema): Rule {
    return (tree: Tree, _context: SchematicContext) => {
        
        const workspaceConfigBuffer = tree.read('angular.json');

        if (!workspaceConfigBuffer) {
            throw new SchematicsException('Not an Angular CLI workspace! The angular.json file is missing');
        }

        const filePath = determineTargetFilePath(workspaceConfigBuffer, _options);

        const nodes: ts.Node[] = getASTFromSourceFilePath(tree, filePath);
        const lastPositionOfMethod = getLastPositionOfMethod(nodes);
        const methodAddChange = createInsertChange(filePath, lastPositionOfMethod!, _options);
        updateTree(tree, filePath, methodAddChange);

        return tree;
    };
}

function  determineTargetFilePath(workspaceConfigBuffer: Buffer, _options: OptionsSchema): string {
    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const projectName = _options.project || workspaceConfig.defaultProject;
    const project = workspaceConfig.projects[projectName];
    const defaultProjectPath = buildDefaultPath(project);

    const parsedPath = parseName(defaultProjectPath, _options.name);

    const {name, path} = parsedPath;

    const filePath = `${path}/${name.toLowerCase()}.service.ts`;
    return filePath;
}

function buildDefaultPath(project: any) {
    const root = project.sourceRoot ? `/${project.sourceRoot}/` : `/${project.root}/src/`;
    const projectDirName = project['projectType'] === 'application' ? 'app' : 'lib';
    return `${root}${projectDirName}`;
}

function getASTFromSourceFilePath(tree: Tree, filePath: string): ts.Node[] {
    const content = tree.read(filePath);
    if (!content) {
        throw new SchematicsException(`File ${filePath} does not exist.`);
    }

    const sourceText = content.toString('utf-8');
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    const nodes = getSourceNodes(sourceFile);
    return nodes;
}

function getLastPositionOfMethod(nodes: ts.Node[]) {
    const serviceClassNode = findServiceClassNode(nodes[0]);
    if (!serviceClassNode) {
        throw new SchematicsException(`Did not find a service class node`);
    }

    const methodNodes = findMethodNodes(serviceClassNode);

    if (methodNodes && methodNodes.length === 0) {
        throw new SchematicsException('Did not find any methods in the service class');
    }

    const lastMethodNode = methodNodes.pop();

    const lastPositionOfMethod = getLastPosition(lastMethodNode!);
    return lastPositionOfMethod;
}

function createInsertChange(filePath: string, lastPositionOfMethod: number, _options: OptionsSchema) {

    const { contentType, functionName } = _options;

    const name = functionName.charAt(0).toUpperCase() + functionName.slice(1).toLowerCase();

    const methodToAdd = `   async get${name}(query?: object): Promise<contentful.Entry<any>[]> {\n` +
        `\t return this.client.getEntries(Object.assign({ \n` +
        `\t content_type: '${contentType}'\n` +
        `\t }, query)) \n` +
        `\t .then(res => res.items); \n` +
        `\t } \n`;

    const methodAddChange = new InsertChange(filePath, lastPositionOfMethod! + 1, methodToAdd);
    return methodAddChange;
}

function updateTree(tree: Tree, filePath: string, methodAddChange: InsertChange) {
    const declarationRecorder = tree.beginUpdate(filePath);
    declarationRecorder.insertLeft(methodAddChange.pos, methodAddChange.toAdd);
    tree.commitUpdate(declarationRecorder);
}