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
  listActive() {
    return get(`/manager/course/listActive`)
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
