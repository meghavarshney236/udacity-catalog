import { Page } from 'playwright';

export class SearchPage {
  private page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }

  async searchFor(term: string) {
    await this.page.fill('input[aria-label="search"]', term);
    await this.page.press('input[aria-label="search"]', 'Enter');
  }

  async clickOnSkillDropdown() {
    await this.page.click('[data-testid="skill-dropdown"]');
  }

  async getSearchResults() {
    return await this.page.$$eval('.result-item', results => results.map(result => result.innerText));
  }
}
