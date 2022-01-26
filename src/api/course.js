import { post } from './http'

/** ------------------------ 课程管理接口 -------------------------**/
export const CourseModel = {
  // 获取课程列表
  getCourseList(data) {
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
  updateCourseActive(data) {
    return post(`/manager/course/updateActive`, data)
  },
}

