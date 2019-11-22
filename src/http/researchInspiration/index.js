//科研灵感

const vm = new Vue();

const url = {
  //根据条件查询
  literatureKeywordSearchList:"/subject/document/keyword",
  //高级查询
  literatureHighSearchList:"/subject/document/conditions",
  //关键字 接口
  subjectDocumentList:"/subject/document/list",
  //下载PDF
  subjectDownLoadPDF:"/subject/document/download",
  // 获取关键字相似文献
  subjectKeywordSimilar:"/subject/document/keyword/similar"
};

const http = {
  literatureKeywordSearchList(params) {
    return vm.$post(url.literatureKeywordSearchList,params,false);
  },
  literatureHighSearchList(params) {
    return vm.$post(url.literatureHighSearchList,params,false);
  },
  subjectDocumentList(params) {
    return vm.$post(url.subjectDocumentList,params,true);
  },
  subjectDownLoadPDF(params) {
    return vm.$getDown(url.subjectDownLoadPDF,params,false);
  },
  subjectKeywordSimilar(params) {
    return vm.$post(url.subjectKeywordSimilar,params,false);
  }
};

export default http;
