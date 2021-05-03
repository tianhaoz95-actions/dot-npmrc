import * as core from '@actions/core';
import path from 'path';
import fs from 'fs';

const defaultRegistry: string = 'npm.pkg.github.com';

const clearFile = (filename: string): void => {
    fs.writeFileSync(filename, '', { flag: 'w+' });
}

const addLine = (filename: string, content: string): void => {
    fs.appendFileSync(filename, content);
}

const main = (): void => {
    const root = core.getInput('root');
    const org = core.getInput('org');
    const registryInput = core.getInput('registry');
    const registry = registryInput === '' ? defaultRegistry : registryInput;
    const token = core.getInput('token');
    // TODO(tianhaoz95): change this to getBooleanInput once
    // it becomes available.
    const overwrite = core.getInput('overwrite') === 'true';
    const filename = '.npmrc';
    const fullPath = path.join(root, filename);
    const includeRegistry: boolean = (org !== '');
    const includeAuth: boolean = (token !== '');
    if (overwrite) {
        core.info('Will overwrite .npmrc instead of appending.');
        clearFile(fullPath);
    }
    if (includeRegistry) {
        core.info('Both org and registry are found. Will add the registry line.');
        const registryLine: string = `@${org}:registry=https://${registry}\n`;
        addLine(fullPath, registryLine);
    }
    if (includeAuth) {
        core.info('Both registry and token are found. Will add auth line.');
        const authLine: string = `//${registry}/:_authToken=${token}\n`;
        addLine(fullPath, authLine);
    }
    core.info('Done!');
}

main();