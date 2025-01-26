import { Given, When, Then, Before } from '@cucumber/cucumber';
import { Page, BrowserContext, Browser } from 'playwright';
import { expect } from 'chai';
import { SearchPage } from '../pages/SearchPage';
import fetch from 'node-fetch';

let page: Page;
let browser: Browser;
let context: BrowserContext;
let searchPage: SearchPage;

Before(async () => {
  browser = await require('playwright').chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  searchPage = new SearchPage(page);
});

Given('the application is loaded successfully', async function() {
  await page.goto('https://www.udacity.com/catalog');
});

When('user search for {string}', async function(term: string) {
  this.searchTerm = term;
  await searchPage.searchFor(term);
});

When('user clicks on "Skill" Dropdown', async function() {
  await searchPage.clickOnSkillDropdown();
});

When('user search for {string} in Skill Dropdown', async function(term: string) {
  this.searchTerm = term;
  await searchPage.searchFor(term);
});

Then('user sees results matching the search term in the UI', async function() {
  this.uiResults = await searchPage.getSearchResults();
  expect(this.uiResults).to.include(this.searchTerm);
});

Then('user fetch search results from the API', async function() {
  const response = await fetch(`https://api.udacity.com/search?query=${this.searchTerm}`);
  const data = await response.json();
  this.apiResults = data.results;
});

Then('the UI results should match the API results', function() {
  expect(this.uiResults.length).to.equal(this.apiResults.length);
  this.uiResults.forEach((uiResult, index) => {
    expect(uiResult).to.include(this.apiResults[index].title);
  });
});

Then('user should see a "No results found" message', async function() {
  const message = await page.textContent('.no-results-message');
  expect(message).to.equal('No results found');
});
