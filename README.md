# Electron Semantic Boilerplate

Start point for ElectronJS projects with ReactJS and SemanticUI.

## Usage

Clone the repo and install dependencies:

```bash
git clone https://github.com/unnamed-community/electron-semantic-boilerplate.git
cd electron-semantic-boilerplate
npm install
```

## Running the project

To run the project run in a terminal:

```bash
npm start
```

To run in **developing mode** run:

```bash
npm run dev
```

## Coding

In the `config/app.js` file is the basic configuration for the main window. You must edit it to your liking.

Now, you can start coding in source code located in `src` folder.

You can check the `main.js` file and see the ipcMain listeners implemented by default. You just need to call them on render process with ipcRenderer.

## Locales

In the `locales` folder you will find all locales strings for multilanguage support. The files names must be one of the [electron locales](https://electronjs.org/docs/api/locales).

Additionally, the locales files must follow [i18n format](https://github.com/mashpie/i18n-node#storage).

## Generating dist files

To generate dist files from the project run:

**On Windows**

```powershell
npm run dist-windows
```

**On Linux**

```bash
npm run dist-linux
```

The `dist` folder will be generated. The `.deb` or `.msi` file will be inside it.

> For further dist config, edit the `build` config in `package.json` acording [electron-builder documentation](https://www.electron.build/configuration/configuration).
