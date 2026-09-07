import { routes } from './app.routes';

describe('routes', () => {
  it('lazily loads the main layout at the root path', async () => {
    const rootRoute = routes.find(route => route.path === '');

    expect(rootRoute).toBeDefined();
    expect(rootRoute?.loadComponent).toBeDefined();

    const loaded = await rootRoute!.loadComponent!();
    const MainLayout = 'default' in loaded ? loaded.default : loaded;

    expect(MainLayout).toBeDefined();
  });
});
