import React, { useEffect, useState } from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import axios from "axios";
import NoData from "../../../SharedModule/Components/NoData/NoData";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import noData from "../../../assets/images/nodata.png";

export default function CategoriesList() {
  const baseUrl = "http://upskilling-egypt.com:3002";
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelState, setModelState] = useState("close");
  const [itemId, setItemId] = useState(0);

  const showAddModal = () => {
    setModelState("modal-one");
  };

  const showDeleteModal = (id) => {
    setItemId(id);
    setModelState("modal-two");
  };
  const showUpdataModal = (categoryItem) => {
    setItemId(categoryItem.id);
    setValue("name",categoryItem.name)
    setModelState("modal-three");
  };
  
  const handleClose = () => setModelState("close");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  //-----------------------------------AddCategory----------------------------
  const onSubmit = (data) => {
    setIsLoading(true);
    axios
      .post(`${baseUrl}/api/v1/Category/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        handleClose();
        getCategories();
        setIsLoading(false);
        reset();
        toast.success("Category Added Successfully");
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        toast.error("Axios Error!!!");
      });
  };

  //-----------------------------------ShowCategories----------------------------
  const getCategories = () => {
    axios
      .get(`${baseUrl}/api/v1/Category/?pageSize=10&pageNumber=1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        setCategoriesList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Axios Error!!!");
      });
  };
  // ----------------------------------deleteCategory------------------------------
  const deleteCategory = () => {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/api/v1/Category/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) =>{
        console.log(response);
        handleClose();
        setIsLoading(false);
        toast.success("Category deleted successfully")
        getCategories();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Axios error!!")
        setIsLoading(false);
      });
  };

   // ----------------------------------updateCategory------------------------------
   const updateCategory = (data) => {
    setIsLoading(true);
    axios
      .put(`${baseUrl}/api/v1/Category/${itemId}`,data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) =>{
        console.log(response);
        handleClose();
        setIsLoading(false);
        toast.success("Category updated successfully")
        getCategories();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Axios error!!")
        setIsLoading(false);
      });
  };


  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <Header
        prefix={"Categories"}
        title={"Item"}
        paragraph={`You can now add your items that any user can order it from the Application and you can edit`}
      />
      <Modal show={modelState == "modal-one"} onHide={handleClose}>
        <Modal.Body>
          <h1>Add Category</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group my-5">
              <input
                type="text"
                placeholder="Category Name"
                className="form-control bgMain"
                {...register("name", { required: true })}
              />
              {errors.name && errors.name.type === "required" && (
                <span className="text-danger">Name is required!!</span>
              )}
            </div>
            <hr />
            <div className="form-group my-3 text-end">
              <button
                type="submit"
                className={
                  "btn btn-success w-25" + (isLoading ? " disabled" : " ")
                }
              >
                {isLoading == true ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal show={modelState == "modal-two"} onHide={handleClose}>
        <Modal.Body>
          <div className="text-center">
            <img className="w-50" src={noData} alt="avatar" />
            <h4 className="my-3">Delete This Item ?</h4>
            <span className="text-muted">
              are you sure you want to delete this item ? if you are sure just
              click on delete it
            </span>
            <hr />
            <div className="form-group my-3 text-end">
              <button onClick={deleteCategory}   className={"btn btn-outline-danger" + (isLoading ? " disabled" : "")}>
                {isLoading == true ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Delete this item"
                )}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={modelState == "modal-three"} onHide={handleClose}>
        <Modal.Body>
          <h1>Update Category</h1>
          <form onSubmit={handleSubmit(updateCategory)}>
            <div className="form-group my-5">
              <input
                type="text"
                placeholder="Category Name"
                className="form-control bgMain"
                {...register("name", { required: true })}
              />
              {errors.name && errors.name.type === "required" && (
                <span className="text-danger">Name is required!!</span>
              )}
            </div>
            <hr />
            <div className="form-group my-3 text-end">
              <button
                type="submit"
                className={
                  "btn btn-success w-25" + (isLoading ? " disabled" : " ")
                }
              >
                {isLoading == true ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <div className="row mx-2 p-3">
        <div className="col-md-6">
          <div>
            <h6>Categories Table Detailes</h6>
            <span>You can check all details</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="text-end">
            <button onClick={showAddModal} className="btn btn-success">
              Add New Category
            </button>
          </div>
        </div>
        <div>
          {categoriesList.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Category Name</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoriesList.map((category) => (
                  <tr key={category.id}>
                    <th scope="row">{category.id}</th>
                    <td>{category.name}</td>
                    <td>
                      <FaRegEdit onClick={()=>showUpdataModal(category)} className="text-warning mx-2" />
                      <FaRegTrashCan
                        onClick={() => showDeleteModal(category.id)}
                        className="text-danger"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </>
  );
}
