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
import organizationManagement from './organizationManagement/index';
import researchTask from './researchTask/index';
//病种概览
import diseaseChart from './diseaseChart';
//CRF 2.0
import CRFConfig from './CRFConfig';
const http = Object.assign({}, SDResearch, crfManage, dataDictionaryManage, systemManage, index, staticInfo, auth,CRFManageHttp, patientFollowUp,view360, researchReportManage, eventPlan, researchModel,fullTextSearch,treatmentAnalysis,diseaseChart,CRFConfig,organizationManagement,researchTask);
export default http;
