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
import researchObject from './research/researchObject/index';
import researchTask from './researchTask/index';
import projectGrouping from './research/projectGrouping/index';
import followUpPlan from './research/followUpPlan/index';
import followUpManagement from './research/followUpManagement/index';
import sucjectAuth from './research/auth/index';
import organizationManagementDis from './organizationManagementDis/index';
import myTasks from './research/myTasks/index';
import statisticalAnalysis from './research/statisticalAnalysis/index';
import qualityManage from './qualityManage/index';
import systemSetup from './systemSetup/index';
//科研项目 -- 研究指标
import researchTarget from './research/researchTaget/index';
//科研项目 -- 项目进度
import projectProgress from './research/projectProgress/index';
//病种概览
import diseaseChart from './diseaseChart';
//评分
import score from './score';
//CRF 2.0
import CRFConfig from './CRFConfig';
// 科研灵感
import researchInspiration from './researchInspiration/index';
const http = Object.assign({}, SDResearch, crfManage, dataDictionaryManage, systemManage, index, staticInfo, auth,CRFManageHttp, patientFollowUp,view360, 
    researchReportManage, eventPlan, researchModel,fullTextSearch,treatmentAnalysis,diseaseChart,CRFConfig,organizationManagement,researchTask,researchObject,
    projectGrouping,followUpPlan,researchTarget,projectProgress,followUpManagement,sucjectAuth,score,organizationManagementDis,myTasks,researchInspiration,
    statisticalAnalysis,qualityManage,systemSetup);
export default http;
