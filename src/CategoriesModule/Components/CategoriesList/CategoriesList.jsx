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
  const baseUrl = "https://upskilling-egypt.com:443";
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelState, setModelState] = useState("close");
  const [itemId, setItemId] = useState(0);
  const [pagesArray, setPagesArray] = useState([]);
  const [searchString, setSearchString] = useState("");

  const showAddModal = () => {
    setModelState("modal-one");
  };

  const showDeleteModal = (id) => {
    setItemId(id);
    setModelState("modal-two");
  };
  const showUpdataModal = (categoryItem) => {
    setItemId(categoryItem.id);
    setValue("name", categoryItem.name);
    setModelState("modal-three");
  };

  const handleClose = () => setModelState("close");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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
        console.log(response);
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
  const getCategories = (pageNo,name) => {
    axios
      .get(`${baseUrl}/api/v1/Category/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        params: {
          pageSize: 5,
          pageNumber: pageNo,
          name:name
        },
      })
      .then((response) => {
        setCategoriesList(response.data.data);
        console.log(
          Array(response.data.totalNumberOfPages)
            .fill()
            .map((_, i) => i + 1)
        );
        setPagesArray(
          Array(response.data.totalNumberOfPages)
            .fill()
            .map((_, i) => i + 1)
        );
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
      .then((response) => {
        console.log(response);
        handleClose();
        setIsLoading(false);
        toast.success("Category deleted successfully");
        getCategories();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Axios error!!");
        setIsLoading(false);
      });
  };

  // ----------------------------------updateCategory------------------------------
  const updateCategory = (data) => {
    setIsLoading(true);
    axios
      .put(`${baseUrl}/api/v1/Category/${itemId}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log(response);
        handleClose();
        setIsLoading(false);
        toast.success("Category updated successfully");
        getCategories();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Axios error!!");
        setIsLoading(false);
      });
  };

  // *********************searchByName*******************
  const getNameValue=(input)=>{
    setSearchString(input.target.value)
getCategories(1,input.target.value);
  }
  useEffect(() => {
    getCategories(1);
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
              <button
                onClick={deleteCategory}
                className={
                  "btn btn-outline-danger" + (isLoading ? " disabled" : "")
                }
              >
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
          <input onChange={getNameValue} placeholder="Search by name..." className="form-control my-2" type="text" />
          {categoriesList.length > 0 ? (
            <div>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Category Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesList.map((category, index) => (
                    <tr key={category.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{category.name}</td>
                      <td>
                        <FaRegEdit
                          onClick={() => showUpdataModal(category)}
                          className="text-warning mx-2"
                        />
                        <FaRegTrashCan
                          onClick={() => showDeleteModal(category.id)}
                          className="text-danger"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav aria-label="...">
                <ul className="pagination pagination-sm">
                  {pagesArray.map((pageNo ,index)=>
                    <li key={index}
                    onClick={()=>getCategories(pageNo,searchString)}
                    className="page-item">
                      <a className="page-link">{pageNo}</a>
                      </li>
                  )}
                 
                </ul>
              </nav>
            </div>
          ) : (
            <NoData />
          )}
        </div>
      </div>
    </>
  );
}
