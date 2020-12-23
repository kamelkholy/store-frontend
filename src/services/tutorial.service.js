import http from "../http-common";

class TutorialDataService {
  getAll() {
    return http.get("/categories");
  }

  get(id) {
    return http.get(`/categories/${id}`);
  }
  getSelect() {
    return http.get(`/categories?nonSub=true`);
  }
  create(data) {
    return http.post("/categories", data);
  }

  update(id, data) {
    return http.put(`/categories/${id}`, data);
  }

  delete(id) {
    return http.delete(`/categories/${id}`);
  }
  deleteSubCategory(id, subCategory) {
    return http.post(`/categories/${id}`, { subCategory });
  }
  deleteAll(ids) {
    console.log(ids);
    return http.delete(`/categories`, { data: { ids } });
  }

  findByTitle(title) {
    return http.get(`/tutorials?title=${title}`);
  }
}

export default new TutorialDataService();
