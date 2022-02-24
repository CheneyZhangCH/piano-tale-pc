import { get, post } from './http'

/** ------------------------ 课程管理接口 -------------------------**/
export const CourseModel = {
  // 获取课程列表
  getList(data) {
    return post(`manager/course/page`, data)
  },
  // 新增课程
  addCourse(data) {
    return post(`/manager/course/save`, data)
  },
  // 修改课程
  updateCourse(data) {
    return post(`/manager/course/update`, data)
  },
  // 切换课程状态
  updateActive(data) {
    return post(`/manager/course/updateActive`, data)
  },
  // 获取启用状态的课程列表
  listActive(courseType) {
    return get(`/manager/course/listActive?courseType=${courseType}`)
  }
}

/** ------------------------ 课程教材接口 -------------------------**/
export const BookModel = {
  // 获取教材列表
  getList(data) {
    return post(`manager/teachingBook/page`, data)
  },
  // 新增教材
  addBook(data) {
    return post(`/manager/teachingBook/saveBook`, data)
  },
  // 修改教材
  updateBook(data) {
    return post(`/manager/teachingBook/updateBook`, data)
  },
  // 切换教材状态
  updateBookActive(data) {
    return post(`/manager/teachingBook/updateBookActive`, data)
  },
  // 获取教材详情
  getBookDetail(id) {
    return get(`/manager/teachingBook/getBook?bookId=${id}`)
  },

  // 保存单元
  saveUnit(data) {
    return post(`/manager/teachingBook/saveUnit`, data)
  },
  // 删除单元
  deleteUnit(data) {
    return post(`/manager/teachingBook/deleteUnit`, data)
  },
  // 修改单元
  updateUnit(data) {
    return post(`/manager/teachingBook/updateUnit`, data)
  },

  // 删除曲目
  deleteChapter(data) {
    return post(`/manager/teachingBook/deleteChapter`, data)
  },
  // 更新曲目
  updateChapter(data) {
    return post(`/manager/teachingBook/updateChapter`, data)
  },
  // 新增曲目
  addChapter(data) {
    return post(`/manager/teachingBook/addChapter`, data)
  }
}

/** ------------------------ 课程包接口 -------------------------**/
export const PackageModel = {
  // 获取列表
  getList(data) {
    return post(`manager/coursePackage/page`, data)
  },
  // 获取启用列表
  getListActive() {
    return get(`manager/coursePackage/listActive`)
  },
  // 新增
  add(data) {
    return post(`/manager/coursePackage/save`, data)
  },
  // 修改
  update(data) {
    return post(`/manager/coursePackage/update`, data)
  },
  // 切换状态
  updateActive(data) {
    return post(`/manager/coursePackage/updateActive`, data)
  },
  // 获取详情
  detail(id) {
    return get(`/manager/coursePackage/getCoursePackage?coursePackageId=${id}`)
  }
}

/** ------------------------ 课表接口 -------------------------**/
export const TimetableModel = {
  // 获取列表
  getList(data) {
    return post(`manager/courseTimetable/page`, data)
  },
  // 获取启用的列表
  getListActive(data) {
    return get(`manager/courseTimetable/listActive`, data)
  },
  // 新增
  add(data) {
    return post(`/manager/courseTimetable/save`, data)
  },
  // 修改
  update(data) {
    return post(`/manager/courseTimetable/update`, data)
  },
  // 切换状态
  updateActive(data) {
    return post(`/manager/courseTimetable/updateActive`, data)
  },
  // 获取详情
  detail(data) {
    return post(`/manager/courseTimetable/getCourseTimetable`, data)
  }
}

/** ------------------------ 账号接口 -------------------------**/
export const AccountModel = {
  // 获取列表
  getList(data) {
    return post(`manager/userAccount/page`, data)
  },
  // 获取启用的老师列表
  getActiveTeacherList(data) {
    return get(`manager/userAccount/listTeacherActive`, data)
  },
  // 新增非老师
  add(data) {
    return post(`/manager/userAccount/saveAccount`, data)
  },
  // 新增老师
  addTeacher(data) {
    return post(`/manager/userAccount/saveTeacherAccount`, data)
  },
  // 修改
  update(data) {
    return post(`/manager/userAccount/updateAccount`, data)
  },
  // 修改
  updateTeacher(data) {
    return post(`/manager/userAccount/updateTeacherAccount`, data)
  },
  // 切换状态
  updateActive(data) {
    return post(`/manager/userAccount/updateActive`, data)
  },
  // 获取详情
  getTeacherDetail(data) {
    return post(`/manager/userAccount/getTeacherAccount`, data)
  }
}

/** ------------------------ 老师分组接口 -------------------------**/
export const TeacherGroupModel = {
  // 获取列表
  getList(data) {
    return post(`/manager/teacherGroup/page`, data)
  },
  // 新增
  add(data) {
    return post(`/manager/teacherGroup/save`, data)
  },
  // 修改
  update(data) {
    return post(`/manager/teacherGroup/update`, data)
  },
  // 切换状态
  updateActive(data) {
    return post(`/manager/teacherGroup/updateActive`, data)
  },
  // 获取详情
  getTeacherGroup(data) {
    return post(`/manager/teacherGroup/getTeacherGroup`, data)
  }
}

/** ------------------------ 参数管理接口(投诉原因) -------------------------**/
export const DictModel = {
  // 获取列表
  getList(data) {
    return post(`/manager/dict/list`, data)
  },
  // 新增
  add(data) {
    return post(`/manager/dict/save`, data)
  },
  // 删除
  delete(data) {
    return post(`/manager/dict/deleteDict`, data)
  }
}

/** ------------------------ 续课规则接口 -------------------------**/
export const RuleModel = {
  // 获取列表
  getList(data) {
    return post(`/manager/renewRule/list`, data)
  },
  // 保存
  save(data) {
    return post(`/manager/renewRule/updateOrSave`, data)
  }
}

/** ------------------------ 续课规则接口 -------------------------**/
export const TrainModel = {
  // 获取列表
  getList() {
    return post(`/manager/trainTicket/list`)
  },
  // 保存
  add(data) {
    return post(`/manager/trainTicket/save`, data)
  },
  // 修改
  update(data) {
    return post(`/manager/trainTicket/update`, data)
  },
  // 修改状态
  updateActive(data) {
    return post(`/manager/trainTicket/updateActive`, data)
  }
}
