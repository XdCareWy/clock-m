const {
  token,
  baseUrl,
  baseImageUrl
} = require('../../utils/constants')
Page({
  data: {
    classId: 0,
    projectId: 0,
    teacherId: 0,
    appraiseId: 0,
    visible: false,
    restWeek: 0,
    qrCode: '',
    schoolIcon: '',
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
    this.getImageUrl("qrCode", "qrCode")
    this.getImageUrl("schoolIcon", "schoolIcon")
    this.getRestWeek()
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
    const acatarUrl = `${baseImageUrl}${this.data.teacherData[teacher].acatarUrl}` || "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI8AOs9GU2QObPQNfjWjpibhjWibbyqqibwJd9WbtomrVahicsObr6o0BcXm3thvodJ0hESiboDy0F3iciaQ/132"
    const {schoolName,restWeek} = this.data
    const schoolIcon = this.data.schoolIcon || "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI8AOs9GU2QObPQNfjWjpibhjWibbyqqibwJd9WbtomrVahicsObr6o0BcXm3thvodJ0hESiboDy0F3iciaQ/132"
    const qrCode = this.data.qrCode || "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI8AOs9GU2QObPQNfjWjpibhjWibbyqqibwJd9WbtomrVahicsObr6o0BcXm3thvodJ0hESiboDy0F3iciaQ/132"
    if (className && projectName && name && teacherName && comment &&teacherSlogan) {
      wx.navigateTo({
        url: `../shareImage/shareImage?restWeek=${restWeek}&acatarUrl=${acatarUrl}&schoolIcon=${schoolIcon}&qrCode=${qrCode}&teacherIntro=${teacherIntro}&schoolName=${schoolName}&teacherSlogan=${teacherSlogan}&studentName=${name}&teacherName=${teacherName}&studentSlogan=${comment}`,
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
              teacherData: data,
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
  },
  // tupian 
  getImageUrl: function (imageCode, key) {
    wx.request({
      url: `${baseUrl}/getImage.do`,
      method: 'GET',
      data: {
        token: token,
        imageCode: imageCode
      },
      success: req => {
        const {
          statusCode,
          data: reqData
        } = req;
        if (statusCode === 200) {
          const {
            result,
            data = []
          } = reqData
          if (+result === 0) {
            console.log(data[0][key])
            this.setData({
              [key]: data[0] ?`${baseImageUrl}${data[0][key]}` : ''
            })
          }
        }
      }
    })
  },
  // tupian 
  getRestWeek: function () {
    wx.request({
      url: `${baseUrl}/getSurplusWeek.do`,
      method: 'GET',
      data: {
        token: token,
      },
      success: req => {
        const {
          statusCode,
          data: reqData
        } = req;
        if (statusCode === 200) {
          const {
            result,
            data = []
          } = reqData
          if (+result === 0) {
            console.log(data[0])
            this.setData({
              restWeek: data[0] ? data[0].restWeek : 0
            })
          }
        }
      }
    })
  },
})