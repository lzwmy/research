// 全文检索 fullTextSearch

// 全文检索 fullTextSearch
const fullTextSearch = r => require.ensure([], () => r(require('packages/fullTextSearch/fullTextSearch')), 'fullTextSearch');

const routes = [
  {
    path: '/fullTextSearch',
    name: 'fullTextSearch',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '全文检索',
      flag: 'fullTextSearch',
      belongToGroup: 'fullTextSearch'
    },
    component: fullTextSearch
  }
];

export default routes;
