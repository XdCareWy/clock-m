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
    classData: [{
      id: 1,
      label: "课程1"
    }, {
      id: 2,
      label: "课程2"
    }, {
      id: 3,
      label: "课程3"
    }, {
      id: 4,
      label: "课程4"
    }, {
      id: 5,
      label: "课程5"
    }],
    teacherData: [{
      id: 1,
      label: "老师1"
    }, {
      id: 2,
      label: "老师2"
    }, {
      id: 3,
      label: "老师3"
    }, {
      id: 4,
      label: "老师4"
    }, {
      id: 5,
      label: "老师5"
    }],
  },
  onLoad: function (options) {

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
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // todo: 请求接口
    wx.navigateTo({
      url: '../shareImage/shareImage',
    })
  },
  formReset: function() {
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
})