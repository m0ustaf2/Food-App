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
import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import Loading from "../../../SharedModule/Components/Loading/Loading";
import { Helmet } from "react-helmet";

export default function RecipesList() {
  const [RecipesList, setRecipesList] = useState([]);
  const [TagsList, setTagsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [modalState, setModalState] = useState("close");
  const [itemId, setItemId] = useState(0);
  const [recipe, setRecipe] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [pagesArray, setPagesArray] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [selectedTagId, setselectedTagId] = useState(0);
  const [selectedCatId, setselectedCatId] = useState(0);
  const [currentPg, setCurrentPg] = useState(1);


  const handleClose = () => setModalState("close");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  let { headers, baseUrl, HeadersWithContent } = useContext(AuthContext);
  const showDeleteModal = (id) => {
    setItemId(id);
    setModalState("delete-modal");
  };
  const showUpdateModal = (item) => {
    console.log(item);
    setRecipe(item);
    setItemId(item?.id);
    setValue("name", item?.name);
    setValue("price", item?.price);
    setValue("tagId", item?.tag?.id); //tag:{id: 3, name: 'Snack'}
    setValue("categoriesIds", item?.category[0]?.id); //0:{id: 350, name: 'salad'}
    setValue("description", item?.description);
    setValue("recipeImage", item?.recipeImage);
    setModalState("update-modal");
  };

  const showAddModal = () => {
    setModalState("add-modal");
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
          headers: HeadersWithContent,
        }
      )
      .then((response) => {
        handleClose();
        getAllRecipes();
        setIsLoading(false);
        reset();
        toast.success(response?.data?.message || "Recipe created successfully");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error?.response?.data?.message || "Axios Error!!!");
      });
  };
  //--------------------getAllRecipes---------------------
  const getAllRecipes = (currentPg, name, tagId, categoryId) => {
    setIsLoading(true);
    axios
      .get(`${baseUrl}/api/v1/Recipe/`, {
        headers,
        params: {
          pageSize: 5,
          pageNumber: currentPg,
          name: name,
          tagId: tagId,
          categoryId: categoryId,
        },
      })
      .then((response) => {
        setRecipesList(response?.data?.data);
        setIsLoading(false);
        setPagesArray(
          Array(response.data.totalNumberOfPages)
            .fill()
            .map((_, i) => i + 1)
        );
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Axios Error!!!");
        setIsLoading(false);
      });
  };
 // --------change-page--------
 const changePage = (pgindex, searchString) => {
  console.log(pgindex);
  setCurrentPg(pgindex);
  getAllRecipes(pgindex, searchString);
};
// --------handle-next-btn--------
const nextPages = () => {
  setCurrentPg(parseInt(currentPg) + 1);
  getAllRecipes(parseInt(currentPg) + 1);
};
// --------handle-previous-btn--------
const previousPages = () => {
  setCurrentPg(parseInt(currentPg) - 1);
  getAllRecipes(parseInt(currentPg) - 1);
};
  // ---------------------deleteRecipe--------------------
  const deleteRecipe = () => {
    setIsLoading(true);
    axios
      .delete(`${baseUrl}/api/v1/Recipe/${itemId}`, {
        headers,
      })
      .then((response) => {
        handleClose();
        setIsLoading(false);
        toast.success(response?.data?.message || "Recipe deleted successfully");
        getAllRecipes();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.response?.data?.message || "Axios error!!");
        setIsLoading(false);
      });
  };
  // ---------------------updateRecipe--------------------
  const updateRecipe = (data) => {
    // console.log(data);
    setIsLoading(true);
    axios
      .put(
        `${baseUrl}/api/v1/Recipe/${itemId}`,
        { ...data, recipeImage: data.recipeImage[0] },
        {
          headers: HeadersWithContent,
        }
      )
      .then((response) => {
        handleClose();
        setIsLoading(false);
        toast.success("Recipe updated successfully");
        getAllRecipes();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Axios error!!");
        setIsLoading(false);
      });
  };

  //-------------------getalltags-----------
  const getAllTags = () => {
    axios
      .get(`${baseUrl}/api/v1/tag/`, {
        headers,
      })
      .then((response) => {
        setTagsList(response?.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Axios Error!!!");
      });
  };

  //----------------getall categories---------
  const getCategories = () => {
    axios
      .get(`${baseUrl}/api/v1/Category/?pageSize=20&pageNumber=1`, {
        headers,
      })
      .then((response) => {
        setCategoriesList(response?.data?.data);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Axios Error!!!");
      });
  };
  // *********************searchByName*******************
  const getNameValue = (input) => {
    console.log(input.target.value);
    setSearchString(input.target.value);
    getAllRecipes(1, input.target.value, selectedTagId, selectedCatId);
  };
  // ********************SearchByTagId********************
  const getTagValue = (select) => {
    setselectedTagId(select.target.value);
    getAllRecipes(1, searchString, select.target.value, selectedCatId);
  };
  // ********************SearchByCategoryId********************
  const getCategoryValue = (select) => {
    setselectedCatId(select.target.value);
    getAllRecipes(1, searchString, selectedTagId, select.target.value);
  };
  // -------------------------------------------------
  useEffect(() => {
    getAllRecipes();
    getCategories();
    getAllTags();
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Recipes List</title>
      </Helmet>
      <div className="responsiv">
      <Header
        prefix={"Recipes"}
        title={"Items"}
        paragraph={`You can now add your items that any user can order it from the Application and you can edit`}
      />

      </div>
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
                  valueAsNumber: true,
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
                  valueAsNumber: true,
                })}
                className="form-select bgMain  my-2 "
              >
                <option value={""}>Please,Choose Tagig 👋</option>
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
              <select
                {...register("categoriesIds", {
                  required: true,
                  valueAsNumber: true,
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
                {...register("description", {
                  required: true,
                  pattern: {
                    value: /^[A-Za-z0-9\s]{4,}$/,
                    message:
                      "You description must contains only letters, digits, and spaces, and it enforces a minimum length of four characters!!",
                  },
                })}
              ></textarea>
              {errors.description && errors.description.type === "required" && (
                <span className="text-danger">
                  Recipe description is required!!
                </span>
              )}
              {errors.description && errors.description.type === "pattern" && (
                <span className="text-danger">
                  {errors?.description?.message}
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
      {/* ************************Update Modal******************************* */}
      <Modal show={modalState == "update-modal"} onHide={handleClose}>
        <Modal.Body>
          <h1>Update Recipe</h1>
          <form onSubmit={handleSubmit(updateRecipe)}>
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
                {...register("description", {
                  required: true,
                  pattern: {
                    value: /^[A-Za-z0-9\s]{4,}$/,
                    message:
                      "You description must contains only letters, digits, and spaces, and it enforces a minimum length of four characters!!",
                  },
                })}
              ></textarea>
              {errors.description && errors.description.type === "required" && (
                <span className="text-danger">
                  Recipe description is required!!
                </span>
              )}
              {errors.description && errors.description.type === "pattern" && (
                <span className="text-danger">
                  {errors?.description?.message}
                </span>
              )}

              {/* **********************imageInput************************ */}
              <input
                type="file"
                accept="image/*"
                className="form-control my-2 bgMain"
                {...register("recipeImage")}
              />
              <div className="img-container">
                {recipe?.imagePath ? (
                  <img
                    className="img-fluid"
                    src={`${baseUrl}/` + recipe?.imagePath}
                    alt="recipe-img"
                  />
                ) : (
                  <img className="img-fluid" src={noData} alt="recipe-img" />
                  
                )}
              </div>
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

      <div className="row mx-2 p-3 responsiv">
        <div className="col-md-6">
          <div>
            <h6 className="fw-bold">Recipes Table Detailes</h6>
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
          <div className="row my-2">
            <div className="col-md-4 responsiv my-1">
              <input
                onChange={getNameValue}
                placeholder="Search by Recipe name..."
                className="form-control border-success"
                type="text"
              />
            </div>
            <div className="col-md-4  responsiv my-1">
              <select onChange={getTagValue} className="form-select border-success">
                <option value={""}>Search by Tagig</option>
                {TagsList.map((tag, index) => (
                  <option value={tag.id} key={index}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4 responsiv my-1">
              <select onChange={getCategoryValue} className="form-select border-success">
                <option value={""}>Search by categoriesIds</option>
                {categoriesList.map((category, index) => (
                  <option value={category.id} key={index}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {!isLoading ? (
            <>
              {RecipesList.length > 0 ? (
                <div className="col-md-12">
                  <div className="table-responsive tble-res ">
                  <table className="table table-responsive  table-striped table-success">
                    <thead>
                      <tr>
                        <th className="table-secondary" scope="col">
                          #
                        </th>
                        <th className="table-secondary" scope="col">
                          Item Name
                        </th>
                        <th className="table-secondary" scope="col">
                          Image
                        </th>
                        <th className="table-secondary" scope="col">
                          Price
                        </th>
                        <th className="table-secondary" scope="col">
                          Description
                        </th>
                        <th className="table-secondary" scope="col">
                          Category
                        </th>
                        <th className="table-secondary" scope="col">
                          Tag
                        </th>
                        <th className="table-secondary" scope="col">
                          Actions
                        </th>
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
                                  className="img-fluid rounded-2"
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
                            <FaRegEdit
                              onClick={() => showUpdateModal(Recipe)}
                              className="text-warning mx-2 edit"
                            />
                            <FaRegTrashCan
                              onClick={() => showDeleteModal(Recipe.id)}
                              className="text-danger del"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <nav className="d-flex justify-content-center">
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
