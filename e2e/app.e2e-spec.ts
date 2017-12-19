import { TestDemoPage } from './app.po';

describe('test-demo App', () => {
  let page: TestDemoPage;

  beforeEach(() => {
    page = new TestDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
