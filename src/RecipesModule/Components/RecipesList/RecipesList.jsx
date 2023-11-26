import React, { useEffect, useState } from "react";
import Header from "../../../SharedModule/Components/Header/Header";
import NoData from "../../../SharedModule/Components/NoData/NoData";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import Modal from "react-bootstrap/Modal";
import noData from "../../../assets/images/nodata.png";
import { useForm } from "react-hook-form";

export default function RecipesList() {
  const baseUrl = "http://upskilling-egypt.com:3002";
  const [RecipesList, setRecipesList] = useState([]);
  const [TagsList, setTagsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const [modalState, setModalState] = useState("close");
  const [itemId, setItemId] = useState(0);
  const handleClose = () => setModalState("close");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const showDeleteModal = (id) => {
    setItemId(id);
    setModalState("delete-modal");
  };

  const showAddModal = () => {
    setModalState("add-modal");
    getCategories();
    getAllTags();
  };
  //-----------------------------------CreateRecipe----------------------------
  const onSubmit = (data) => {
    console.log(data);
    setIsLoading(true);
    axios
      .post(
        `${baseUrl}/api/v1/Recipe/`,
        { ...data, recipeImage: data.recipeImage[0] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log(response);
        handleClose();
        getAllRecipes();
        setIsLoading(false);
        reset();
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        toast.error("Axios Error!!!");
      });
  };

  //--------------------getAllRecipes---------------------
  const getAllRecipes = () => {
    axios
      .get(`${baseUrl}/api/v1/Recipe/?pageSize=10&pageNumber=1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        setRecipesList(response?.data?.data);
        // console.log(response);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Axios Error!!!");
      });
  };

  // ---------------------deleteRecipe--------------------
  const deleteRecipe = () => {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/api/v1/Recipe/${itemId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        // console.log(response);
        handleClose();
        setIsLoading(false);
        toast.success("Recipe deleted successfully");
        getAllRecipes();
      })
      .catch((error) => {
        console.log(error);
        toast.error("Axios error!!");
        setIsLoading(false);
      });
  };

  //-------------------getalltags-----------
  const getAllTags = () => {
    axios
      .get(`${baseUrl}/api/v1/tag/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setTagsList(response?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Axios Error!!!");
      });
  };

  //----------------getall categories---------
  const getCategories = () => {
    axios
      .get(`${baseUrl}/api/v1/Category/?pageSize=10&pageNumber=1`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })
      .then((response) => {
        setCategoriesList(response?.data?.data);
        console.log(response?.data?.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Axios Error!!!");
      });
  };

  useEffect(() => {
    getAllRecipes();
  }, []);

  return (
    <>
      <Header
        prefix={"Recipes"}
        title={"Items"}
        paragraph={`You can now add your items that any user can order it from the Application and you can edit`}
      />
      {/* ************************Add Modal******************************* */}
      <Modal show={modalState == "add-modal"} onHide={handleClose}>
        <Modal.Body>
          <h1>Add Recipe</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group my-5">
              {/* **********************NameInput************************ */}
              <input
                type="text"
                placeholder="Enter Recipe Name"
                className="form-control my-2 bgMain"
                {...register("name", {
                  required: true,
                  minLength: {
                    value: 2,
                    message: "Recipe name shouldn't be less than two character",
                  },
                })}
              />
              {errors.name && errors.name.type === "required" && (
                <span className="text-danger">Recipe name is required!!</span>
              )}
              {errors.name && errors.name.type === "minLength" && (
                <span className="text-danger">{errors.name?.message}</span>
              )}
              {/* **********************PriceInput************************ */}
              <input
                type="number"
                placeholder="Enter Recipe Price"
                className="form-control my-2 bgMain"
                {...register("price", {
                  required: true,
                  validate: {
                    positive: (value) =>
                      value > 0 || "price shouldn't be less than Zero",
                  },
                })}
              />
              {errors.price && errors.price.type === "required" && (
                <span className="text-danger">Price is required!!</span>
              )}
              {errors.price && (
                <span className="text-danger">{errors.price?.message}</span>
              )}
              {/* **********************TagsIDInput************************ */}
              <select
                {...register("tagId", {
                  required: true,
                })}
                className="form-select bgMain  my-2 "
              >
                <option value={""}>PLZ,Choose Tagig 👋</option>
                {TagsList.map((tag, index) => (
                  <option value={tag.id} key={index}>
                    {tag.name}
                  </option>
                ))}
              </select>
              {errors.tagId && errors.tagId.type === "required" && (
                <span className="text-danger">tagId is required!!</span>
              )}
              {/* **********************CategoriesIDInput************************ */}
              {/* <input
                list="categoriessIds"
                className="form-control bgMain  my-2"
                placeholder="Choose categorieIds"
                name="categoriesIds"
                id="categoriesIds"
                {...register("categoriesIds", {
                  required: true,
                })}
              />
              <datalist id="categoriessIds">
                {categoriesList.map((category, index) => (
                  <option key={index} value={category.id} />
                ))}
              </datalist> */}

              <select
                {...register("categoriesIds", {
                  required: true,
                })}
                className="form-select bgMain  my-2 "
              >
                <option value={""}> Please,Choose categoriesIds 👋</option>
                {categoriesList.map((category, index) => (
                  <option value={category.id} key={index}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoriesIds &&
                errors.categoriesIds.type === "required" && (
                  <span className="text-danger">
                    categoriesIds is required!!
                  </span>
                )}
              {/* **********************textAreaInput************************ */}
              <textarea
                className="form-control my-2 bgMain"
                placeholder="Recipe Description"
                rows="4"
                cols="50"
                {...register("description", { required: true })}
              ></textarea>
              {errors.description && errors.description.type === "required" && (
                <span className="text-danger">
                  Recipe description is required!!
                </span>
              )}

              {/* **********************imageInput************************ */}
              <input
                type="file"
                accept="image/*"
                className="form-control my-2 bgMain"
                {...register("recipeImage")}
              />

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
                  "Add"
                )}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      {/* ************************Delete Modal******************************* */}
      <Modal show={modalState == "delete-modal"} onHide={handleClose}>
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
                onClick={deleteRecipe}
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

      <div className="row mx-2 p-3">
        <div className="col-md-6">
          <div>
            <h6>Recipes Table Detailes</h6>
            <span>You can check all details</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="text-end">
            <button onClick={showAddModal} className="btn btn-success">
              Add New Recipe
            </button>
          </div>
        </div>
        <div>
          {RecipesList.length > 0 ? (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Item Name</th>
                  <th scope="col">Image</th>
                  <th scope="col">Price</th>
                  <th scope="col">Description</th>
                  <th scope="col">Category</th>
                  <th scope="col">Tag</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {RecipesList.map((Recipe, index) => (
                  <tr key={Recipe?.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{Recipe?.name}</td>
                    <td>
                      <div className="img-container">
                        {Recipe.imagePath ? (
                          <img
                            className="img-fluid"
                            src={`${baseUrl}/` + Recipe.imagePath}
                            alt="recipe-img"
                          />
                        ) : (
                          <img
                            className="img-fluid"
                            src={noData}
                            alt="recipe-img"
                          />
                        )}
                      </div>
                    </td>
                    <td>{Recipe?.price}</td>
                    <td>{Recipe?.description}</td>
                    <td>{Recipe?.category[0]?.name}</td>
                    <td>{Recipe?.tag?.name}</td>
                    <td>
                      {/* <FaRegEdit className="text-warning mx-2" /> */}
                      <FaRegTrashCan
                        onClick={() => showDeleteModal(Recipe.id)}
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
