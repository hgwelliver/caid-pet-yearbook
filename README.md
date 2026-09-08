# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Azure Table Storage

Comments are stored in Azure Table Storage so they are shared across devices.

When running locally without Azure settings, comments use temporary in-memory storage and reset when the API process restarts.

Configure the App Service with:

- `AZURE_STORAGE_ACCOUNT_NAME`: the storage account name
- `AZURE_TABLE_NAME`: optional table name; defaults to `PetYearbookComments`

Enable a system-assigned managed identity on the App Service and grant it the `Storage Table Data Contributor` role on the storage account. Set the App Service startup command to `npm start` after deploying the project.
