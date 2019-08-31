import SDResearch from './SDResearch';
import crfManage from './crfManage';
import dataDictionaryManage from './dataDictionaryManage';
import systemManage from './systemManage';
import index from './index/index';
import staticInfo from './staticInfo';
import auth from './auth';
import CRFManageHttp from './CRFManageHttp/index';
import patientFollowUp from './patientFollowUp/index';
import researchReportManage from './researchReportManage/index';
import view360 from './view360/index';
import eventPlan from './eventPlan/index';
import researchModel from './researchModel/index';
import fullTextSearch from  './fullTextSearch/index';
import treatmentAnalysis from './treatmentAnalysis/index';
//病种概览
import diseaseChart from './diseaseChart';

const http = Object.assign({}, SDResearch, crfManage, dataDictionaryManage, systemManage, index, staticInfo, auth,CRFManageHttp, patientFollowUp,view360, researchReportManage, eventPlan, researchModel,fullTextSearch,treatmentAnalysis,diseaseChart);

export default http;
