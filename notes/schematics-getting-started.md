# Schematics: Getting Started


## Setup Environment

Add the Nrwl.io `Nx` schematics to your global development environment.

```ts
npm install -g @nrwl/schematics @nrwl/nx
```

Create a new `workspace`:

```ts
create-nx-workspace frontend-fest-schematics
```

Install the `dependencies` to create new schematics.


```ts
npm install -g @angular-devkit/schematics
npm install -g @angular-devkit/schematics-cli
npm install -D @angular-devkit/schematics-cli
```

Install `utility` items for Angular schematics:

```ts
npm install -D @schematics/angular
```

## Add New Schematic

Create a new folder to manage schematic projects.

```ts
mkdir schematics
```

```ts
schematics
```

```ts
schematics --list-schematics
```

Change to the new `schematics` directory - create a new blank schematic project using the schematics template called `blank`

```ts
schematics blank --name=blank
```

### Name the Schematic Project

The name of the project should be different than the name of the specified schematic. The `blank` schematic templates creates a project and a default schematic of the same name. 

Update the name of the schematic project. 

* add a scope name: `@acme`
* update the name of the project: `frontend-schematics`

```ts
"name": "@acme/frontend-schematics",
```

## Build Configuration for the Schematic

Notice in the `package.json` file that there is a ` "build": "tsc -p tsconfig.json",` build script. This will use the Typescript compiler and add the output to the same directory as the project.

> Keep the source code separate from the build output

Update the `compilerOptions` in the schematic project's `tsconfig.json` to include the `outDir` location.

```ts
"outDir": "./../../dist/schematics/@acme/frontend-schematics",

```

### Initial Build Script

Update the workspace `package.json` to include a basic build command. 

```ts
"build:schematics": "npm run build-schematic:blank",
"build-schematic:blank": "tsc -p ./schematics/@acme/frontend-schematics/tsconfig.json",
```

Run the build command.

> Note: This will only output the files created by the `tsc` compiler. However, the schematic has other required files necessary for using the schematic.

```ts
npm run build:schematics
```

### Required Items for Schematic
There are actually a set of required files that a schematic project will need - not just the output of the transpile of the (Typescript, *.ts) files. We'll need:

* schema.* files
    * used to define the available `options` for the schematic (i.e., the inputs).
* templates (./files/*)
    * if any templates are defined, they will need to be available as part of the schematic project as an asset.
* package.json
    * all published packages require a `package.json` file with a unique name, version and other information. 
* README.md: include documentation for the specified schematic
    * include details on how to use and test


Add the following package to the workspace. Use to `copy` the required schematic output to the `dist` folder.

```ts
npm install -D sync-glob
```

### Revised Build Scripts

Update the build script(s) for the schematic project.

```ts
"build:schematics": "npm run build-schematic:blank",
"build-schematic:blank": "tsc -p ./schematics/blank/tsconfig.json && npm run copy-schematic:blank-templates && npm run copy-schematic:blank-types && npm run copy-schematic:blank-package && npm run copy-schematic:blank-collection  && npm run copy-schematic:blank-readme && npm run link-schematic:blank",
"copy-schematic:blank-templates": "sync-glob -d false 'schematics/blank/src/**/*/files/*' dist/schematics/@acme/frontend-schematics/",
"copy-schematic:blank-types": "sync-glob -d false 'schematics/blank/src/**/*/schema.*' dist/schematics/@acme/frontend-schematics/",
"copy-schematic:blank-package": "sync-glob -d false 'schematics/blank/package.json' dist/schematics/@acme/frontend-schematics",
"copy-schematic:blank-collection": "sync-glob -d false 'schematics/blank/src/collection.json' dist/schematics/@acme/frontend-schematics",
"copy-schematic:blank-readme": "sync-glob -d false 'schematics/blank/README.md' dist/schematics/@acme/frontend-schematics",
"link-schematic:blank": "npm link ./dist/schematics/@acme/frontend-schematics",
```

Run and review the output of the build.

```ts
npm run build:schematics
```

### Update Path to the collection.json

Update the `package.json` in the schematic project - remove the `src` folder from the path to the `collection.json` file. 

> The compiled output of the schematic does not include the `src` folder. The `package.json` of a schematic project must **always**
> include a `schematics` property that points to the schematic's `collection.json` file. 

```ts
"schematics": "./collection.json",
```
### Update Path to the Schematic Factory Method

Update the `collection.json` in the schematic project - the path to the `factory method` in the `dist` folder output is in the same folder.

> The `collection.json` has a `factory` property that points to the **entry point** of the specified schematic.

```ts
"factory": "./index#blank"
```

### Update Path to the collection-schema.json

Update the `collection.json` in the schematic project - fix the path to the `collection-schema.json` file relative to the location when the project is installed as a package (or linked using the `link` command later).

```ts
"$schema": "../../../node_modules/@angular-devkit/schematics/collection-schema.json",
```

### Update Schematic to Include Scope Name

A published project can use a `scope` name to group items related to a specific entity.

> Note: the name of the schematic was also updated. The CLI uses the name of the schematic for the project name. 
> This is unfortunate - because the project name should be different than the name of a schematic in the collection.

```ts
"name": "@frontendfest/schematics",
```

## Build Schematic

Use the terminal and run the following command to build the schematics project. The output will be in the `dist` folder as defined in the `outDir` setting in the `tsconfig.json` file. 

```ts
npm run build:schematics
```
## Link the Schematic

Typically, you would publish your schematic to a package repository so it can be used like other schematics - using a `npm install -g <YOUR-SCHEMATIC-NAME-HERE>`. 

However, in our local workspace development environment, use the `npm link` command to load the build output into the `node_modules`.

```ts
npm link ./dist/schematics/blank
```

## Using the Schematic

Now that the schematic is linked to the workspace (via `npm link <PATH_TO_THE_SCHEMATIC_BUILD_OUTPUT>`), you can use the schematic and target one of the schematics in the collection.

```ts
ng generate @acme/frontend-schematics:blank --name=test --dry-run
Nothing to be done.

NOTE: The "dryRun" flag means no changes were made.
```

### Create a Target for the Schematic

```ts
 ng generate application --name=webOne
? What framework would you like to use for the application? Angular         [ https://angular.io   ]
? In which directory should the application be generated?
? Which stylesheet format would you like to use? CSS
? Which Unit Test Runner would you like to use for the application? Karma [ https://karma-runner.github.io ]
? Which E2E Test Runner would you like to use for the application? Protractor [ https://www.protractortest.org ]
? Which tags would you like to add to the application? (used for linting)
CREATE apps/web-one/tsconfig.json (118 bytes)
CREATE apps/web-one-e2e/tsconfig.json (132 bytes)
CREATE apps/web-one-e2e/protractor.conf.js (757 bytes)
CREATE apps/web-one-e2e/tsconfig.e2e.json (210 bytes)
CREATE apps/web-one-e2e/src/app.e2e-spec.ts (672 bytes)
CREATE apps/web-one-e2e/src/app.po.ts (260 bytes)
CREATE apps/web-one/browserslist (388 bytes)
CREATE apps/web-one/tsconfig.app.json (200 bytes)
CREATE apps/web-one/tslint.json (205 bytes)
CREATE apps/web-one/src/favicon.ico (5430 bytes)
CREATE apps/web-one/src/index.html (339 bytes)
CREATE apps/web-one/src/main.ts (375 bytes)
CREATE apps/web-one/src/polyfills.ts (2839 bytes)
CREATE apps/web-one/src/styles.css (80 bytes)
CREATE apps/web-one/src/assets/.gitkeep (0 bytes)
CREATE apps/web-one/src/environments/environment.prod.ts (51 bytes)
CREATE apps/web-one/src/environments/environment.ts (662 bytes)
CREATE apps/web-one/src/app/app.module.ts (297 bytes)
CREATE apps/web-one/src/app/app.component.html (614 bytes)
CREATE apps/web-one/src/app/app.component.spec.ts (976 bytes)
CREATE apps/web-one/src/app/app.component.ts (220 bytes)
CREATE apps/web-one/src/app/app.component.css (0 bytes)
CREATE karma.conf.js (1012 bytes)
CREATE apps/web-one/tsconfig.spec.json (238 bytes)
CREATE apps/web-one/karma.conf.js (485 bytes)
CREATE apps/web-one/src/test.ts (642 bytes)
UPDATE angular.json (4032 bytes)
UPDATE package.json (3605 bytes)
UPDATE nx.json (291 bytes)
UPDATE tslint.json (2184 bytes)
```

## Debug Mode: Debugger Configuration

### Allow the Workspace to Attach to the Schematic

Enable the Workspace to attach to the specified schematic. Add the following to the root-level `package.json` of the Workspace.

```
"schematics": "./schematics/blank/src/collection.json",
```

Disconnect the output directory from the build process. Comment out the item in the schematic project's `tsconfig.json` file.

```ts
// "outDir": "./../../dist/schematics/@acme/frontend-schematics",
```

### Create a Launch Configuration for the Node App

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "With Debugging",
            "program": "${workspaceFolder}/node_modules/@angular-devkit/schematics-cli/bin/schematics.js",
            "args": [
                ".:blank",
                "--name=frontend-fest",
                "--project=web-one",
                "--dry-run=true"
            ],
            "outFiles": []
        }
    ]
}
```