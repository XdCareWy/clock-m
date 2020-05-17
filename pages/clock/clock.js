const {
  token,
  baseUrl
} = require('../../utils/constants')
Page({
  data: {
    classId: 0,
    projectId: 0,
    teacherId: 0,
    appraiseId: 0,
    visible: false,
    schoolName: '@大树学校',
    currentComment: '',
    projectData: [], // 项目
    classData: [], // 课程
    teacherData: [], // 老师
    appraise: [], // 评论模版
  },
  onLoad: function (options) {
    this.getClasses()
    this.getTeacher()
    this.getUserAppraise()
    this.getCourseType()
  },
  bindTeacherChange: function (e) {
    this.setData({
      teacherId: e.detail.value,
    })
  },
  bindProjectChange: function (e) {
    this.setData({
      projectId: e.detail.value
    })
  },
  bindAppraiseChange: function (e) {
    const res = this.data.appraise.find(item => item.code == e.detail.value) || {}
    this.setData({
      currentComment: res.userAppraise,
      appraiseId: e.detail.value
    })
  },
  bindClassChange: function (e) {
    this.setData({
      classId: e.detail.value
    })
    this.getTeacher(e.detail.value)

  },
  formSubmit: function (e) {
    const {
      classes,
      name,
      project,
      teacher,
      comment
    } = e.detail.value
    const className = this.data.classData[classes].name || ""
    const projectName = this.data.projectData[project].name || ""
    const teacherName = this.data.teacherData[teacher].name || ""
    const teacherSlogan = this.data.teacherData[teacher].motto || ""
    const teacherIntro = this.data.teacherData[teacher].teacherIntro || "3年教龄，资深物理教师"
    const {schoolName} = this.data
    if (className && projectName && name && teacherName && comment &&teacherSlogan) {
      wx.navigateTo({
        url: `../shareImage/shareImage?teacherIntro=${teacherIntro}&schoolName=${schoolName}&teacherSlogan=${teacherSlogan}&className=${className}&studentName=${name}&projectName=${projectName}&teacherName=${teacherName}&studentSlogan=${comment}`,
      })
    } else {
      wx.showToast({
        title: '请完善所填写的信息！',
        icon: 'none'
      })
    }
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  //  获取课程信息
  getClasses: function () {
    wx.request({
      url: `${baseUrl}/getCourse.do`,
      method: 'GET',
      data: {
        token: token
      },
      success: req => {
        const {
          statusCode,
          data: reqData
        } = req;
        if (statusCode === 200) {
          const {
            result,
            data
          } = reqData
          if (+result === 0) {
            this.setData({
              classData: data
            })
          }
        }
      }
    })
  },
  // 获取老师信息
  getTeacher: function (course = '0') {
    const params = {
      token: token,
      duty: 2,
    };
    course: course
    course && (params.course = course)
    wx.request({
      url: `${baseUrl}/getTeacher.do`,
      method: 'GET',
      data: params,
      success: req => {
        const {
          statusCode,
          data: reqData
        } = req;
        if (statusCode === 200) {
          const {
            result,
            data
          } = reqData
          if (+result === 0) {
            const res = this.data.appraise.find(item => item.code == 0) || {}
            this.setData({
              teacherData: [{
                "name": "刘酉成",
                "motto": "永远用欣赏的眼光看学生,永远用宽容的心态面对学生。",
                "code": "bs2019010136"
              }, {
                "name": "周少峰",
                "motto": "永远用欣赏的眼光看学生,永远用宽容的心态面对学生。",
                "code": "bs2020050142"
              }, {
                "name": "姚达",
                "motto": "",
                "code": "bs2019010141"
              }, {
                "name": "张春林",
                "motto": "",
                "code": "bs2019010137"
              }, {
                "name": "教师测试1",
                "motto": "教师",
                "code": "bs2018120004"
              }, {
                "name": "文静",
                "motto": "",
                "code": "bs2019010138"
              }, {
                "name": "王瑶",
                "motto": "",
                "code": "bs2019010134"
              }, {
                "name": "肖雄",
                "motto": "",
                "code": "bs2019010135"
              }],
              currentComment: res.userAppraise
            })
          }
        }
      }
    })
  },
  // 获取座右铭
  getUserAppraise: function () {
    wx.request({
      url: `${baseUrl}/getUserAppraise.do`,
      method: 'GET',
      data: {
        token: token
      },
      success: req => {
        const {
          statusCode,
          data: reqData
        } = req;
        if (statusCode === 200) {
          const {
            result,
            data
          } = reqData
          if (+result === 0) {
            this.setData({
              appraise: data
            })
          }
        }
      }
    })
  },
  // 获取项目
  getCourseType: function () {
    wx.request({
      url: `${baseUrl}/getCourseType.do`,
      method: 'GET',
      data: {
        token: token
      },
      success: req => {
        const {
          statusCode,
          data: reqData
        } = req;
        if (statusCode === 200) {
          const {
            result,
            data
          } = reqData
          if (+result === 0) {
            console.log(data)
            this.setData({
              projectData: data
            })
          }
        }
      }
    })
  }
})