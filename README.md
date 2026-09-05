# Noetic

**Idea. Intelligence. App.**

Angular app builder project. Built with Angular 22, [spartan/ui](https://www.spartan.ng/) (Brain + Helm), and Tailwind CSS.

## Stack

- Angular 22 (standalone components, signals, zoneless-default change detection)
- [spartan/ui](https://www.spartan.ng/) — headless (Brain) + styled (Helm) component layers
- Tailwind CSS 4
- Vitest for unit tests

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

To add a spartan/ui component, use the spartan CLI:

```bash
ng generate @spartan-ng/cli:ui <component-name>
```

## Building

To build the project run:

```bash
npm run build
```

This compiles the project and stores the build artifacts in the `dist/` directory. The production build optimizes the application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
npm test
```

## Additional resources

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [spartan/ui Documentation](https://www.spartan.ng/)
