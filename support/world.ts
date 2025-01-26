import { setWorldConstructor } from '@cucumber/cucumber';

class World {
  public searchTerm: string = '';
  public apiResults: any[] = [];
  public uiResults: string[] = [];

  constructor() {}
}

setWorldConstructor(World);
