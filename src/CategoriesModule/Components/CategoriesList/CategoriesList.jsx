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
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import Loading from "../../../SharedModule/Components/Loading/Loading";
import { Helmet } from "react-helmet";

export default function CategoriesList() {
  let { headers, baseUrl } = useContext(AuthContext);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modelState, setModelState] = useState("close");
  const [itemId, setItemId] = useState(0);
  const [pagesArray, setPagesArray] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [currentPg, setCurrentPg] = useState(1);

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
      .post(`${baseUrl}/api/v1/Category/`, data, { headers })
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
  const getCategories = (currentPg, name) => {
    setIsLoading(true);
    axios
      .get(`${baseUrl}/api/v1/Category/`, {
        headers,
        params: {
          pageSize: 5,
          pageNumber: currentPg,
          name: name,
        },
      })
      .then((response) => {
        setCategoriesList(response?.data?.data);
        setIsLoading(false);
        setPagesArray(
          Array(response?.data?.totalNumberOfPages)
            .fill()
            .map((_, i) => i + 1)
        );
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || "Axios Error!!!");
        setIsLoading(false);
      });
  };

  // --------change-page--------
  const changePage = (pgindex, searchString) => {
    console.log(pgindex);
    setCurrentPg(pgindex);
    getCategories(pgindex, searchString);
  };
  // --------handle-next-btn--------
  const nextPages = () => {
    setCurrentPg(parseInt(currentPg) + 1);
    getCategories(parseInt(currentPg) + 1);
  };
  // --------handle-previous-btn--------
  const previousPages = () => {
    setCurrentPg(parseInt(currentPg) - 1);
    getCategories(parseInt(currentPg) - 1);
  };
  // ----------------------------------deleteCategory------------------------------
  const deleteCategory = () => {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/api/v1/Category/${itemId}`, { headers })
      .then((response) => {
        handleClose();
        setIsLoading(false);
        toast.success("Category deleted successfully");
        getCategories();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || "Axios error!!");
        setIsLoading(false);
      });
  };

  // ----------------------------------updateCategory------------------------------
  const updateCategory = (data) => {
    setIsLoading(true);
    axios
      .put(`${baseUrl}/api/v1/Category/${itemId}`, data, { headers })
      .then((response) => {
        // console.log(response);
        handleClose();
        setIsLoading(false);
        toast.success("Category updated successfully");
        getCategories();
      })
      .catch((error) => {
        // console.log(error);
        toast.error(error?.response?.data?.message || "Axios error!!");
        setIsLoading(false);
      });
  };

  // *********************searchByName*******************
  const getNameValue = (input) => {
    setSearchString(input.target.value);
    getCategories(1, input.target.value);
  };
  useEffect(() => {
    getCategories(1);
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Categories List</title>
      </Helmet>
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
          <input
            onChange={getNameValue}
            placeholder="Search by name..."
            className="form-control my-2 border-success"
            type="text"
          />
          {!isLoading ? (
            <>
              {categoriesList.length > 0 ? (
                <div>
                  <table className="table table-striped table-success">
                    <thead>
                      <tr>
                        <th className="table-secondary" scope="col">
                          #
                        </th>
                        <th className="table-secondary" scope="col">
                          Category Name
                        </th>
                        <th className="table-secondary" scope="col">
                          Actions
                        </th>
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
                              className="text-warning mx-2 edit"
                            />
                            <FaRegTrashCan
                              onClick={() => showDeleteModal(category.id)}
                              className="text-danger del"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <nav
                    className="d-flex justify-content-center"
                  >
                    <ul className="pagination pagination-sm">
                      <li className={currentPg <= 1 ? "disabled  page-item":"page-item" }>
                        <a className="page-link pag" onClick={()=>previousPages()}>Previous</a>
                      </li>
                      {pagesArray.map((pageNo, index) => (
                        <li
                          key={index}
                          onClick={() => changePage(pageNo, searchString)}
                          className={pageNo ==currentPg ? "active page-item":"page-item" }
                        >
                          <a className="page-link pag">{pageNo}</a>
                        </li>
                      ))}
                      <li className={currentPg >= pagesArray.length ? "disabled page-item":"page-item" }>
                        <a className="page-link pag" onClick={()=>nextPages()}>
                          Next
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              ) : (
                <NoData />
              )}
            </>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
}
