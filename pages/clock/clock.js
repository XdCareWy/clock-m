const {
  token,
  baseUrl
} = require('../../utils/constants')
Page({
  data: {
    classId: 0,
    projectId: 0,
    teacherId: 0,
    visible: false,
    projectData: [{
      id: 1,
      label: "项目1"
    }, {
      id: 2,
      label: "项目2"
    }, {
      id: 3,
      label: "项目3"
    }, {
      id: 4,
      label: "项目4"
    }, {
      id: 5,
      label: "项目5"
    }],
    classData: [],
    teacherData: [],
  },
  onLoad: function (options) {
    this.getClasses()
    this.getTeacher()
    this.getUserAppraise()
  },
  bindTeacherChange: function (e) {
    this.setData({
      teacherId: e.detail.value
    })
  },
  bindProjectChange: function (e) {
    this.setData({
      projectId: e.detail.value
    })
  },
  bindClassChange: function (e) {
    this.setData({
      classId: e.detail.value
    })
    this.getTeacher(e.detail.value)

  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // todo: 请求接口
    wx.navigateTo({
      url: '../shareImage/shareImage',
    })
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  modalCancel: function (e) {
    this.setData({
      visible: false
    })
  },
  modalOk: function (e) {
    this.setData({
      visible: false
    });
    const userInfo = e.detail.us;
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
            console.log(data)
            this.setData({
              teacherData: data
            })
          }
        }
      }
    })
  },
  // 获取座右铭
  getUserAppraise: function() {
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
            console.log(data)
            
          }
        }
      }
    })
  }
})