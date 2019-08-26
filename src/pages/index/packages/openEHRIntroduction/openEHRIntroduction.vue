<template>
  <div class="cloud-component openEHRIntroduction">
    <h3>一、openEHR两层模型</h3>
    <div class="section">
      <p>
        医疗信息互操作是实现医疗信息共享和利用的重要基础。HL7 RIM、openEHR和CEM等分层医疗信息模型是目前解决此问题的主要方向。其中，openEHR模型基于临床诊疗OEIA循环（Oberservation、Evaluation、Instruction、Act）来抽象医疗信息的基本结构，在信息抽象水平和复杂程度之间取得了更好的平衡。</p>
      <p>
        首先是医学领域中的概念数目十分庞大，定义非常复杂并且变化相对频繁，难以建立一个包含全部概念的完整模型。因此在系统开发前期需要做大量的需求分析，让软件人员能够充分了解医学专家的知识，但这一过程非常耗时，并且难以保证软件人员理解掌握领域知识的正确性。</p>
      <p>
        其次是由于电子病历持续时间很长，随着科技水平的发展，可能会出现新的疾病和新的治疗手段，而现有知识也会发生持续变化，但在系统开发时，医学专家对这些知识也是一无所知，而系统又必须提供存储这些未知的信息的功能并且适应知识的变化。</p>
      <p>
        为了解决这个问题，openEHR提出两层模型的概念，即将openEHR架构分为参考模型和原型两部分。参考模型定义基本数据类型和数据结构，以及电子病历基本框架；而原型部分则是在参考模型基础之上，表达具体的医学领域概念。</p>
      <img src="./images/1.png" alt="">
      <img src="./images/2.png" alt="">
    </div>
    <h3>二、openEHR基本内容</h3>
    <div class="section">
      <p>
        openEHR的参考模型中定义了一个电子病历信息的框架，每个人都有一份电子病历，电子病历是一个树状结构。Composition用于表达不同类型医疗信息的组合，包括医院就诊记录、体检记录、公共卫生管理记录、日常健康监测记录等。Composition中包含了具体的医疗概念，比如血压、医嘱等。每个医疗概念是由基本的数据结构和数据类型来表达。其中最核心的部分，是openEHR对于医疗概念的分类。</p>
      <img src="./images/3.png" alt="">
    </div>
    <h3>三、血压原型</h3>
    <div class="section">
      <img src="./images/4.png" alt="">
    </div>
    <h3>四、现有的原型</h3>
    <div class="section">
      <p>
        目前共有500多个原型，包含6000多个数据项。包括23种语言，大部分是英文，其中也有部分中文。CKM是一个原型在线协作建模的平台，可以进行原型的发布共享和版本管理。所有的参与人员都可以在上面进行原型的制定、发布、审阅、修改和完善。只要原型设计合理，经过一定的实际检验和管理流程，就能够被认可通过并广泛应用。</p>
      <img src="./images/5.png" alt="">
    </div>
    <h3>五、OpenEHR系统平台</h3>
    <div class="section">
      <p>1、依托十二五国家863重大项目“数字化医疗工程技术开发”，开展了基于openEHR的医疗信息平台研究，主要包括信息建模和平台建设两部分。</p>
      <p>
        信息建模的主要目标是将分散在医院中各个医疗信息系统中的数据通过openEHR表达为一个标准的统一的信息模型。首先是对两个国内主流的医院信息系统进行分析，包括中国人民解放军总医院，抽取了其中的临床数据项，作为建立原型的实际需求来源。</p>

      <table style="width:90%;" class="common-table">
        <thead>
        <tr>
          <th>数据模式-1 </th>
          <th>数据模式-2</th>
          <th>CDR数据存储需求</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>PAT_MASTER_INDEX</td>
          <td>MASTER_PATIENT_INDEX</td>
          <td>Patient demographics</td>
        </tr>
        <tr>
          <td>MEDREC.DIAGNOSIS</td>
          <td>DIAGNOSIS</td>
          <td>Diagnosis information</td>
        </tr>
        <tr>
          <td>MEDREC.PAT_VISIT<br />
            OUTPADM.CLINIC_MASTER<br />
            INPADM.PATS_IN_HOSPITAL
          </td>
          <td>PATIENT_VISIT<br />
            VISIT_IN_HOSPITAL<br />
            VISIT_OUT_PATIENT
          </td>
          <td>Admission<br />
            Discharge<br />
            Transfer
          </td>
        </tr>
        <tr>
          <td>ORDADM.ORDERS<br />
            OUTPDOCT.OUTP_ORDERS
          </td>
          <td>ORDERS<br />
            ORDERS_PERFORM
          </td>
          <td>Order information</td>
        </tr>
        <tr>
          <td>ORDADM.VITAL_SIGNS_REC</td>
          <td>VITAL_SIGNS_RECORD</td>
          <td>Vital signs information</td>
        </tr>
        <tr>
          <td>EXAM.EXAM_MASTER<br />
            EXAM.EXAM_ITEMS<br />
            EXAM.EXAM_DATA<br />
            EXAM.EXAM_REPORT
          </td>
          <td>EXAM_REQUEST<br />
            EXAM_ITEM<br />
            EXAM_REPORT<br />
            EXAM_DATA
          </td>
          <td>Examination information</td>
        </tr>
        <tr>
          <td>LAB.LAB_TEST_MASTER<br />
            LAB.LAB_TEST_ITEMS<br />
            LAB.LAB_RESULT
          </td>
          <td>LAB_TEST_REQUEST<br />
            LAB_TEST_DATA<br />
            LAB_TEST_MASTER
          </td>
          <td>Lab test information</td>
        </tr>
        <tr>
          <td>OPERATION_SCHEDULE<br />
            OPERATION_MASTER
          </td>
          <td>OPERATION_REQUEST<br />
            OPERATION_REPORT
          </td>
          <td>Operation information</td>
        </tr>
        <tr>
          <td>BLDBANK.BLOOD_APPLY<br />
            BLDBANK.BLOOD_CAPACITY
          </td>
          <td></td>
          <td>Transfusion </td>
        </tr>
        <tr>
          <td>NURSERECORD_SUMMARY</td>
          <td></td>
          <td>Nursing information  </td>
        </tr>
        <tr>
          <td></td>
          <td>CONSULT_MASTER</td>
          <td>Consult information</td>
        </tr>
        <tr>
          <td></td>
          <td>NEWBORM_REPORT</td>
          <td>Newborn information</td>
        </tr>
        <tr>
          <td>EMR.EMR_DOCUMENT</td>
          <td>EMR_DOCUMENT<br />
            EMR_DOCUMENT_DETAIL
          </td>
          <td>EMR document information</td>
        </tr>
        </tbody>
      </table>

      <p>
        然后对不同HIS系统中具有相同语义的数据项进行合并，得到554个数据项。然后对照卫计委发布的现有医疗信息标准进行合并和补充，新增了部分数据项后得到733个数据项。对这些数据项与医疗人员和建模人员一起进行抽象和归纳，形成62个独立的医疗概念，如就诊、诊断、医嘱、检查、检验等。利用这些概念到CKM中进行匹配和映射，并且对CKM中没有覆盖到的概念设计相应的原型。最后共得到71个原型。覆盖完整的临床诊疗过程。其中15个是新建的原型，重用了56个CKM中的现有原型。这样说明了CKM中的原型具有较高的重用性，能够较好地表达实际需求，从而支持医疗信息的互操作。</p>
      <p>
        2、基于openEHR探索构建了CLEVER平台，Completed完整，Legible可读，Evolutional发展，Veracious真实，Easy-to-operate易用，Reliable安全。主要包括四个部分。</p>
      <img src="./images/6.png" alt="">
      <p>数据存储和访问系统，通过原型关系映射方法，将openEHR原型映射为关系数据表，实现数据存储，并且能够根据原型的改变自动调整数据表，对外提供基于原型的数据访问，通过原型数据访问语言来访问数据。</p>
      <p>原型管理系统的主要目标是对原型进行统一的管理，保证原型的统一，从而保证基于原型的语义互操作的一致性。采用多级原型库的模式，实时同步保持数据平台与原型的一致性。</p>
      <p>
        原型协作编辑网站为原型的制定和维护提供了一个公共的平台，所有技术人员、医疗人员、使用人员都可以通过这个网站参与到原型的制定和维护中，根据自己的需求对原型进行扩展，覆盖更广泛的互操作需求，并且通过不断的审核，保持原型的统一。</p>
      <p>数据录入应用编辑系统利用原型和可视化界面编辑器，使得数据录入应用的开发非常简单，让医疗人员也能够根据自己的数据访问需求开发相应的应用。</p>
    </div>
  </div>
</template>

<script type="text/javascript">
import mixins from 'components/mixins';

export default {
  name: 'openEHRIntroduction',
  mixins: [mixins],
  data () {
    return {};
  },
  components: {},
  watch: {},
  computed: {},
  created () {

  },
  mounted () {

  },
  methods: {},
  beforeRouteEnter (to, from, next) {
    next();
  },
  beforeRouteLeave (to, from, next) {
    next();
  }
};
</script>

<style scoped>
  .openEHRIntroduction{
    font-size: 13px;
  }
  .openEHRIntroduction h3 {
    height: 35px;
    line-height: 35px;
    background: #f3f3f3;
    padding-left: 20px;
  }

  .openEHRIntroduction .section {
    padding: 50px 8px;
  }

  .openEHRIntroduction .section p {
    margin-bottom: 15px;
    text-indent: 2em;
  }

  .openEHRIntroduction .section p:last-child {
    margin-bottom: 0;
  }

  .openEHRIntroduction .section img {
    display: block;
    margin: auto;
    margin-bottom: 50px;
  }

  .openEHRIntroduction .section img:last-child {
    margin-bottom: 0;
  }

  .openEHRIntroduction table {
    margin: 30px auto;
  }

  .openEHRIntroduction table th{
    background: #f9f9f9;
  }

  .openEHRIntroduction table th, .openEHRIntroduction table td {
    border: 1px solid #e9eaec;
    padding: 8px 15px;
    text-align: left;
  }
  .openEHRIntroduction table td{
    font-size: 13px;
  }
</style>
